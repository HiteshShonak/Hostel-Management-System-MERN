import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { SegmentedFilterTabs, FilterTabItem } from '@/components/ui/SegmentedFilterTabs';
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

    const roleTabs: FilterTabItem<string>[] = [
        { id: 'ALL', label: 'All' },
        ...ADMIN_ROLES.map((role) => ({
            id: role,
            label: role.replace('_', ' '),
        })),
    ];

    const activeTab = roleFilter || 'ALL';

    const handleSelectTab = (tabId: string) => {
        onSelectRoleFilter(tabId === 'ALL' || tabId === roleFilter ? null : tabId);
    };

    return (
        <View style={styles.container}>
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
            <SegmentedFilterTabs
                tabs={roleTabs}
                activeTab={activeTab}
                onSelectTab={handleSelectTab}
                activeColor="#7c3aed"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginBottom: 8 },
    searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, gap: 12 },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
});
