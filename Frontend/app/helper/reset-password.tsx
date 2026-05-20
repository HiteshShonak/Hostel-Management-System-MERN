import React, { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHelperResetPassword, useHelperSearchUsers } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { PageHeader } from '@/components/ui/PageHeader';
import { HelperUserSearchResult } from '@/lib/services';

const ROLE_COLORS: Record<string, string> = {
    student: '#6366f1',
    parent: '#f59e0b',
    warden: '#10b981',
    guard: '#3b82f6',
    mess_staff: '#ef4444',
    helper: '#8b5cf6',
    admin: '#64748b',
};

export default function HelperResetPasswordScreen() {
    const { colors, isDark } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<HelperUserSearchResult | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const searchResult = useHelperSearchUsers(searchActive && searchQuery.trim().length >= 2 ? { search: searchQuery } : undefined);
    const resetMutation = useHelperResetPassword();

    const handleSearch = () => {
        if (searchQuery.trim().length < 2) {
            Alert.alert('Too Short', 'Please enter at least 2 characters to search.');
            return;
        }
        setSearchActive(true);
        setSelectedUser(null);
        setSuccessMessage('');
    };

    const handleSelect = (user: HelperUserSearchResult) => {
        setSelectedUser(user);
        setSearchActive(false);
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('');
    };

    const handleReset = () => {
        if (!selectedUser) return;
        if (!newPassword.trim() || newPassword.length < 8) {
            Alert.alert('Invalid Password', 'Password must be at least 8 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Mismatch', 'Passwords do not match.');
            return;
        }

        Alert.alert(
            'Confirm Reset',
            `Reset password for ${selectedUser.name} (${selectedUser.email})?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset Password',
                    style: 'destructive',
                    onPress: () => {
                        resetMutation.mutate(
                            { userId: selectedUser._id, newPassword },
                            {
                                onSuccess: () => {
                                    setSuccessMessage(`Password reset successfully for ${selectedUser.name}.`);
                                    setNewPassword('');
                                    setConfirmPassword('');
                                },
                                onError: (error: any) => {
                                    const msg = error?.response?.data?.message || error?.message || 'Reset failed.';
                                    Alert.alert('Error', msg);
                                },
                            }
                        );
                    },
                },
            ]
        );
    };

    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
    const passwordStrong = newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Reset Password" showBack />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                    {/* Search Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Find User</Text>
                        <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                            Search by name, email, or roll number
                        </Text>

                        <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Ionicons name="search-outline" size={20} color={colors.textTertiary} style={{ marginLeft: 14 }} />
                            <TextInput
                                style={[styles.searchInput, { color: colors.text }]}
                                placeholder="Search users..."
                                placeholderTextColor={colors.textTertiary}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                                returnKeyType="search"
                            />
                            <Pressable
                                style={[styles.searchBtn, { backgroundColor: colors.primary }]}
                                onPress={handleSearch}
                            >
                                <Text style={styles.searchBtnText}>Search</Text>
                            </Pressable>
                        </View>

                        {/* Search Results */}
                        {searchActive && searchResult.isLoading && (
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 16 }} />
                        )}

                        {searchActive && !searchResult.isLoading && searchResult.data && (
                            <View style={{ gap: 8, marginTop: 4 }}>
                                {searchResult.data.users.length === 0 ? (
                                    <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        <Ionicons name="person-outline" size={32} color={colors.textTertiary} />
                                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No users found</Text>
                                    </View>
                                ) : (
                                    searchResult.data.users.map((user) => (
                                        <Pressable
                                            key={user._id}
                                            style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                                            onPress={() => handleSelect(user)}
                                        >
                                            <View style={[styles.userAvatar, { backgroundColor: `${ROLE_COLORS[user.role] || '#6366f1'}22` }]}>
                                                <Text style={[styles.userAvatarText, { color: ROLE_COLORS[user.role] || '#6366f1' }]}>
                                                    {user.name[0].toUpperCase()}
                                                </Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                                <Text style={[styles.userMeta, { color: colors.textSecondary }]}>
                                                    {user.email} • {user.rollNo}
                                                </Text>
                                            </View>
                                            <View style={[styles.roleBadge, { backgroundColor: `${ROLE_COLORS[user.role] || '#6366f1'}22` }]}>
                                                <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[user.role] || '#6366f1' }]}>
                                                    {user.role}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    ))
                                )}
                            </View>
                        )}
                    </View>

                    {/* Selected User + Password Form */}
                    {selectedUser && (
                        <View style={styles.section}>
                            {/* Selected User Card */}
                            <View style={[styles.selectedCard, {
                                backgroundColor: isDark ? `${ROLE_COLORS[selectedUser.role]}18` : `${ROLE_COLORS[selectedUser.role]}0d`,
                                borderColor: `${ROLE_COLORS[selectedUser.role]}44`,
                            }]}>
                                <View style={styles.selectedCardHeader}>
                                    <View style={[styles.userAvatar, { backgroundColor: `${ROLE_COLORS[selectedUser.role]}33` }]}>
                                        <Text style={[styles.userAvatarText, { color: ROLE_COLORS[selectedUser.role] }]}>
                                            {selectedUser.name[0].toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.selectedName, { color: colors.text }]}>{selectedUser.name}</Text>
                                        <Text style={[styles.selectedMeta, { color: colors.textSecondary }]}>{selectedUser.email}</Text>
                                    </View>
                                    <Pressable onPress={() => setSelectedUser(null)} style={styles.clearBtn}>
                                        <Ionicons name="close-circle" size={22} color={colors.textTertiary} />
                                    </Pressable>
                                </View>
                                <View style={styles.selectedDetails}>
                                    <Text style={[styles.selectedDetail, { color: colors.textSecondary }]}>
                                        <Text style={{ fontWeight: '600', color: colors.text }}>ID: </Text>{selectedUser.rollNo}
                                    </Text>
                                    <Text style={[styles.selectedDetail, { color: colors.textSecondary }]}>
                                        <Text style={{ fontWeight: '600', color: colors.text }}>Room: </Text>{selectedUser.room}
                                    </Text>
                                </View>
                            </View>

                            {/* Success Banner */}
                            {successMessage !== '' && (
                                <View style={[styles.successBanner, { backgroundColor: isDark ? '#052e16' : '#dcfce7', borderColor: '#16a34a' }]}>
                                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                                    <Text style={[styles.successText, { color: isDark ? '#86efac' : '#15803d' }]}>{successMessage}</Text>
                                </View>
                            )}

                            {/* New Password */}
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>New Password</Text>

                            <View style={styles.field}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>New Password</Text>
                                <View style={[styles.passwordRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <TextInput
                                        style={[styles.passwordInput, { color: colors.text }]}
                                        placeholder="Min 8 chars, upper, lower, number"
                                        placeholderTextColor={colors.textTertiary}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
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

                            <View style={styles.field}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm Password</Text>
                                <View style={[styles.passwordRow, {
                                    backgroundColor: colors.card,
                                    borderColor: confirmPassword.length > 0 ? (passwordsMatch ? '#16a34a' : '#ef4444') : colors.border
                                }]}>
                                    <TextInput
                                        style={[styles.passwordInput, { color: colors.text }]}
                                        placeholder="Re-enter new password"
                                        placeholderTextColor={colors.textTertiary}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirm}
                                    />
                                    <Pressable onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
                                        <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                                    </Pressable>
                                </View>
                                {confirmPassword.length > 0 && !passwordsMatch && (
                                    <Text style={styles.mismatchText}>Passwords do not match</Text>
                                )}
                            </View>

                            <Pressable
                                style={[
                                    styles.resetBtn,
                                    { backgroundColor: '#ef4444' },
                                    (!passwordStrong || !passwordsMatch || resetMutation.isPending) && { opacity: 0.5 }
                                ]}
                                onPress={handleReset}
                                disabled={!passwordStrong || !passwordsMatch || resetMutation.isPending}
                            >
                                {resetMutation.isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <>
                                        <Ionicons name="key" size={18} color="white" />
                                        <Text style={styles.resetBtnText}>Force Reset Password</Text>
                                    </>
                                )}
                            </Pressable>

                            <View style={[styles.warningBox, { backgroundColor: isDark ? '#431407' : '#fff7ed', borderColor: isDark ? '#92400e' : '#fed7aa' }]}>
                                <Ionicons name="warning-outline" size={16} color="#f59e0b" />
                                <Text style={[styles.warningText, { color: isDark ? '#fbbf24' : '#92400e' }]}>
                                    This will immediately change the user's password. They will need to use the new password at their next login.
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={{ height: 32 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: 20, gap: 24 },
    section: { gap: 14 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    sectionSub: { fontSize: 13, marginTop: -8 },
    searchRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
    searchInput: { flex: 1, paddingVertical: 13, paddingHorizontal: 12, fontSize: 15 },
    searchBtn: { paddingHorizontal: 16, paddingVertical: 13, margin: 4, borderRadius: 10 },
    searchBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
    emptyBox: { alignItems: 'center', paddingVertical: 32, borderRadius: 14, borderWidth: 1, gap: 8 },
    emptyText: { fontSize: 14 },
    userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
    userAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    userAvatarText: { fontSize: 18, fontWeight: '700' },
    userName: { fontSize: 15, fontWeight: '600' },
    userMeta: { fontSize: 12, marginTop: 2 },
    roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    roleBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
    selectedCard: { padding: 16, borderRadius: 16, borderWidth: 1.5, gap: 12 },
    selectedCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    selectedName: { fontSize: 16, fontWeight: '700' },
    selectedMeta: { fontSize: 13, marginTop: 2 },
    clearBtn: { padding: 4 },
    selectedDetails: { flexDirection: 'row', gap: 16 },
    selectedDetail: { fontSize: 13 },
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
