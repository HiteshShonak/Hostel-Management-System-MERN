import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { HelperUserSearchResult } from '@/lib/services';
import { ROLE_COLORS } from './useResetPasswordController';

interface SelectedUserCardProps {
    user: HelperUserSearchResult;
    onClear: () => void;
}

export function SelectedUserCard({ user, onClear }: SelectedUserCardProps) {
    const { colors, isDark } = useTheme();

    return (
        <View
            style={[
                styles.selectedCard,
                {
                    backgroundColor: isDark
                        ? `${ROLE_COLORS[user.role]}18`
                        : `${ROLE_COLORS[user.role]}0d`,
                    borderColor: `${ROLE_COLORS[user.role]}44`,
                },
            ]}
        >
            <View style={styles.selectedCardHeader}>
                <View style={[styles.userAvatar, { backgroundColor: `${ROLE_COLORS[user.role]}33` }]}>
                    <Text style={[styles.userAvatarText, { color: ROLE_COLORS[user.role] }]}>
                        {user.name[0].toUpperCase()}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.selectedName, { color: colors.text }]}>{user.name}</Text>
                    <Text style={[styles.selectedMeta, { color: colors.textSecondary }]}>{user.email}</Text>
                </View>
                <Pressable onPress={onClear} style={styles.clearBtn}>
                    <Ionicons name="close-circle" size={22} color={colors.textTertiary} />
                </Pressable>
            </View>
            <View style={styles.selectedDetails}>
                <Text style={[styles.selectedDetail, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>ID: </Text>
                    {user.rollNo}
                </Text>
                <Text style={[styles.selectedDetail, { color: colors.textSecondary }]}>
                    <Text style={{ fontWeight: '600', color: colors.text }}>Room: </Text>
                    {user.room}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    selectedCard: { padding: 16, borderRadius: 16, borderWidth: 1.5, gap: 12 },
    selectedCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    userAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
    userAvatarText: { fontSize: 18, fontWeight: '700' },
    selectedName: { fontSize: 16, fontWeight: '700' },
    selectedMeta: { fontSize: 13, marginTop: 2 },
    clearBtn: { padding: 4 },
    selectedDetails: { flexDirection: 'row', gap: 16 },
    selectedDetail: { fontSize: 13 },
});
