import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { EmptyStateView } from '@/components/ui/EmptyStateView';

export function NoAccessView() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <EmptyStateView
                    icon="lock-closed"
                    iconColor="#dc2626"
                    title="Access Denied"
                    subtitle="Only staff members can verify gate passes"
                    actionLabel="Go Back"
                    onAction={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
});
