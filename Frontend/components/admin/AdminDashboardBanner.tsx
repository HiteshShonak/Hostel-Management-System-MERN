import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DashboardHeaderBanner } from '@/components/ui/DashboardHeaderBanner';

/**
 * Top purple shield banner for Admin dashboard.
 * Encapsulates the admin identity with full system access branding.
 */
export function AdminDashboardBanner() {
    return (
        <View style={styles.container}>
            <DashboardHeaderBanner
                icon="shield-checkmark"
                title="Admin Dashboard"
                subtitle="Full system access"
                iconColor="#7c3aed"
                bgLight="#f3e8ff"
                bgDark="#3b0764"
                borderLight="#e9d5ff"
                borderDark="#6b21a8"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
