import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface ChangePasswordCardProps {
    currentPassword: string;
    onChangeCurrentPassword: (val: string) => void;
    newPassword: string;
    onChangeNewPassword: (val: string) => void;
    confirmPassword: string;
    onChangeConfirmPassword: (val: string) => void;
    showCurrentPassword: boolean;
    onToggleShowCurrentPassword: () => void;
    showNewPassword: boolean;
    onToggleShowNewPassword: () => void;
    isPending: boolean;
    onSubmit: () => void;
}

/**
 * Card containing change password input fields with toggle visibility.
 */
export function ChangePasswordCard({
    currentPassword,
    onChangeCurrentPassword,
    newPassword,
    onChangeNewPassword,
    confirmPassword,
    onChangeConfirmPassword,
    showCurrentPassword,
    onToggleShowCurrentPassword,
    showNewPassword,
    onToggleShowNewPassword,
    isPending,
    onSubmit,
}: ChangePasswordCardProps) {
    const { colors, isDark } = useTheme();

    return (
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
                    <View
                        style={[
                            styles.passwordContainer,
                            {
                                borderColor: colors.cardBorder,
                                backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa',
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.passwordInput, { color: colors.text }]}
                            value={currentPassword}
                            onChangeText={onChangeCurrentPassword}
                            placeholder="Enter current password"
                            placeholderTextColor={colors.textTertiary}
                            secureTextEntry={!showCurrentPassword}
                        />
                        <Pressable onPress={onToggleShowCurrentPassword} style={styles.eyeIcon}>
                            <Ionicons
                                name={showCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
                    <View
                        style={[
                            styles.passwordContainer,
                            {
                                borderColor: colors.cardBorder,
                                backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa',
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.passwordInput, { color: colors.text }]}
                            value={newPassword}
                            onChangeText={onChangeNewPassword}
                            placeholder="Enter new password (min 6 chars)"
                            placeholderTextColor={colors.textTertiary}
                            secureTextEntry={!showNewPassword}
                        />
                        <Pressable onPress={onToggleShowNewPassword} style={styles.eyeIcon}>
                            <Ionicons
                                name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                borderColor: colors.cardBorder,
                                backgroundColor: isDark ? colors.backgroundSecondary : '#fafafa',
                                color: colors.text,
                            },
                        ]}
                        value={confirmPassword}
                        onChangeText={onChangeConfirmPassword}
                        placeholder="Confirm new password"
                        placeholderTextColor={colors.textTertiary}
                        secureTextEntry={!showNewPassword}
                    />
                </View>

                <Pressable
                    style={[
                        styles.saveBtn,
                        { backgroundColor: colors.primary },
                        isPending && styles.btnDisabled,
                    ]}
                    onPress={onSubmit}
                    disabled={isPending}
                >
                    {isPending ? (
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
    );
}

const styles = StyleSheet.create({
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionIconBox: { padding: 8, borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 16 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    passwordInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    eyeIcon: { paddingRight: 16 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
