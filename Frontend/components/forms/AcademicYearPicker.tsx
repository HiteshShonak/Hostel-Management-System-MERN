import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';

interface AcademicYearPickerProps {
    selectedYear: number;
    onSelectYear: (year: number) => void;
}

// Reusable academic year selector (1st to 4th year)
export function AcademicYearPicker({
    selectedYear,
    onSelectYear,
}: AcademicYearPickerProps) {
    const { colors, isDark } = useTheme();
    const years = [1, 2, 3, 4] as const;

    return (
        <View style={styles.container}>
            <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Academic Year</Text>
                <Text
                    style={[
                        styles.requiredBadge,
                        {
                            backgroundColor: isDark ? '#172554' : '#eff6ff',
                            color: colors.primary,
                        },
                    ]}
                >
                    Required
                </Text>
            </View>
            <View style={styles.yearGrid}>
                {years.map((y) => {
                    const isSelected = selectedYear === y;
                    return (
                        <Pressable
                            key={y}
                            style={[
                                styles.yearButton,
                                { backgroundColor: colors.card, borderColor: colors.border },
                                isSelected && {
                                    borderColor: colors.primary,
                                    backgroundColor: isDark ? 'rgba(29, 78, 216, 0.2)' : '#eff6ff',
                                },
                            ]}
                            onPress={() => onSelectYear(y)}
                        >
                            <Text
                                style={[
                                    styles.yearText,
                                    { color: colors.textSecondary },
                                    isSelected && { color: colors.primary, fontWeight: '700' },
                                ]}
                            >
                                {y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'}
                            </Text>
                            <Text
                                style={[
                                    styles.yearSubText,
                                    { color: colors.textTertiary },
                                    isSelected && { color: colors.primary },
                                ]}
                            >
                                Year
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 6,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
    },
    requiredBadge: {
        fontSize: 11,
        fontWeight: '600',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    yearGrid: {
        flexDirection: 'row',
        gap: 8,
    },
    yearButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    yearText: {
        fontSize: 16,
        fontWeight: '600',
    },
    yearSubText: {
        fontSize: 11,
        marginTop: 2,
    },
});
