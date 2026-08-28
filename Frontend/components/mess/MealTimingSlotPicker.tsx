import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { TimeScrollPicker } from '@/components/ui/TimeScrollPicker';

interface MealTimingSlotPickerProps {
    label: string;
    icon: 'log-in-outline' | 'log-out-outline';
    value: string;
    onChange: (time: string) => void;
}

/**
 * Individual start/end timing slot card with TimeScrollPicker.
 */
export function MealTimingSlotPicker({
    label,
    icon,
    value,
    onChange,
}: MealTimingSlotPickerProps) {
    const { colors, isDark } = useTheme();

    return (
        <View
            style={[
                styles.timeSectionCard,
                {
                    backgroundColor: isDark ? '#18181b' : '#f8fafc',
                    borderColor: colors.cardBorder,
                },
            ]}
        >
            <View style={styles.sectionHeader}>
                <Ionicons name={icon} size={16} color={colors.primary} />
                <Text style={[styles.sectionLabel, { color: colors.text }]}>{label}</Text>
            </View>
            <TimeScrollPicker value={value} onChange={onChange} />
        </View>
    );
}

const styles = StyleSheet.create({
    timeSectionCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 12,
        gap: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
