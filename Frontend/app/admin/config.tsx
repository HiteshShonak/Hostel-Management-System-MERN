import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useSystemConfig, useUpdateSystemConfig } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';

export default function AdminConfigScreen() {
    const { colors, isDark } = useTheme();
    const { data: config, isLoading, refetch } = useSystemConfig();
    const updateMutation = useUpdateSystemConfig();

    const [maxGatePassDays, setMaxGatePassDays] = React.useState('');
    const [maxPendingPasses, setMaxPendingPasses] = React.useState('');

    React.useEffect(() => {
        if (config) {
            setMaxGatePassDays(config.appConfig?.maxGatePassDays?.toString() || '14');
            setMaxPendingPasses(config.appConfig?.maxPendingPasses?.toString() || '3');
        }
    }, [config]);

    const handleSave = () => {
        updateMutation.mutate(
            {
                appConfig: { maxGatePassDays: parseInt(maxGatePassDays) || 14, maxPendingPasses: parseInt(maxPendingPasses) || 3 },
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
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* App Settings */}
                    <View style={[styles.section, { backgroundColor: colors.card }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="settings" size={22} color={isDark ? '#fcd34d' : '#d97706'} />
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Gate Pass Settings</Text>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Gate Pass Duration (Days)</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={maxGatePassDays} onChangeText={setMaxGatePassDays} keyboardType="number-pad" placeholder="14" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Max Concurrent Pending Passes</Text>
                            <TextInput style={[styles.input, { backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.cardBorder }]} value={maxPendingPasses} onChangeText={setMaxPendingPasses} keyboardType="number-pad" placeholder="3" placeholderTextColor={colors.textTertiary} />
                        </View>
                        <Text style={[styles.hint, { color: colors.textTertiary }]}>These settings control gate pass request limits across the hostel</Text>
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
    inputGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    input: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
    hint: { fontSize: 12, marginTop: 4 },
    saveBtn: { backgroundColor: '#7c3aed', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 14, marginTop: 8 },
    saveBtnDisabled: { opacity: 0.6 },
    saveBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
