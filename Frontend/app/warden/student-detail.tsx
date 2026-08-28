import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useStudentDetail } from '@/lib/hooks';
import { useTheme } from '@/lib/contexts/theme';
import {
    StudentProfileCard,
    StudentInfoGrid,
    StudentPassesSection,
} from '@/components/warden';

export default function StudentDetailScreen() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data, isLoading } = useStudentDetail(id || '');

    if (isLoading || !data) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Student Details" showBack />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    const { student, passes } = data;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Student Details" showBack />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Card */}
                <StudentProfileCard
                    name={student.name}
                    email={student.email}
                    isCurrentlyOut={passes.isCurrentlyOut}
                />

                {/* Info Grid */}
                <StudentInfoGrid
                    rollNo={student.rollNo}
                    year={student.year}
                    room={student.room}
                    hostel={student.hostel}
                    phone={student.phone}
                />

                {/* Gate Pass Section */}
                <StudentPassesSection
                    activePass={passes.activePass}
                    recentPasses={passes.recent || []}
                    formatDate={formatDate}
                />
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
});
