import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import {
    useProfileController,
    ProfileHeaderCard,
    ProfileAppearanceCard,
    ProfileDetailsSection,
    ProfileMenuSection,
    ProfileNotLoggedIn,
} from '@/components/profile';

export default function ProfilePage() {
    const {
        user,
        isLoading,
        mode,
        setMode,
        colors,
        profileItems,
        handleMenuPress,
    } = useProfileController();

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Profile" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Profile" />
                <ProfileNotLoggedIn />
                <BottomNav />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Profile" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <ProfileHeaderCard user={user} />
                    <ProfileAppearanceCard mode={mode} onSelectMode={setMode} />
                    <ProfileDetailsSection items={profileItems} />
                    <ProfileMenuSection onPressItem={handleMenuPress} />
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    content: { padding: 16, gap: 24 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
