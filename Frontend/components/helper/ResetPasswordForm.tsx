import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { HelperUserSearchResult } from '@/lib/services';
import { SelectedUserCard } from './SelectedUserCard';

interface ResetPasswordFormProps {
    selectedUser: HelperUserSearchResult;
    onClearUser: () => void;
    successMessage: string;
    newPassword: string;
    onChangeNewPassword: (text: string) => void;
    confirmPassword: string;
    onChangeConfirmPassword: (text: string) => void;
    showPassword: boolean;
    onToggleShowPassword: () => void;
    showConfirm: boolean;
    onToggleShowConfirm: () => void;
    passwordsMatch: boolean;
    passwordStrong: boolean;
    onReset: () => void;
    isPending: boolean;
}

export function ResetPasswordForm({
    selectedUser,
    onClearUser,
    successMessage,
    newPassword,
    onChangeNewPassword,
    confirmPassword,
    onChangeConfirmPassword,
    showPassword,
    onToggleShowPassword,
    showConfirm,
    onToggleShowConfirm,
    passwordsMatch,
    passwordStrong,
    onReset,
    isPending,
}: ResetPasswordFormProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.section}>
            <SelectedUserCard user={selectedUser} onClear={onClearUser} />

            {/* Success Banner */}
            {successMessage !== '' && (
                <View style={[styles.successBanner, { backgroundColor: isDark ? '#052e16' : '#dcfce7', borderColor: '#16a34a' }]}>
                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                    <Text style={[styles.successText, { color: isDark ? '#86efac' : '#15803d' }]}>{successMessage}</Text>
                </View>
            )}

            {/* New Password Input */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>New Password</Text>

            <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                <View style={[styles.passwordRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TextInput
                        style={[styles.passwordInput, { color: colors.text }]}
                        placeholder="Min 8 chars, upper, lower, number"
                        placeholderTextColor={colors.textTertiary}
                        value={newPassword}
                        onChangeText={onChangeNewPassword}
                        secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={onToggleShowPassword} style={styles.eyeBtn}>
                        <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                    </Pressable>
                </View>
                {newPassword.length > 0 && (
                    <View style={styles.strengthRow}>
                        <View style={[styles.strengthBar, { backgroundColor: passwordStrong ? '#16a34a' : '#f59e0b' }]} />
                        <Text style={[styles.strengthText, { color: passwordStrong ? '#16a34a' : '#f59e0b' }]}>
                            {passwordStrong ? 'Strong' : 'Needs upper, lower, and number'}
                        </Text>
                    </View>
                )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm Password</Text>
                <View
                    style={[
                        styles.passwordRow,
                        {
                            backgroundColor: colors.card,
                            borderColor: confirmPassword.length > 0 ? (passwordsMatch ? '#16a34a' : '#ef4444') : colors.border,
                        },
                    ]}
                >
                    <TextInput
                        style={[styles.passwordInput, { color: colors.text }]}
                        placeholder="Re-enter new password"
                        placeholderTextColor={colors.textTertiary}
                        value={confirmPassword}
                        onChangeText={onChangeConfirmPassword}
                        secureTextEntry={!showConfirm}
                    />
                    <Pressable onPress={onToggleShowConfirm} style={styles.eyeBtn}>
                        <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                    </Pressable>
                </View>
                {confirmPassword.length > 0 && !passwordsMatch && (
                    <Text style={styles.mismatchText}>Passwords do not match</Text>
                )}
            </View>

            {/* Force Reset Submit Button */}
            <Pressable
                style={[
                    styles.resetBtn,
                    { backgroundColor: '#ef4444' },
                    (!passwordStrong || !passwordsMatch || isPending) && { opacity: 0.5 },
                ]}
                onPress={onReset}
                disabled={!passwordStrong || !passwordsMatch || isPending}
            >
                {isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <>
                        <Ionicons name="key" size={18} color="white" />
                        <Text style={styles.resetBtnText}>Force Reset Password</Text>
                    </>
                )}
            </Pressable>

            {/* Security Warning Box */}
            <View style={[styles.warningBox, { backgroundColor: isDark ? '#431407' : '#fff7ed', borderColor: isDark ? '#92400e' : '#fed7aa' }]}>
                <Ionicons name="warning-outline" size={16} color="#f59e0b" />
                <Text style={[styles.warningText, { color: isDark ? '#fbbf24' : '#92400e' }]}>
                    This will immediately change the user's password. They will need to use the new password at their next login.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 14 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    successBanner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
    successText: { flex: 1, fontSize: 14, fontWeight: '600' },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '500' },
    passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12 },
    passwordInput: { flex: 1, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    eyeBtn: { paddingRight: 14 },
    strengthRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    strengthBar: { width: 8, height: 8, borderRadius: 4 },
    strengthText: { fontSize: 12, fontWeight: '500' },
    mismatchText: { fontSize: 12, color: '#ef4444', marginTop: 2 },
    resetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14 },
    resetBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
    warningBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
    warningText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
