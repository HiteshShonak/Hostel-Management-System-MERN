import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useChangePassword } from '@/lib/hooks';

export default function SettingsPage() {
    const { user } = useAuth();
    const { colors, isDark } = useTheme();
    const changePasswordMutation = useChangePassword();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all password fields');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        changePasswordMutation.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    Alert.alert('Success', 'Password changed successfully');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                },
                onError: (error: any) => {
                    const message = error?.response?.data?.message || error?.response?.data?.error || 'Failed to change password';
                    Alert.alert('Error', message);
                },
            }
        );
    };

    if (!user) {
        router.replace('/login');
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Settings" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Change Password Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIconBox, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                                <Ionicons name="lock-closed" size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Change Password</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
                                <View style={[styles.passwordContainer, {
                                    borderColor: colors.cardBorder,
                                    backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa'
                                }]}>
                                    <TextInput
                                        style={[styles.passwordInput, { color: colors.text }]}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        placeholder="Enter current password"
                                        placeholderTextColor={colors.textTertiary}
                                        secureTextEntry={!showCurrentPassword}
                                    />
                                    <Pressable onPress={() => setShowCurrentPassword(!showCurrentPassword)} style={styles.eyeIcon}>
                                        <Ionicons name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                                <View style={[styles.passwordContainer, {
                                    borderColor: colors.cardBorder,
                                    backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa'
                                }]}>
                                    <TextInput
                                        style={[styles.passwordInput, { color: colors.text }]}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Enter new password (min 6 chars)"
                                        placeholderTextColor={colors.textTertiary}
                                        secureTextEntry={!showNewPassword}
                                    />
                                    <Pressable onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                                        <Ionicons name={showNewPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
                                <TextInput
                                    style={[styles.input, {
                                        borderColor: colors.cardBorder,
                                        backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa',
                                        color: colors.text
                                    }]}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    placeholder="Confirm new password"
                                    placeholderTextColor={colors.textTertiary}
                                    secureTextEntry={!showNewPassword}
                                />
                            </View>

                            <Pressable
                                style={[styles.saveBtn, { backgroundColor: colors.primary }, changePasswordMutation.isPending && styles.btnDisabled]}
                                onPress={handleChangePassword}
                                disabled={changePasswordMutation.isPending}
                            >
                                {changePasswordMutation.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark-circle" size={20} color="white" />
                                        <Text style={styles.saveBtnText}>Update Password</Text>
                                    </>
                                )}
                            </Pressable>
                        </View>
                    </View>

                    {/* App Info Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={[styles.sectionIconBox, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                                <Ionicons name="information-circle" size={20} color={colors.primary} />
                            </View>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>App Information</Text>
                        </View>

                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
                            </View>
                            <View style={[styles.infoRow, styles.lastRow, { borderBottomColor: colors.cardBorder }]}>
                                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Developer</Text>
                                <Text style={[styles.infoValue, { color: colors.text }]}>HMS Team</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 24 },
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionIconBox: { padding: 8, backgroundColor: '#eff6ff', borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600', color: '#0a0a0a' },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '500', color: '#0a0a0a' },
    input: { borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16, color: '#0a0a0a', backgroundColor: '#fafafa' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e5e5e5', borderRadius: 12, backgroundColor: '#fafafa' },
    passwordInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16, color: '#0a0a0a' },
    eyeIcon: { paddingRight: 16 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#1d4ed8', padding: 16, borderRadius: 12, marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    lastRow: { borderBottomWidth: 0 },
    infoLabel: { fontSize: 14, color: '#737373' },
    infoValue: { fontSize: 14, fontWeight: '500', color: '#0a0a0a' },
});
