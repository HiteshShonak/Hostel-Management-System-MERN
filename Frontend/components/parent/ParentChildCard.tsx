import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { ParentChild } from '@/lib/services';

interface ParentChildCardProps {
    child: ParentChild;
}

export function ParentChildCard({ child }: ParentChildCardProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={[styles.childCard, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <View
                        style={[
                            styles.avatar,
                            {
                                backgroundColor: isDark ? '#451a03' : '#fef3c7',
                                borderColor: isDark ? '#b45309' : '#fcd34d',
                            },
                        ]}
                    >
                        <Text style={styles.avatarText}>{child.name.charAt(0).toUpperCase()}</Text>
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={[styles.childName, { color: colors.text }]}>{child.name}</Text>
                    <Text style={[styles.rollNo, { color: colors.textSecondary }]}>{child.rollNo}</Text>
                </View>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
                        <Ionicons name="home" size={18} color="#1d4ed8" />
                    </View>
                    <View>
                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Room</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.room}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="business" size={18} color="#b45309" />
                    </View>
                    <View>
                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Hostel</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.hostel}</Text>
                    </View>
                </View>

                {child.year && (
                    <View style={styles.detailItem}>
                        <View style={[styles.detailIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                            <Ionicons name="school" size={18} color="#16a34a" />
                        </View>
                        <View>
                            <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Year</Text>
                            <Text style={[styles.detailValue, { color: colors.text }]}>
                                {child.year === 1 ? '1st' : child.year === 2 ? '2nd' : child.year === 3 ? '3rd' : '4th'} Year
                            </Text>
                        </View>
                    </View>
                )}

                <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
                        <Ionicons name="call" size={18} color="#16a34a" />
                    </View>
                    <View>
                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Phone</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]}>{child.phone}</Text>
                    </View>
                </View>

                <View style={styles.detailItem}>
                    <View style={[styles.detailIcon, { backgroundColor: isDark ? '#3b0764' : '#fae8ff' }]}>
                        <Ionicons name="mail" size={18} color="#a855f7" />
                    </View>
                    <View>
                        <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Email</Text>
                        <Text style={[styles.detailValue, { color: colors.text }]} numberOfLines={1}>
                            {child.email}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={[styles.linkedInfo, { borderTopColor: colors.cardBorder }]}>
                <Ionicons name="link" size={14} color={colors.textTertiary} />
                <Text style={[styles.linkedText, { color: colors.textTertiary }]}>
                    Linked on {new Date(child.linkedAt).toLocaleDateString('en-IN')}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    childCard: { borderRadius: 20, padding: 20, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', borderWidth: 3 },
    avatarText: { fontSize: 28, fontWeight: '700', color: '#b45309' },
    nameContainer: { flex: 1 },
    childName: { fontSize: 20, fontWeight: '700' },
    rollNo: { fontSize: 14, marginTop: 2 },
    divider: { height: 1, marginVertical: 16 },
    detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    detailItem: { width: '45%', flexDirection: 'row', alignItems: 'center', gap: 10 },
    detailIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    detailLabel: { fontSize: 13, textTransform: 'uppercase' },
    detailValue: { fontSize: 14, fontWeight: '500', marginTop: 1 },
    linkedInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, paddingTop: 12, borderTopWidth: 1 },
    linkedText: { fontSize: 12 },
});
