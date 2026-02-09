import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ActivityIndicator, ScrollView, RefreshControl, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useUser, useTodayAttendance, useAttendanceStats, useMarkAttendance, useRefreshDashboard, useAttendanceHistory } from '@/lib/hooks';

export default function AttendancePage() {
    const { data: user } = useUser();
    const { refreshing, onRefresh } = useRefreshDashboard();
    const { data: todayData, isLoading: checkingToday } = useTodayAttendance();
    const { data: stats } = useAttendanceStats();
    const { data: history, isLoading: loadingHistory } = useAttendanceHistory();
    const markMutation = useMarkAttendance();

    const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'denied' | 'ready'>('idle');
    const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const isMarked = todayData?.marked || false;
    const isScanning = markMutation.isPending || locationStatus === 'requesting';
    const geofence = todayData?.geofence;

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
            <View style={styles.container}>
                <PageHeader title="📍 Smart Attendance" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#1d4ed8" />
                </View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <PageHeader title="📍 Smart Attendance" />
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1d4ed8']} />
                }
            >
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user?.name || 'Student'}</Text>
                    <Text style={styles.userRoom}>{user?.room || 'Room'} | {user?.hostel || 'Hostel'}</Text>
                    <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                </View>

                {/* Geofence Info Banner */}
                {geofence && (
                    <View style={styles.geofenceBanner}>
                        <Ionicons name="location" size={20} color="#1d4ed8" />
                        <View style={styles.geofenceInfo}>
                            <Text style={styles.geofenceText}>
                                {geofence.hostelName} • {geofence.radiusMeters}m radius
                            </Text>
                            {geofence.attendanceWindow && (
                                <Text style={styles.geofenceTime}>
                                    Open {geofence.attendanceWindow.start > 12 ? geofence.attendanceWindow.start - 12 : geofence.attendanceWindow.start} PM - {geofence.attendanceWindow.end > 12 ? geofence.attendanceWindow.end - 12 : geofence.attendanceWindow.end} PM
                                </Text>
                            )}
                        </View>
                    </View>
                )}

                {/* Location Permission Warning */}
                {locationStatus === 'denied' && (
                    <View style={styles.warningBanner}>
                        <Ionicons name="warning" size={20} color="#b45309" />
                        <Text style={styles.warningText}>Location access required. Please enable in Settings.</Text>
                    </View>
                )}

                <View style={styles.scanArea}>
                    <Pressable onPress={handleMark} disabled={isScanning || isMarked}>
                        <Animated.View style={[
                            styles.scanCircle,
                            isMarked && styles.scanCircleMarked,
                            isScanning && styles.scanCircleScanning,
                            { transform: [{ scale: isScanning ? pulseAnim : 1 }] }
                        ]}>
                            {isMarked ? (
                                <Ionicons name="checkmark-circle" size={96} color="#22c55e" />
                            ) : (
                                <Ionicons name="location" size={96} color={isScanning ? '#1d4ed8' : '#737373'} />
                            )}
                        </Animated.View>
                    </Pressable>

                    <View style={styles.statusText}>
                        {isMarked ? (
                            <>
                                <Text style={styles.markedText}>Attendance Marked!</Text>
                                <Text style={styles.timeText}>Recorded at {new Date(todayData?.attendance?.markedAt || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</Text>
                                {todayData?.attendance?.location?.distanceFromHostel && (
                                    <Text style={styles.distanceText}>📍 {todayData.attendance.location.distanceFromHostel}m from hostel</Text>
                                )}
                            </>
                        ) : isScanning ? (
                            <>
                                <Text style={styles.scanningText}>Getting Location...</Text>
                                <Text style={styles.timeText}>Please wait</Text>
                            </>
                        ) : (
                            <>
                                <Text style={styles.tapText}>Tap to Mark Attendance</Text>
                                <Text style={styles.timeText}>Location will be verified</Text>
                            </>
                        )}
                    </View>
                </View>

                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>{stats?.month || 'This Month'}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}><Text style={styles.statValueGreen}>{stats?.present || 0}</Text><Text style={styles.statLabel}>Present</Text></View>
                        <View style={styles.statItem}><Text style={styles.statValueRed}>{stats?.absent || 0}</Text><Text style={styles.statLabel}>Absent</Text></View>
                        <View style={styles.statItem}><Text style={styles.statValueBlue}>{stats?.percentage || 0}%</Text><Text style={styles.statLabel}>Attendance</Text></View>
                    </View>
                </View>

                {/* Attendance History */}
                <View style={styles.historySection}>
                    <Text style={styles.historyTitle}>Attendance History</Text>
                    {loadingHistory ? (
                        <ActivityIndicator size="small" color="#1d4ed8" style={{ marginVertical: 20 }} />
                    ) : history && history.length > 0 ? (
                        <View style={styles.historyList}>
                            {history.map((record: any) => (
                                <View key={record._id} style={styles.historyItem}>
                                    <View style={styles.historyIcon}>
                                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                    </View>
                                    <View style={styles.historyContent}>
                                        <Text style={styles.historyDate}>
                                            {new Date(record.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                        </Text>
                                        <Text style={styles.historyTime}>
                                            Marked at {new Date(record.markedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            {record.location?.distanceFromHostel && ` • ${record.location.distanceFromHostel}m`}
                                        </Text>
                                    </View>
                                    <Text style={styles.historyBadge}>Present</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyHistory}>
                            <Ionicons name="calendar-outline" size={48} color="#d4d4d4" />
                            <Text style={styles.emptyText}>No attendance records yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    userInfo: { alignItems: 'center', paddingVertical: 16 },
    userName: { fontSize: 18, fontWeight: '600', color: '#0a0a0a' },
    userRoom: { fontSize: 14, color: '#737373' },
    date: { fontSize: 12, color: '#737373', marginTop: 4 },
    geofenceBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#eff6ff', borderRadius: 12 },
    geofenceInfo: { flex: 1 },
    geofenceText: { fontSize: 14, fontWeight: '500', color: '#1d4ed8' },
    geofenceTime: { fontSize: 12, color: '#6b7280', marginTop: 2 },
    warningBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, backgroundColor: '#fef3c7', borderRadius: 10 },
    warningText: { flex: 1, fontSize: 13, color: '#92400e' },
    scanArea: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32 },
    scanCircle: { width: 192, height: 192, borderRadius: 96, backgroundColor: '#f5f5f5', borderWidth: 4, borderColor: '#e5e5e5', alignItems: 'center', justifyContent: 'center' },
    scanCircleScanning: { backgroundColor: 'rgba(29, 78, 216, 0.1)', borderColor: '#1d4ed8' },
    scanCircleMarked: { backgroundColor: '#dcfce7', borderColor: '#22c55e' },
    statusText: { marginTop: 24, alignItems: 'center' },
    markedText: { fontSize: 20, fontWeight: '700', color: '#15803d' },
    scanningText: { fontSize: 20, fontWeight: '700', color: '#1d4ed8' },
    tapText: { fontSize: 20, fontWeight: '700', color: '#0a0a0a' },
    timeText: { fontSize: 14, color: '#737373', marginTop: 4 },
    distanceText: { fontSize: 13, color: '#6b7280', marginTop: 6 },
    statsCard: { padding: 16, backgroundColor: '#f5f5f5', borderRadius: 12 },
    statsTitle: { fontWeight: '600', color: '#0a0a0a', marginBottom: 12 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statValueGreen: { fontSize: 24, fontWeight: '700', color: '#15803d' },
    statValueRed: { fontSize: 24, fontWeight: '700', color: '#ef4444' },
    statValueBlue: { fontSize: 24, fontWeight: '700', color: '#1d4ed8' },
    statLabel: { fontSize: 12, color: '#737373' },
    historySection: { gap: 12 },
    historyTitle: { fontSize: 18, fontWeight: '600', color: '#0a0a0a' },
    historyList: { gap: 8 },
    historyItem: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#f9fafb', borderRadius: 10, borderWidth: 1, borderColor: '#e5e5e5' },
    historyIcon: { marginRight: 12 },
    historyContent: { flex: 1 },
    historyDate: { fontSize: 14, fontWeight: '500', color: '#0a0a0a' },
    historyTime: { fontSize: 12, color: '#737373', marginTop: 2 },
    historyBadge: { fontSize: 12, fontWeight: '600', color: '#15803d', backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
    emptyHistory: { alignItems: 'center', padding: 32, backgroundColor: '#fafafa', borderRadius: 12 },
    emptyText: { fontSize: 14, color: '#737373', marginTop: 8 },
});
