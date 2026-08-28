import React from 'react';
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { ADMIN_ROLES } from './useAdminUsersController';

interface AdminUserFiltersProps {
    search: string;
    onChangeSearch: (text: string) => void;
    roleFilter: string | null;
    onSelectRoleFilter: (role: string | null) => void;
}

export function AdminUserFilters({
    search,
    onChangeSearch,
    roleFilter,
    onSelectRoleFilter,
}: AdminUserFiltersProps) {
    const { colors } = useTheme();

    return (
        <>
            {/* Search Box */}
            <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search users..."
                    placeholderTextColor={colors.textTertiary}
                    value={search}
                    onChangeText={onChangeSearch}
                />
            </View>

            {/* Role Filter Chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
                contentContainerStyle={styles.filterContainer}
            >
                <Pressable
                    style={[styles.filterChip, { backgroundColor: colors.card }, !roleFilter && styles.filterChipActive]}
                    onPress={() => onSelectRoleFilter(null)}
                >
                    <Text style={[styles.filterText, { color: colors.textSecondary }, !roleFilter && styles.filterTextActive]}>
                        All
                    </Text>
                </Pressable>
                {ADMIN_ROLES.map((role) => (
                    <Pressable
                        key={role}
                        style={[
                            styles.filterChip,
                            { backgroundColor: colors.card },
                            roleFilter === role && styles.filterChipActive,
                        ]}
                        onPress={() => onSelectRoleFilter(roleFilter === role ? null : role)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: colors.textSecondary },
                                roleFilter === role && styles.filterTextActive,
                            ]}
                        >
                            {role.replace('_', ' ')}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, gap: 12 },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
    filterScroll: { marginBottom: 16 },
    filterContainer: { gap: 8 },
    filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    filterChipActive: { backgroundColor: '#7c3aed' },
    filterText: { fontSize: 13, fontWeight: '500', textTransform: 'capitalize' },
    filterTextActive: { color: 'white' },
});
