import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { AdminUser } from '@/lib/services';

interface SelectParentStepProps {
    searchParent: string;
    onChangeSearchParent: (text: string) => void;
    parents: AdminUser[];
    loadingParents: boolean;
    selectedParent: AdminUser | null;
    onSelectParent: (parent: AdminUser) => void;
    onNext: () => void;
}

export function SelectParentStep({
    searchParent,
    onChangeSearchParent,
    parents,
    loadingParents,
    selectedParent,
    onSelectParent,
    onNext,
}: SelectParentStepProps) {
    const { colors, isDark } = useTheme();

    return (
        <>
            <Text style={[styles.stepTitle, { color: colors.text }]}>Step 1: Select Parent</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>Choose the parent user to link</Text>

            <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or email..."
                    placeholderTextColor={colors.textTertiary}
                    value={searchParent}
                    onChangeText={onChangeSearchParent}
                />
            </View>

            {loadingParents ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : parents && parents.length > 0 ? (
                parents.map((parent) => (
                    <Pressable
                        key={parent._id}
                        style={[
                            styles.userCard,
                            { backgroundColor: colors.card, borderColor: colors.card },
                            selectedParent?._id === parent._id && {
                                borderColor: '#7c3aed',
                                backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                            },
                        ]}
                        onPress={() => onSelectParent(parent)}
                    >
                        <View style={[styles.userAvatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                            <Text style={[styles.userAvatarText, { color: isDark ? '#fcd34d' : '#b45309' }]}>
                                {parent.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{parent.name}</Text>
                            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{parent.email}</Text>
                        </View>
                        {selectedParent?._id === parent._id && (
                            <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                        )}
                    </Pressable>
                ))
            ) : (
                <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
                    <Ionicons name="person-add-outline" size={40} color={colors.textTertiary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No parents found</Text>
                    <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                        Create a user with 'parent' role first
                    </Text>
                </View>
            )}

            <Pressable
                style={[styles.nextBtn, !selectedParent && { backgroundColor: isDark ? '#4c1d95' : '#d4d4d4' }]}
                onPress={onNext}
                disabled={!selectedParent}
            >
                <Text style={[styles.nextBtnText, !selectedParent && { color: isDark ? '#a78bfa' : 'white' }]}>
                    Next: Select Student
                </Text>
                <Ionicons name="arrow-forward" size={20} color={!selectedParent && isDark ? '#a78bfa' : 'white'} />
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    stepSubtitle: { fontSize: 14, marginBottom: 20 },
    searchBox: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, marginBottom: 16, gap: 12 },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
    userCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 2 },
    userAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    userAvatarText: { fontSize: 20, fontWeight: '700' },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, fontWeight: '600' },
    userEmail: { fontSize: 13, marginTop: 2 },
    emptyBox: { alignItems: 'center', padding: 40, borderRadius: 12 },
    emptyText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
    emptySubtext: { fontSize: 13, marginTop: 4 },
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c3aed', padding: 16, borderRadius: 12, marginTop: 24, gap: 8 },
    nextBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
