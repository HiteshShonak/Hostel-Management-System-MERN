import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface StudentInfoGridProps {
    rollNo: string;
    year?: number;
    room: string;
    hostel: string;
    phone: string;
}

export function StudentInfoGrid({ rollNo, year, room, hostel, phone }: StudentInfoGridProps) {
    const { colors } = useTheme();

    const formatYearText = (y?: number) => {
        if (!y) return 'N/A';
        const suffix = y === 1 ? 'st' : y === 2 ? 'nd' : y === 3 ? 'rd' : 'th';
        return `${y}${suffix} Year`;
    };

    return (
        <View style={styles.infoGrid}>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="id-card" size={20} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Roll No</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{rollNo}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="school" size={20} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Year</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                    {formatYearText(year)}
                </Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="bed" size={20} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Room</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{room}</Text>
            </View>
            <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
                <Ionicons name="business" size={20} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Hostel</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{hostel}</Text>
            </View>
            <View style={[styles.infoCard, styles.fullWidthCard, { backgroundColor: colors.card }]}>
                <Ionicons name="call" size={20} color={colors.primary} />
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{phone}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    infoCard: {
        width: '48%',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },
    fullWidthCard: {
        width: '100%',
    },
    infoLabel: { fontSize: 13, marginTop: 6 },
    infoValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
});
