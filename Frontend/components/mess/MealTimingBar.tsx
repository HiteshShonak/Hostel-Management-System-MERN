import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { formatTime12h } from '@/lib/utils';

interface MealTimingBarProps {
    timing?: { start: string; end: string };
    isMessStaff: boolean;
    onOpenTimingEditor: () => void;
}

export function MealTimingBar({ timing, isMessStaff, onOpenTimingEditor }: MealTimingBarProps) {
    const { colors, isDark } = useTheme();

    if (!timing) return null;

    return (
        <View
            style={[
                styles.timingCard,
                {
                    backgroundColor: isDark ? '#1e293b' : '#f0f7ff',
                    borderColor: isDark ? '#334155' : '#dbeafe',
                },
            ]}
        >
            <View style={[styles.iconWrapper, { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
                <Ionicons name="time" size={18} color="#6366f1" />
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.timingLabel, { color: colors.textSecondary }]}>Serving Hours</Text>
                <Text style={[styles.timingValue, { color: isDark ? '#93c5fd' : '#1e40af' }]}>
                    {formatTime12h(timing.start)} – {formatTime12h(timing.end)}
                </Text>
            </View>

            {isMessStaff && (
                <Pressable
                    style={[
                        styles.editBtn,
                        {
                            backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : '#e0e7ff',
                            borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : '#c7d2fe',
                        },
                    ]}
                    onPress={onOpenTimingEditor}
                >
                    <Ionicons name="create-outline" size={14} color="#6366f1" />
                    <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    timingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        gap: 2,
    },
    timingLabel: {
        fontSize: 11,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    timingValue: {
        fontSize: 14,
        fontWeight: '700',
    },
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366f1',
    },
});
