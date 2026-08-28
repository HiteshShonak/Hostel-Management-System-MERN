import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import { useAuth } from '@/lib/contexts/auth';
import { AlertManagementView, StudentSOSView } from '@/components/emergency';

export default function EmergencyPage() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const isManagementRole = user?.role === 'warden' || user?.role === 'admin';

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title={isManagementRole ? 'SOS Alerts' : 'Emergency'} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {isManagementRole ? <AlertManagementView /> : <StudentSOSView />}
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
});
