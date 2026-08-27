import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import type { DayType } from '@/lib/types';

export const DAYS: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface DayTabBarProps {
    selectedDay: DayType;
    today: DayType;
    onSelectDay: (day: DayType) => void;
}

export function DayTabBar({ selectedDay, today, onSelectDay }: DayTabBarProps) {
    const { colors } = useTheme();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.daySelector}>
                {DAYS.map((day) => (
                    <Pressable
                        key={day}
                        onPress={() => onSelectDay(day)}
                        style={[
                            styles.dayBtn,
                            { backgroundColor: colors.backgroundSecondary },
                            selectedDay === day && { backgroundColor: colors.primary },
                        ]}
                    >
                        <Text
                            style={[
                                styles.dayText,
                                { color: colors.textSecondary },
                                selectedDay === day && styles.dayTextActive,
                            ]}
                        >
                            {day.slice(0, 3)}
                        </Text>
                        {day === today && <View style={[styles.todayDot, { backgroundColor: colors.success }]} />}
                    </Pressable>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    daySelector: { flexDirection: 'row', gap: 8, paddingVertical: 4 },
    dayBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 9999, alignItems: 'center' },
    dayText: { fontSize: 14, fontWeight: '500' },
    dayTextActive: { color: 'white' },
    todayDot: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
});
