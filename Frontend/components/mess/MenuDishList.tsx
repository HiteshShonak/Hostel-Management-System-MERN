import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface MenuDishListProps {
    dishes: string[];
    isMessStaff: boolean;
    onEditMenu: () => void;
}

export function MenuDishList({ dishes, isMessStaff, onEditMenu }: MenuDishListProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.menuList}>
            {dishes.length > 0 ? (
                dishes.map((dish, index) => (
                    <View
                        key={`${dish}-${index}`}
                        style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
                    >
                        <View style={[styles.dishIcon, { backgroundColor: colors.backgroundSecondary }]}>
                            <Ionicons name="restaurant" size={18} color={colors.textSecondary} />
                        </View>
                        <Text style={[styles.dishName, { color: colors.text }]}>{dish}</Text>
                    </View>
                ))
            ) : (
                <View style={[styles.emptyMenu, { backgroundColor: colors.backgroundSecondary }]}>
                    <Ionicons name="restaurant-outline" size={48} color={colors.textTertiary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No items for this meal</Text>
                    {isMessStaff && (
                        <Pressable style={[styles.addItemBtn, { backgroundColor: colors.primary }]} onPress={onEditMenu}>
                            <Text style={styles.addItemText}>Add Items</Text>
                        </Pressable>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    menuList: { gap: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderWidth: 1, borderRadius: 12 },
    dishIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    dishName: { fontWeight: '500', flex: 1 },
    emptyMenu: { alignItems: 'center', padding: 32, borderRadius: 12 },
    emptyText: { marginTop: 12 },
    addItemBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    addItemText: { color: 'white', fontWeight: '500' },
});
