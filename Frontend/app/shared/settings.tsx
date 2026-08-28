import React from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import {
    useSettingsController,
    ChangePasswordCard,
    AppInformationCard,
} from '@/components/settings';

export default function SettingsPage() {
    const { user } = useAuth();
    const { colors } = useTheme();
    const {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showCurrentPassword,
        setShowCurrentPassword,
        showNewPassword,
        setShowNewPassword,
        changePasswordMutation,
        handleChangePassword,
    } = useSettingsController();

    if (!user) {
        router.replace('/login');
        return null;
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Settings" showBack />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.content}>
                        <ChangePasswordCard
                            currentPassword={currentPassword}
                            onChangeCurrentPassword={setCurrentPassword}
                            newPassword={newPassword}
                            onChangeNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            onChangeConfirmPassword={setConfirmPassword}
                            showCurrentPassword={showCurrentPassword}
                            onToggleShowCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
                            showNewPassword={showNewPassword}
                            onToggleShowNewPassword={() => setShowNewPassword(!showNewPassword)}
                            isPending={changePasswordMutation.isPending}
                            onSubmit={handleChangePassword}
                        />

                        <AppInformationCard />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    keyboardAvoid: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 24 },
});
