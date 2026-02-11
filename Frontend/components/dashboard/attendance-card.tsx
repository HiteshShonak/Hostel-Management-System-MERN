import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/theme-context';
import { useAttendance } from '@/lib/hooks';

export function AttendanceCard() {
    const router = useRouter();
    const { colors, isDark } = useTheme();
    const { data: attendance } = useAttendance();

    // If already marked, maybe show status?
    // For now, simple CTA
    const isMarked = !!attendance;

    // Dynamic styles based on state
    const themeColor = isMarked
        ? (isDark ? '#4ade80' : '#16a34a') // Green for marked
        : (isDark ? '#93c5fd' : '#1d4ed8'); // Blue for unmarked

    const bgColor = isMarked
        ? (isDark ? '#064e3b' : '#f0fdf4')
        : (isDark ? '#172554' : '#eff6ff');

    const borderColor = isMarked
        ? (isDark ? '#065f46' : '#bbf7d0')
        : (isDark ? '#1e3a8a' : '#dbeafe');

    const iconBg = isMarked
        ? (isDark ? '#065f46' : '#dcfce7')
        : (isDark ? '#1e40af' : '#bfdbfe');

    return (
        <View style={styles.container}>
            <Pressable
                style={[
                    styles.card,
                    {
                        backgroundColor: bgColor,
                        borderColor: borderColor
                    }
                ]}
                onPress={() => router.push('/attendance')}
            >
                <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                    <Ionicons
                        name={isMarked ? "checkmark-circle" : "location"}
                        size={28}
                        color={themeColor}
                    />
                </View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: themeColor }]}>
                        {isMarked ? 'Attendance Marked' : 'Mark Your Attendance'}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                        {isMarked ? 'Successfully marked for today' : 'Verify your location to check in'}
                    </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themeColor} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 12, // Increased spacing
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2, // Thicker premium border
        gap: 16,
        // No shadow for flat premium look
    },
    iconContainer: {
        width: 52, // Slightly larger
        height: 52,
        borderRadius: 26,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 17, // Larger title
        fontWeight: '700', // Bolder
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    subtitle: {
        fontSize: 13,
        fontWeight: '500',
    },
});
