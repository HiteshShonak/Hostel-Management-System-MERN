import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ActivityIndicator, ScrollView, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useUser, useTodayAttendance, useAttendanceStats, useMarkAttendance, useRefreshDashboard, useAttendanceHistory, useSystemConfig } from '@/lib/hooks';
import { formatDateLong, formatTime, formatDateWithDay, getCurrentISTHour, formatHour, isWithinTimeWindow } from '@/lib/utils/date';
import { useTheme } from '@/lib/theme-context';

export default function AttendancePage() {
    const { colors, isDark } = useTheme();
    const { data: user } = useUser();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const { data: todayData, isLoading: checkingToday } = useTodayAttendance();
    const { data: stats } = useAttendanceStats();
    const { data: history, isLoading: loadingHistory } = useAttendanceHistory();
    const markMutation = useMarkAttendance();
    const { data: config } = useSystemConfig();

    const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied' | 'ready'>('idle');
    const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const isMarked = todayData?.marked || false;
    const isScanning = markMutation.isPending || locationStatus === 'requesting';
    const geofence = todayData?.geofence;

    // Check if within attendance window using dynamic config
    const attendanceWindow = config?.attendanceWindow;
    const isWindowEnabled = attendanceWindow?.enabled ?? true;
    const windowStart = attendanceWindow?.startHour ?? 19;
    const windowEnd = attendanceWindow?.endHour ?? 22;
    const isWithinWindow = isWindowEnabled ? isWithinTimeWindow(windowStart, windowEnd) : true;

    // Request location permission on mount
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationStatus('denied');
            } else {
                setLocationStatus('ready');
            }
        })();
    }, []);

    // Pulse animation when scanning
    useEffect(() => {
        if (isScanning) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.1, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
                ])
            ).start();
        } else {
            pulseAnim.stopAnimation();
        }
    }, [isScanning]);

    const handleMark = async () => {
        if (isMarked || isScanning) return;

        // Check if within attendance window
        if (isWindowEnabled && !isWithinWindow) {
            Alert.alert(
                'Attendance Window Closed',
                `Attendance can only be marked between ${formatHour(windowStart)} and ${formatHour(windowEnd)} IST.`,
                [{ text: 'OK' }]
            );
            return;
        }

        // Check permission
        if (locationStatus === 'denied') {
            Alert.alert(
                'Location Required',
                'Please enable location access in settings to mark attendance.',
                [{ text: 'OK' }]
            );
            return;
        }

        setLocationStatus('requesting');

        try {
            // Get current location with high accuracy
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const coords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };
            setCurrentCoords(coords);

            // Call API with location
            markMutation.mutate(coords, {
                onSuccess: (data) => {
                    setLocationStatus('ready');
                    // Success message is shown by the UI change
                },
                onError: (error: any) => {
                    setLocationStatus('ready');
                    const message = error?.response?.data?.message || error?.message || 'Failed to mark attendance';
                    Alert.alert('Attendance Failed', message);
                },
            });
        } catch (error) {
            setLocationStatus('ready');
            Alert.alert('Location Error', 'Could not get your location. Please try again.');
        }
    };

    if (checkingToday) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="📍 Smart Attendance" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="📍 Smart Attendance" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
                }
            >
                <View style={styles.userInfo}>
                    <Text style={[styles.userName, { color: colors.text }]}>{user?.name || 'Student'}</Text>
                    <Text style={[styles.userRoom, { color: colors.textSecondary }]}>{user?.room || 'Room'} | {user?.hostel || 'Hostel'}</Text>
                    <Text style={[styles.date, { color: colors.textTertiary }]}>{formatDateLong(new Date())} (IST)</Text>
                </View>

                {/* Geofence Info Banner */}
                {geofence && (
                    <View style={[styles.geofenceBanner, {
                        backgroundColor: isDark ? '#172554' : '#eff6ff',
                        borderColor: isDark ? '#1e3a8a' : '#dbeafe',
                        borderWidth: 1
                    }]}>
                        <Ionicons name="location" size={20} color={isDark ? '#60a5fa' : '#1d4ed8'} />
                        <View style={styles.geofenceInfo}>
                            <Text style={[styles.geofenceText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                                {geofence.hostelName} • {geofence.radiusMeters}m radius
                            </Text>
                            {geofence.attendanceWindow && (
                                <Text style={[styles.geofenceTime, { color: isDark ? '#bfdbfe' : '#1e40af' }]}>
                                    Open {formatHour(geofence.attendanceWindow.start)} - {formatHour(geofence.attendanceWindow.end)} IST
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Attendance Window Status */}
                {isWindowEnabled && !isWithinWindow && !isMarked && (
                    <View style={[styles.windowClosedBanner, {
                        backgroundColor: isDark ? '#450a0a' : '#fee2e2',
                        borderColor: isDark ? '#7f1d1d' : '#fecaca',
                        borderWidth: 1
                    }]}>
                        <Ionicons name="time-outline" size={20} color={isDark ? '#f87171' : '#dc2626'} />
                        <Text style={[styles.windowClosedText, { color: isDark ? '#fca5a5' : '#991b1b' }]}>
                            Attendance window is {getCurrentISTHour() < windowStart ? 'not open yet' : 'closed'}. Open {formatHour(windowStart)} - {formatHour(windowEnd)} IST
                        </Text>
                    </View>
                )}

                {/* Location Permission Warning */}
                {locationStatus === 'denied' && (
                    <View style={[styles.warningBanner, {
                        backgroundColor: isDark ? '#451a03' : '#fef3c7',
                        borderColor: isDark ? '#78350f' : '#fcd34d',
                        borderWidth: 1
                    }]}>
                        <Ionicons name="warning" size={20} color={isDark ? '#fbbf24' : '#b45309'} />
                        <Text style={[styles.warningText, { color: isDark ? '#fcd34d' : '#92400e' }]}>Location access required. Please enable in Settings.</Text>
                    </View>
                )}

                <View style={styles.scanArea}>
                    <Pressable onPress={handleMark} disabled={isScanning || isMarked || (isWindowEnabled && !isWithinWindow)}>
                        <Animated.View style={[
                            styles.scanCircle,
                            {
                                backgroundColor: isDark ? '#18181b' : '#f8f9fa',
                                borderColor: isDark ? '#27272a' : '#e5e5e5'
                            },
                            isMarked && {
                                backgroundColor: isDark ? '#064e3b' : '#f0fdf4',
                                borderColor: isDark ? '#059669' : '#22c55e'
                            },
                            isScanning && {
                                backgroundColor: isDark ? 'rgba(29, 78, 216, 0.1)' : '#eff6ff',
                                borderColor: isDark ? '#1d4ed8' : '#3b82f6'
                            },
                            { transform: [{ scale: isScanning ? pulseAnim : 1 }] }
                        ]}>
                            {isMarked ? (
                                <Ionicons name="checkmark-circle" size={96} color={isDark ? '#4ade80' : '#22c55e'} />
                            ) : (
                                <Ionicons name="location" size={96} color={isScanning ? (isDark ? '#3b82f6' : '#1d4ed8') : (isDark ? '#52525b' : '#737373')} />
                            )}
                        </Animated.View>
                    </Pressable>

                    <View style={styles.statusText}>
                        {isMarked ? (
                            <>
                                <Text style={[styles.markedText, { color: isDark ? '#4ade80' : '#15803d' }]}>Attendance Marked!</Text>
                                <Text style={[styles.timeText, { color: colors.textSecondary }]}>Recorded at {formatTime(todayData?.attendance?.markedAt || new Date())}</Text>
                                {todayData?.attendance?.location?.distanceFromHostel && (
                                    <Text style={[styles.distanceText, { color: colors.textTertiary }]}>📍 {todayData.attendance.location.distanceFromHostel}m from hostel</Text>
                                )}
                            </>
                        ) : isScanning ? (
                            <>
                                <Text style={[styles.scanningText, { color: isDark ? '#60a5fa' : '#1d4ed8' }]}>Getting Location...</Text>
                                <Text style={[styles.timeText, { color: colors.textSecondary }]}>Please wait</Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.tapText, { color: colors.text }]}>Tap to Mark Attendance</Text>
                                <Text style={[styles.timeText, { color: colors.textSecondary }]}>Location will be verified</Text>
                            </>
                        )}
                    </View>
                </View>

                <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Text style={[styles.statsTitle, { color: colors.text }]}>{stats?.month || 'This Month'}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}><Text style={[styles.statValueGreen, { color: isDark ? '#4ade80' : '#15803d' }]}>{stats?.present || 0}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Present</Text></View>
                        <View style={styles.statItem}><Text style={[styles.statValueRed, { color: isDark ? '#f87171' : '#ef4444' }]}>{stats?.absent || 0}</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Absent</Text></View>
                        <View style={styles.statItem}><Text style={[styles.statValueBlue, { color: isDark ? '#60a5fa' : '#1d4ed8' }]}>{stats?.percentage || 0}%</Text><Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attendance</Text></View>
                    </View>
                </View>

                {/* Attendance History */}
                <View style={styles.historySection}>
                    <Text style={[styles.historyTitle, { color: colors.text }]}>Attendance History</Text>
                    {loadingHistory ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
                    ) : history && history.length > 0 ? (
                        <View style={styles.historyList}>
                            {history.map((record: any) => (
                                <View key={record._id} style={[styles.historyItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                                    <View style={styles.historyIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color={isDark ? '#4ade80' : '#22c55e'} />
                                    </View>
                                    <View style={styles.historyContent}>
                                        <Text style={[styles.historyDate, { color: colors.text }]}>
                                            {formatDateWithDay(record.date)}
                                        </Text>
                                        <Text style={[styles.historyTime, { color: colors.textSecondary }]}>
                                            Marked at {formatTime(record.markedAt)}
                                            {record.location?.distanceFromHostel && ` • ${record.location.distanceFromHostel}m`}
                                        </Text>
                                    </View>
                                    <Text style={[styles.historyBadge, {
                                        color: isDark ? '#4ade80' : '#15803d',
                                        backgroundColor: isDark ? '#064e3b' : '#dcfce7'
                                    }]}>Present</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={[styles.emptyHistory, { backgroundColor: colors.card }]}>
                            <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No attendance records yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    userInfo: { alignItems: 'center', paddingVertical: 16 },
    userName: { fontSize: 18, fontWeight: '600' },
    userRoom: { fontSize: 14, marginTop: 2 },
    date: { fontSize: 12, marginTop: 4 },
    geofenceBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, marginBottom: 8 },
    geofenceInfo: { flex: 1 },
    geofenceText: { fontSize: 14, fontWeight: '600' },
    geofenceTime: { fontSize: 12, marginTop: 2 },
    warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16 },
    warningText: { flex: 1, fontSize: 13 },
    windowClosedBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16 },
    windowClosedText: { flex: 1, fontSize: 13, fontWeight: '500' },
    scanArea: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
    scanCircle: { width: 192, height: 192, borderRadius: 96, borderWidth: 4, alignItems: 'center', justifyContent: 'center' },
    scanCircleScanning: {},
    scanCircleMarked: {},
    statusText: { marginTop: 24, alignItems: 'center' },
    markedText: { fontSize: 20, fontWeight: '700' },
    scanningText: { fontSize: 20, fontWeight: '700' },
    tapText: { fontSize: 20, fontWeight: '700' },
    timeText: { fontSize: 14, marginTop: 4 },
    distanceText: { fontSize: 13, marginTop: 6 },
    statsCard: { padding: 20, borderRadius: 16, borderWidth: 1 },
    statsTitle: { fontWeight: '600', marginBottom: 16, fontSize: 16 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValueGreen: { fontSize: 24, fontWeight: '700' },
    statValueRed: { fontSize: 24, fontWeight: '700' },
    statValueBlue: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 12, marginTop: 4 },
    historySection: { gap: 16 },
    historyTitle: { fontSize: 18, fontWeight: '600' },
    historyList: { gap: 12 },
    historyItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
    historyIcon: { marginRight: 16 },
    historyContent: { flex: 1 },
    historyDate: { fontSize: 15, fontWeight: '600' },
    historyTime: { fontSize: 13, marginTop: 2 },
    historyBadge: { fontSize: 12, fontWeight: '600', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
    emptyHistory: { alignItems: 'center', padding: 40, borderRadius: 16 },
    emptyText: { fontSize: 14, marginTop: 8 },
});
