import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { AdminUser } from '@/lib/services';
import type { RelationshipType } from './useLinkParentController';

interface ConfirmLinkStepProps {
    selectedParent: AdminUser;
    selectedStudent: AdminUser;
    relationship: RelationshipType;
    onChangeRelationship: (rel: RelationshipType) => void;
    onBack: () => void;
    onConfirm: () => void;
    isPending: boolean;
}

export function ConfirmLinkStep({
    selectedParent,
    selectedStudent,
    relationship,
    onChangeRelationship,
    onBack,
    onConfirm,
    isPending,
}: ConfirmLinkStepProps) {
    const { colors, isDark } = useTheme();

    return (
        <>
            <Pressable style={styles.backStep} onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="#7c3aed" />
                <Text style={styles.backStepText}>Back</Text>
            </Pressable>

            <Text style={[styles.stepTitle, { color: colors.text }]}>Step 3: Confirm Link</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Review and confirm the parent-student link
            </Text>

            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryAvatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="people" size={24} color={isDark ? '#fcd34d' : '#b45309'} />
                    </View>
                    <View style={styles.summaryInfo}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>PARENT</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedParent.name}</Text>
                        <Text style={[styles.summarySubvalue, { color: colors.textSecondary }]}>{selectedParent.email}</Text>
                    </View>
                </View>

                <View style={styles.linkArrow}>
                    <Ionicons name="link" size={24} color="#7c3aed" />
                </View>

                <View style={styles.summaryRow}>
                    <View style={[styles.summaryAvatar, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="school" size={24} color={isDark ? '#93c5fd' : '#1d4ed8'} />
                    </View>
                    <View style={styles.summaryInfo}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>STUDENT</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedStudent.name}</Text>
                        <Text style={[styles.summarySubvalue, { color: colors.textSecondary }]}>
                            {selectedStudent.rollNo} • Room {selectedStudent.room}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.relationLabel, { color: colors.textSecondary }]}>Relationship</Text>
            <View style={styles.relationOptions}>
                {(['Father', 'Mother', 'Guardian'] as const).map((rel) => (
                    <Pressable
                        key={rel}
                        style={[
                            styles.relationOption,
                            { backgroundColor: colors.card, borderColor: colors.card },
                            relationship === rel && {
                                borderColor: '#7c3aed',
                                backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                            },
                        ]}
                        onPress={() => onChangeRelationship(rel)}
                    >
                        <Text
                            style={[
                                styles.relationOptionText,
                                { color: colors.textSecondary },
                                relationship === rel && { color: '#7c3aed' },
                            ]}
                        >
                            {rel}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Pressable
                style={[styles.confirmBtn, isPending && styles.confirmBtnDisabled]}
                onPress={onConfirm}
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator size="small" color="white" />
                ) : (
                    <>
                        <Ionicons name="link" size={20} color="white" />
                        <Text style={styles.confirmBtnText}>Create Link</Text>
                    </>
                )}
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    backStep: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    backStepText: { fontSize: 14, color: '#7c3aed', fontWeight: '500' },
    stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    stepSubtitle: { fontSize: 14, marginBottom: 20 },
    summaryCard: { borderRadius: 16, padding: 24, marginBottom: 24 },
    summaryRow: { flexDirection: 'row', alignItems: 'center' },
    summaryAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    summaryInfo: { flex: 1 },
    summaryLabel: { fontSize: 13, textTransform: 'uppercase' },
    summaryValue: { fontSize: 18, fontWeight: '600', marginTop: 2 },
    summarySubvalue: { fontSize: 13, marginTop: 2 },
    linkArrow: { alignItems: 'center', paddingVertical: 16 },
    relationLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    relationOptions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    relationOption: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 2 },
    relationOptionText: { fontSize: 14, fontWeight: '500' },
    confirmBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16a34a', padding: 16, borderRadius: 12, gap: 8 },
    confirmBtnDisabled: { backgroundColor: '#86efac' },
    confirmBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
