import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import type { SuccessCardData } from './useRegisterUserController';

interface RegistrationSuccessCardProps {
    data: SuccessCardData;
    onRegisterAnother: () => void;
}

export function RegistrationSuccessCard({ data, onRegisterAnother }: RegistrationSuccessCardProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.successIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
            </View>
            <Text style={[styles.successTitle, { color: colors.text }]}>Account Created!</Text>
            <Text style={[styles.successSub, { color: colors.textSecondary }]}>
                The {data.role} account has been successfully created.
            </Text>

            <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.successRow}>
                    <Ionicons name="person" size={16} color={colors.primary} />
                    <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Name</Text>
                    <Text style={[styles.successValue, { color: colors.text }]}>{data.name}</Text>
                </View>
                <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                <View style={styles.successRow}>
                    <Ionicons name="mail" size={16} color={colors.primary} />
                    <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Email</Text>
                    <Text style={[styles.successValue, { color: colors.text }]}>{data.email}</Text>
                </View>
                <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                <View style={styles.successRow}>
                    <Ionicons name="id-card" size={16} color={colors.primary} />
                    <Text style={[styles.successLabel, { color: colors.textSecondary }]}>ID</Text>
                    <Text style={[styles.successValue, { color: colors.text }]}>{data.rollNo}</Text>
                </View>
                <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                <View style={styles.successRow}>
                    <Ionicons name="home" size={16} color={colors.primary} />
                    <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Room</Text>
                    <Text style={[styles.successValue, { color: colors.text }]}>
                        {data.room} — {data.hostel}
                    </Text>
                </View>
            </View>

            <Pressable style={[styles.primaryBtn, { backgroundColor: colors.primary }]} onPress={onRegisterAnother}>
                <Ionicons name="person-add" size={18} color="white" />
                <Text style={styles.primaryBtnText}>Register Another User</Text>
            </Pressable>

            <Pressable
                style={[styles.secondaryBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => router.back()}
            >
                <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Dashboard</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', gap: 16 },
    successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    successTitle: { fontSize: 26, fontWeight: '800', marginTop: 4 },
    successSub: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    successCard: { width: '100%', borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginTop: 8 },
    successRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    successLabel: { fontSize: 13, width: 48 },
    successValue: { flex: 1, fontSize: 14, fontWeight: '600' },
    successDivider: { height: 1, marginVertical: 2 },
    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', paddingVertical: 16, borderRadius: 14, marginTop: 8 },
    primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
    secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
});
