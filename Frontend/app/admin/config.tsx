import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useSystemConfig, useUpdateSystemConfig } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';

export default function AdminConfigScreen() {
    const { colors, isDark } = useTheme();
    const { data: config, isLoading, refetch } = useSystemConfig();
    const updateMutation = useUpdateSystemConfig();

    const [latitude, setLatitude] = React.useState('');
    const [longitude, setLongitude] = React.useState('');
    const [radius, setRadius] = React.useState('');
    const [startHour, setStartHour] = React.useState('');
    const [endHour, setEndHour] = React.useState('');
    const [maxGatePassDays, setMaxGatePassDays] = React.useState('');
    const [maxPendingPasses, setMaxPendingPasses] = React.useState('');
    const [gracePeriod, setGracePeriod] = React.useState('');

    React.useEffect(() => {
        if (config) {
            setLatitude(config.hostelCoords?.latitude?.toString() || '');
            setLongitude(config.hostelCoords?.longitude?.toString() || '');
            setRadius(config.geofenceRadiusMeters?.toString() || '50');
            setStartHour(config.attendanceWindow?.startHour?.toString() || '19');
            setEndHour(config.attendanceWindow?.endHour?.toString() || '22');
            setMaxGatePassDays(config.appConfig?.maxGatePassDays?.toString() || '14');
            setMaxPendingPasses(config.appConfig?.maxPendingPasses?.toString() || '3');
            setGracePeriod(config.appConfig?.attendanceGracePeriod?.toString() || '5');
        }
    }, [config]);

    const handleSave = () => {
        updateMutation.mutate(
            {
                hostelCoords: { latitude: parseFloat(latitude), longitude: parseFloat(longitude), name: config?.hostelCoords?.name || 'Main Hostel' },
                geofenceRadiusMeters: parseInt(radius),
                attendanceWindow: { enabled: config?.attendanceWindow?.enabled ?? true, startHour: parseInt(startHour), endHour: parseInt(endHour), timezone: config?.attendanceWindow?.timezone || 'Asia/Kolkata' },
                appConfig: { maxGatePassDays: parseInt(maxGatePassDays) || 14, maxPendingPasses: parseInt(maxPendingPasses) || 3, attendanceGracePeriod: parseInt(gracePeriod) || 5 },
            },
            {
                onSuccess: () => { Alert.alert('Success', 'Configuration updated successfully'); refetch(); },
                onError: (error: unknown) => { Alert.alert('Error', error instanceof Error ? error.message : 'Failed to update'); },
            }
        );
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="System Configuration" showBack />
                <View style={styles.loadingContainer}><ActivityIndicator size="large" color={colors.primary} /></View>
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="System Configuration" showBack />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* GPS Coordinates */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="location" size={22} color={isDark ? '#fca5a5' : '#dc2626'} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hostel GPS Coordinates</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Latitude</Text>
                                <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={latitude} onChangeText={setLatitude} keyboardType="decimal-pad" placeholder="28.986701" placeholderTextColor={colors.textTertiary} />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Longitude</Text>
                                <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={longitude} onChangeText={setLongitude} keyboardType="decimal-pad" placeholder="77.152050" placeholderTextColor={colors.textTertiary} />
                            </View>
                        </View>
                    </View>

                    {/* Geofence */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="radio" size={22} color={isDark ? '#86efac' : '#16a34a'} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Geofence Settings</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Radius (meters)</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={radius} onChangeText={setRadius} keyboardType="number-pad" placeholder="50" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <Text style={[styles.hint, { color: colors.textTertiary }]}>Students must be within this radius to mark attendance</Text>
                    </View>

                    {/* Attendance Window */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="time" size={22} color={isDark ? '#a5b4fc' : '#4f46e5'} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Attendance Time Window</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Start Hour (24h)</Text>
                                <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={startHour} onChangeText={setStartHour} keyboardType="number-pad" placeholder="19" placeholderTextColor={colors.textTertiary} />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>End Hour (24h)</Text>
                                <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={endHour} onChangeText={setEndHour} keyboardType="number-pad" placeholder="22" placeholderTextColor={colors.textTertiary} />
                            </View>
                        </View>
                        <Text style={[styles.hint, { color: colors.textTertiary }]}>Attendance can only be marked between these hours (IST - Indian Standard Time)</Text>
                    </View>

                    {/* App Settings */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings" size={22} color={isDark ? '#fcd34d' : '#d97706'} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Gate Pass Days</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={maxGatePassDays} onChangeText={setMaxGatePassDays} keyboardType="number-pad" placeholder="14" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Pending Passes</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={maxPendingPasses} onChangeText={setMaxPendingPasses} keyboardType="number-pad" placeholder="3" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Attendance Grace Period (minutes)</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={gracePeriod} onChangeText={setGracePeriod} keyboardType="number-pad" placeholder="5" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <Text style={[styles.hint, { color: colors.textTertiary }]}>These settings control gate pass limits and attendance grace period after window closes</Text>
                    </View>

                    {/* Save Button */}
                    <Pressable style={[styles.saveBtn, updateMutation.isPending && styles.saveBtnDisabled]} onPress={handleSave} disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? <ActivityIndicator color="white" size="small" /> : (
                            <>
                                <Ionicons name="checkmark-circle" size={22} color="white" />
                                <Text style={styles.saveBtnText}>Save Configuration</Text>
                            </>
                        )}
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    section: { borderRadius: 16, padding: 16, marginBottom: 16 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '600' },
    inputRow: { flexDirection: 'row', gap: 12 },
    inputGroup: { flex: 1, marginBottom: 12 },
    inputLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
    hint: { fontSize: 12, marginTop: 4 },
    saveBtn: { backgroundColor: '#7c3aed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, marginTop: 8 },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
