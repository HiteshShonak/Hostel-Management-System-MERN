import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { HelperUserSearchResult } from '@/lib/services';
import { ROLE_COLORS } from './useResetPasswordController';

interface UserSearchSectionProps {
    searchQuery: string;
    onChangeSearchQuery: (text: string) => void;
    onSearch: () => void;
    searchActive: boolean;
    isLoading: boolean;
    users?: HelperUserSearchResult[];
    onSelectUser: (user: HelperUserSearchResult) => void;
}

export function UserSearchSection({
    searchQuery,
    onChangeSearchQuery,
    onSearch,
    searchActive,
    isLoading,
    users,
    onSelectUser,
}: UserSearchSectionProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Find User</Text>
            <Text style={[styles.sectionSub, { color: colors.textSecondary }]}>
                Search by name, email, or roll number
            </Text>

            <View style={[styles.searchRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="search-outline" size={20} color={colors.textTertiary} style={{ marginLeft: 14 }} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search users..."
                    placeholderTextColor={colors.textTertiary}
                    value={searchQuery}
                    onChangeText={onChangeSearchQuery}
                    onSubmitEditing={onSearch}
                    returnKeyType="search"
                />
                <Pressable style={[styles.searchBtn, { backgroundColor: colors.primary }]} onPress={onSearch}>
                    <Text style={styles.searchBtnText}>Search</Text>
                </Pressable>
            </View>

            {/* Search Results */}
            {searchActive && isLoading && (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 16 }} />
            )}

            {searchActive && !isLoading && users && (
                <View style={{ gap: 8, marginTop: 4 }}>
                    {users.length === 0 ? (
                        <View style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Ionicons name="person-outline" size={32} color={colors.textTertiary} />
                            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No users found</Text>
                        </View>
                    ) : (
                        users.map((user) => (
                            <Pressable
                                key={user._id}
                                style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                                onPress={() => onSelectUser(user)}
                            >
                                <View style={[styles.userAvatar, { backgroundColor: `${ROLE_COLORS[user.role] || '#6366f1'}22` }]}>
                                    <Text style={[styles.userAvatarText, { color: ROLE_COLORS[user.role] || '#6366f1' }]}>
                                        {user.name[0].toUpperCase()}
                                    </Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                                    <Text style={[styles.userMeta, { color: colors.textSecondary }]}>
                                        {user.email} • {user.rollNo}
                                    </Text>
                                </View>
                                <View style={[styles.roleBadge, { backgroundColor: `${ROLE_COLORS[user.role] || '#6366f1'}22` }]}>
                                    <Text style={[styles.roleBadgeText, { color: ROLE_COLORS[user.role] || '#6366f1' }]}>
                                        {user.role}
                                    </Text>
                                </View>
                            </Pressable>
                        ))
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 14 },
    sectionTitle: { fontSize: 16, fontWeight: '700' },
    sectionSub: { fontSize: 13, marginTop: -8 },
    searchRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
    searchInput: { flex: 1, paddingVertical: 13, paddingHorizontal: 12, fontSize: 15 },
    searchBtn: { paddingHorizontal: 16, paddingVertical: 13, margin: 4, borderRadius: 10 },
    searchBtnText: { color: 'white', fontWeight: '700', fontSize: 14 },
    emptyBox: { alignItems: 'center', paddingVertical: 32, borderRadius: 14, borderWidth: 1, gap: 8 },
    emptyText: { fontSize: 14 },
    userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
    userAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    userAvatarText: { fontSize: 18, fontWeight: '700' },
    userName: { fontSize: 15, fontWeight: '600' },
    userMeta: { fontSize: 12, marginTop: 2 },
    roleBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    roleBadgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});
