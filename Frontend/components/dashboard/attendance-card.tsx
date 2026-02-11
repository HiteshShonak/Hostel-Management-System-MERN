import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme-context';
import { useAttendance } from '@/lib/hooks';
import { nowIST } from '@/lib/utils/date';

export function AttendanceCard() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { data: attendance } = useAttendance();

    // If already marked, maybe show status?
    // For now, simple CTA
    const isMarked = !!attendance;

    return (
        <View style={styles.container}>
            <Pressable
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? '#172554' : '#eff6ff', // Blue theme
                        borderColor: isDark ? '#1e3a8a' : '#dbeafe'
                    }
                ]}
                onPress={() => router.push('/attendance')}
            >
                <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1e40af' : '#bfdbfe' }]}>
                    <Ionicons name="finger-print" size={24} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: isDark ? '#93c5fd' : '#1e3a8a' }]}>
                        {isMarked ? 'Attendance Marked' : 'Mark Attendance'}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#60a5fa' : '#1d4ed8' }]}>
                        {isMarked ? 'Tap to view details' : 'Scan QR or verify location'}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#60a5fa' : '#1d4ed8'} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
    },
});
