import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { MealType } from '@/lib/types';

export const MEALS: { type: MealType; icon: string; color: string }[] = [
    { type: 'Breakfast', icon: 'cafe', color: '#f59e0b' },
    { type: 'Lunch', icon: 'sunny', color: '#f97316' },
    { type: 'Dinner', icon: 'moon', color: '#6366f1' },
];

interface MealTabBarProps {
    selectedMeal: MealType;
    onSelectMeal: (meal: MealType) => void;
}

export function MealTabBar({ selectedMeal, onSelectMeal }: MealTabBarProps) {
    const { colors } = useTheme();

    return (
        <View style={[styles.mealTabs, { backgroundColor: colors.backgroundSecondary }]}>
            {MEALS.map(({ type, icon, color }) => (
                <Pressable
                    key={type}
                    onPress={() => onSelectMeal(type)}
                    style={[
                        styles.mealTab,
                        selectedMeal === type && [styles.mealTabActive, { backgroundColor: colors.card }],
                    ]}
                >
                    <Ionicons name={icon as any} size={16} color={color} />
                    <Text
                        style={[
                            styles.mealText,
                            { color: colors.textSecondary },
                            selectedMeal === type && { fontWeight: '500', color: colors.text },
                        ]}
                    >
                        {type}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    mealTabs: { flexDirection: 'row', padding: 4, borderRadius: 12 },
    mealTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderRadius: 8 },
    mealTabActive: {},
    mealText: { fontSize: 14 },
});
