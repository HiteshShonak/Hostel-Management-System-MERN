import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { DashboardHeader } from '../components/dashboard/header';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import { useRefreshDashboard } from '@/lib/hooks';
import {
    StudentDashboard,
    WardenDashboard,
    AdminDashboard,
    ParentDashboard,
    MessStaffDashboard,
    GuardDashboard,
    HelperDashboard,
} from '@/components/dashboard/roles';

export default function Dashboard() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { colors } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#1d4ed8" />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const renderDashboard = () => {
        switch (user?.role) {
            case 'admin':
                return <AdminDashboard />;
            case 'warden':
                return <WardenDashboard />;
            case 'parent':
                return <ParentDashboard />;
            case 'mess_staff':
                return <MessStaffDashboard />;
            case 'guard':
                return <GuardDashboard />;
            case 'helper':
                return <HelperDashboard />;
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <DashboardHeader />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1d4ed8']} tintColor="#1d4ed8" />
                }
            >
                {renderDashboard()}
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    scrollView: { flex: 1 },
    scrollContent: { paddingTop: 16, paddingBottom: 100 },
});
