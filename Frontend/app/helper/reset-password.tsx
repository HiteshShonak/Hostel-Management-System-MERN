import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTheme } from '@/lib/contexts/theme';
import {
    useResetPasswordController,
    UserSearchSection,
    ResetPasswordForm,
} from '@/components/helper';

export default function HelperResetPasswordScreen() {
    const { colors } = useTheme();
    const {
        searchQuery,
        setSearchQuery,
        selectedUser,
        setSelectedUser,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirm,
        setShowConfirm,
        searchActive,
        successMessage,
        searchResult,
        resetMutation,
        handleSearch,
        handleSelect,
        handleReset,
        passwordsMatch,
        passwordStrong,
    } = useResetPasswordController();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Reset Password" showBack />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* User Search Section */}
                    <UserSearchSection
                        searchQuery={searchQuery}
                        onChangeSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                        searchActive={searchActive}
                        isLoading={searchResult.isLoading}
                        users={searchResult.data?.users}
                        onSelectUser={handleSelect}
                    />

                    {/* Selected User & Password Reset Form */}
                    {selectedUser && (
                        <ResetPasswordForm
                            selectedUser={selectedUser}
                            onClearUser={() => setSelectedUser(null)}
                            successMessage={successMessage}
                            newPassword={newPassword}
                            onChangeNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            onChangeConfirmPassword={setConfirmPassword}
                            showPassword={showPassword}
                            onToggleShowPassword={() => setShowPassword(!showPassword)}
                            showConfirm={showConfirm}
                            onToggleShowConfirm={() => setShowConfirm(!showConfirm)}
                            passwordsMatch={passwordsMatch}
                            passwordStrong={passwordStrong}
                            onReset={handleReset}
                            isPending={resetMutation.isPending}
                        />
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
});
