import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

/**
 * Top purple shield banner for Admin dashboard.
 */
export function AdminDashboardBanner() {
    const { colors, isDark } = useTheme();

    return (
        <View
            style={[
                styles.adminHeader,
                {
                    backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                    borderColor: isDark ? '#6b21a8' : '#e9d5ff',
                },
            ]}
        >
            <View style={[styles.adminHeaderIcon, { backgroundColor: colors.card }]}>
                <Ionicons name="shield-checkmark" size={32} color="#7c3aed" />
            </View>
            <View style={styles.adminHeaderText}>
                <Text style={[styles.adminHeaderTitle, { color: isDark ? '#e9d5ff' : '#5b21b6' }]}>
                    Admin Dashboard
                </Text>
                <Text style={[styles.adminHeaderSubtitle, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>
                    Full system access
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    adminHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    adminHeaderIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    adminHeaderText: {
        flex: 1,
    },
    adminHeaderTitle: {
        fontSize: 22,
        fontWeight: '700',
    },
    adminHeaderSubtitle: {
        fontSize: 14,
        marginTop: 4,
    },
});
