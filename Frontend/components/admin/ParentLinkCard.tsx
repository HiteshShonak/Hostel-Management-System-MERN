import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { ParentStudentLink } from '@/lib/services';

interface ParentLinkCardProps {
    link: ParentStudentLink;
    onUnlink: (link: ParentStudentLink) => void;
    isPending: boolean;
}

export function ParentLinkCard({ link, onUnlink, isPending }: ParentLinkCardProps) {
    const { colors, isDark } = useTheme();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <View style={[styles.linkCard, { backgroundColor: colors.card }]}>
            {/* Parent section */}
            <View style={styles.personSection}>
                <View style={[styles.personAvatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                    <Ionicons name="people" size={20} color={isDark ? '#fcd34d' : '#b45309'} />
                </View>
                <View style={styles.personInfo}>
                    <Text style={[styles.personRole, { color: colors.textTertiary }]}>PARENT</Text>
                    <Text style={[styles.personName, { color: colors.text }]}>{link.parent.name}</Text>
                    <Text style={[styles.personDetails, { color: colors.textSecondary }]}>{link.parent.email}</Text>
                </View>
            </View>

            {/* Connection line */}
            <View style={styles.connectionLine}>
                <View style={[styles.line, { backgroundColor: colors.cardBorder }]} />
                <View style={[styles.relationBadge, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                    <Text style={[styles.relationText, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>
                        {link.relationship}
                    </Text>
                </View>
                <View style={[styles.line, { backgroundColor: colors.cardBorder }]} />
            </View>

            {/* Student section */}
            <View style={styles.personSection}>
                <View style={[styles.personAvatar, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="school" size={20} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                </View>
                <View style={styles.personInfo}>
                    <Text style={[styles.personRole, { color: colors.textTertiary }]}>STUDENT</Text>
                    <Text style={[styles.personName, { color: colors.text }]}>{link.student.name}</Text>
                    <Text style={[styles.personDetails, { color: colors.textSecondary }]}>
                        {link.student.rollNo} • Room {link.student.room}
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
                <View style={styles.linkedInfo}>
                    <Ionicons name="time-outline" size={14} color={colors.textTertiary} />
                    <Text style={[styles.linkedText, { color: colors.textTertiary }]}>
                        Linked on {formatDate(link.createdAt)} by {link.linkedBy?.name || 'System'}
                    </Text>
                </View>
                <Pressable
                    style={[styles.unlinkBtn, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}
                    onPress={() => onUnlink(link)}
                    disabled={isPending}
                >
                    <Ionicons name="unlink" size={16} color={isDark ? '#fca5a5' : '#dc2626'} />
                    <Text style={[styles.unlinkBtnText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                        Remove
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    linkCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
    personSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    personAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    personInfo: { flex: 1 },
    personRole: { fontSize: 12, fontWeight: '600', letterSpacing: 1 },
    personName: { fontSize: 16, fontWeight: '600', marginTop: 2 },
    personDetails: { fontSize: 13, marginTop: 2 },
    connectionLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingLeft: 24 },
    line: { flex: 1, height: 2 },
    relationBadge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginHorizontal: 8 },
    relationText: { fontSize: 12, fontWeight: '600' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1 },
    linkedInfo: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    linkedText: { fontSize: 13 },
    unlinkBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    unlinkBtnText: { fontSize: 12, fontWeight: '500' },
});
