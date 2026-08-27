import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { GatePass, User } from '@/lib/types';

interface StudentPassCardProps {
    pass: GatePass;
    opacity: Animated.Value;
    translateY: Animated.Value;
    isPassExpired: boolean;
    hasExited: boolean;
}

// Student Details Card (1:1 identical to original)
export function StudentPassCard({
    pass,
    opacity,
    translateY,
    isPassExpired,
    hasExited,
}: StudentPassCardProps) {
    const { colors, isDark } = useTheme();

    const studentInfo = (typeof pass.user === 'object' && pass.user) ? (pass.user as User) : null;
    if (!studentInfo) return null;

    return (
        <Animated.View style={[styles.studentCard, { backgroundColor: colors.card, opacity, transform: [{ translateY }] }]}>
            <View style={styles.studentHeader}>
                <Ionicons name="person-circle" size={24} color={colors.primary} />
                <Text style={[styles.studentName, { color: colors.text }]}>{studentInfo.name}</Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Ionicons name="school" size={18} color={colors.textSecondary} />
                    <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll Number</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.rollNo}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="home" size={18} color={colors.textSecondary} />
                    <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Room</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.room}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <Ionicons name="business" size={18} color={colors.textSecondary} />
                    <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hostel</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.hostel || 'N/A'}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="call" size={18} color={colors.textSecondary} />
                    <View style={styles.infoTextContainer}>
                        <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                        <Text style={[styles.infoValue, { color: colors.text }]}>{studentInfo.phone || 'N/A'}</Text>
                    </View>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.reasonContainer}>
                <Ionicons name="document-text" size={18} color={colors.textSecondary} />
                <View style={styles.infoTextContainer}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reason</Text>
                    <Text style={[styles.reasonText, { color: colors.textSecondary }]}>{pass.reason}</Text>
                </View>
            </View>

            <View style={[styles.validityContainer, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
                <Ionicons name="calendar" size={16} color={isDark ? '#4ade80' : colors.success} />
                <Text style={[styles.validityText, { color: isDark ? '#4ade80' : colors.success }]}>
                    Valid: {new Date(pass.fromDate).toLocaleDateString()} - {new Date(pass.toDate).toLocaleDateString()}
                </Text>
            </View>

            {isPassExpired && hasExited && (
                <View style={[styles.validityContainer, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', marginTop: 8 }]}>
                    <Ionicons name="warning" size={16} color={isDark ? '#fca5a5' : '#dc2626'} />
                    <Text style={[styles.validityText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                        Student is still outside — pass expired
                    </Text>
                </View>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    studentCard: {
        width: '100%',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    studentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    studentName: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
    },
    divider: {
        height: 1,
        marginVertical: 16,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    infoItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    reasonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
    },
    reasonText: {
        fontSize: 15,
        lineHeight: 22,
    },
    validityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    validityText: {
        fontSize: 13,
        fontWeight: '500',
    },
});
