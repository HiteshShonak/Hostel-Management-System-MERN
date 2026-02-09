import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAdminUsers, useAdminLinkParent } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { AdminUser } from '@/lib/services';

export default function AdminLinkParent() {
    const { colors, isDark } = useTheme();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedParent, setSelectedParent] = useState<AdminUser | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<AdminUser | null>(null);
    const [relationship, setRelationship] = useState<'Father' | 'Mother' | 'Guardian'>('Father');
    const [searchParent, setSearchParent] = useState('');
    const [searchStudent, setSearchStudent] = useState('');

    const { data: parentsData, isLoading: loadingParents } = useAdminUsers({
        role: 'parent',
        search: searchParent || undefined,
    });

    const { data: studentsData, isLoading: loadingStudents } = useAdminUsers({
        role: 'student',
        search: searchStudent || undefined,
    });

    const linkMutation = useAdminLinkParent();

    React.useEffect(() => {
        if (linkMutation.isSuccess) {
            Alert.alert(
                '✅ Success',
                `${selectedParent?.name} has been linked to ${selectedStudent?.name} as ${relationship}`,
                [{ text: 'OK', onPress: resetForm }]
            );
        }
    }, [linkMutation.isSuccess]);

    React.useEffect(() => {
        if (linkMutation.isError) {
            Alert.alert('Error', (linkMutation.error as any)?.message || 'Failed to link parent');
        }
    }, [linkMutation.isError]);

    const parents = parentsData?.users || [];
    const students = studentsData?.users || [];

    const resetForm = () => {
        setStep(1);
        setSelectedParent(null);
        setSelectedStudent(null);
        setRelationship('Father');
        setSearchParent('');
        setSearchStudent('');
    };

    const handleLink = () => {
        if (selectedParent && selectedStudent) {
            linkMutation.mutate({
                parentId: selectedParent._id,
                studentId: selectedStudent._id,
                relationship,
            });
        }
    };

    const renderStep1 = () => (
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
                    onChangeText={setSearchParent}
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
                            selectedParent?._id === parent._id && { borderColor: '#7c3aed', backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }
                        ]}
                        onPress={() => setSelectedParent(parent)}
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
                    <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>Create a user with 'parent' role first</Text>
                </View>
            )}

            <Pressable
                style={[styles.nextBtn, !selectedParent && { backgroundColor: isDark ? '#4c1d95' : '#d4d4d4' }]}
                onPress={() => setStep(2)}
                disabled={!selectedParent}
            >
                <Text style={[styles.nextBtnText, !selectedParent && { color: isDark ? '#a78bfa' : 'white' }]}>Next: Select Student</Text>
                <Ionicons name="arrow-forward" size={20} color={!selectedParent && isDark ? '#a78bfa' : 'white'} />
            </Pressable>
        </>
    );

    const renderStep2 = () => (
        <>
            <Pressable style={styles.backStep} onPress={() => setStep(1)}>
                <Ionicons name="arrow-back" size={20} color="#7c3aed" />
                <Text style={styles.backStepText}>Back</Text>
            </Pressable>

            <Text style={[styles.stepTitle, { color: colors.text }]}>Step 2: Select Student</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>Choose the student to link with {selectedParent?.name}</Text>

            <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or roll number..."
                    placeholderTextColor={colors.textTertiary}
                    value={searchStudent}
                    onChangeText={setSearchStudent}
                />
            </View>

            {loadingStudents ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : students && students.length > 0 ? (
                students.map((student) => (
                    <Pressable
                        key={student._id}
                        style={[
                            styles.userCard,
                            { backgroundColor: colors.card, borderColor: colors.card },
                            selectedStudent?._id === student._id && { borderColor: '#7c3aed', backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }
                        ]}
                        onPress={() => setSelectedStudent(student)}
                    >
                        <View style={[styles.userAvatar, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                            <Text style={[styles.userAvatarText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                                {student.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{student.name}</Text>
                            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{student.rollNo} • Room {student.room}</Text>
                        </View>
                        {selectedStudent?._id === student._id && (
                            <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
                        )}
                    </Pressable>
                ))
            ) : (
                <View style={[styles.emptyBox, { backgroundColor: colors.card }]}>
                    <Ionicons name="school-outline" size={40} color={colors.textTertiary} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No students found</Text>
                </View>
            )}

            <Pressable
                style={[styles.nextBtn, !selectedStudent && { backgroundColor: isDark ? '#4c1d95' : '#d4d4d4' }]}
                onPress={() => setStep(3)}
                disabled={!selectedStudent}
            >
                <Text style={[styles.nextBtnText, !selectedStudent && { color: isDark ? '#a78bfa' : 'white' }]}>Next: Confirm Link</Text>
                <Ionicons name="arrow-forward" size={20} color={!selectedStudent && isDark ? '#a78bfa' : 'white'} />
            </Pressable>
        </>
    );

    const renderStep3 = () => (
        <>
            <Pressable style={styles.backStep} onPress={() => setStep(2)}>
                <Ionicons name="arrow-back" size={20} color="#7c3aed" />
                <Text style={styles.backStepText}>Back</Text>
            </Pressable>

            <Text style={[styles.stepTitle, { color: colors.text }]}>Step 3: Confirm Link</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>Review and confirm the parent-student link</Text>

            <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryAvatar, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="people" size={24} color={isDark ? '#fcd34d' : '#b45309'} />
                    </View>
                    <View style={styles.summaryInfo}>
                        <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>PARENT</Text>
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedParent?.name}</Text>
                        <Text style={[styles.summarySubvalue, { color: colors.textSecondary }]}>{selectedParent?.email}</Text>
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
                        <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedStudent?.name}</Text>
                        <Text style={[styles.summarySubvalue, { color: colors.textSecondary }]}>{selectedStudent?.rollNo} • Room {selectedStudent?.room}</Text>
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
                            relationship === rel && { borderColor: '#7c3aed', backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }
                        ]}
                        onPress={() => setRelationship(rel)}
                    >
                        <Text style={[
                            styles.relationOptionText,
                            { color: colors.textSecondary },
                            relationship === rel && { color: '#7c3aed' }
                        ]}>
                            {rel}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <Pressable
                style={[styles.confirmBtn, linkMutation.isPending && styles.confirmBtnDisabled]}
                onPress={handleLink}
                disabled={linkMutation.isPending}
            >
                {linkMutation.isPending ? (
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

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="🔗 Link Parent & Student" showBack />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Progress Steps */}
                <View style={styles.progressSteps}>
                    {[1, 2, 3].map((s) => (
                        <View key={s} style={styles.progressStep}>
                            <View style={[
                                styles.stepCircle,
                                { backgroundColor: colors.cardBorder },
                                step >= s && styles.stepCircleActive
                            ]}>
                                <Text style={[
                                    styles.stepNumber,
                                    { color: colors.textTertiary },
                                    step >= s && styles.stepNumberActive
                                ]}>{s}</Text>
                            </View>
                            <Text style={[styles.stepLabel, { color: colors.textSecondary }]}>
                                {s === 1 ? 'Parent' : s === 2 ? 'Student' : 'Confirm'}
                            </Text>
                        </View>
                    ))}
                </View>

                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
    progressSteps: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 40,
        marginBottom: 32,
    },
    progressStep: { alignItems: 'center' },
    stepCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    stepCircleActive: { backgroundColor: '#7c3aed' },
    stepNumber: { fontSize: 16, fontWeight: '600' },
    stepNumberActive: { color: 'white' },
    stepLabel: { fontSize: 12 },
    stepTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    stepSubtitle: { fontSize: 14, marginBottom: 20 },
    backStep: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    backStepText: { fontSize: 14, color: '#7c3aed', fontWeight: '500' },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 16,
        marginBottom: 16,
        gap: 12,
    },
    searchInput: { flex: 1, paddingVertical: 14, fontSize: 15 },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    userAvatarText: { fontSize: 20, fontWeight: '700' },
    userInfo: { flex: 1 },
    userName: { fontSize: 15, fontWeight: '600' },
    userEmail: { fontSize: 13, marginTop: 2 },
    emptyBox: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 12,
    },
    emptyText: { fontSize: 16, fontWeight: '600', marginTop: 12 },
    emptySubtext: { fontSize: 13, marginTop: 4 },
    nextBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#7c3aed',
        padding: 16,
        borderRadius: 12,
        marginTop: 24,
        gap: 8,
    },
    nextBtnDisabled: { backgroundColor: '#d4d4d4' },
    nextBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
    summaryCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },
    summaryRow: { flexDirection: 'row', alignItems: 'center' },
    summaryAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    summaryInfo: { flex: 1 },
    summaryLabel: { fontSize: 12, textTransform: 'uppercase' },
    summaryValue: { fontSize: 18, fontWeight: '600', marginTop: 2 },
    summarySubvalue: { fontSize: 13, marginTop: 2 },
    linkArrow: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    relationLabel: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
    relationOptions: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    relationOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
    },
    relationOptionText: { fontSize: 14, fontWeight: '500' },
    confirmBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#16a34a',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    confirmBtnDisabled: { backgroundColor: '#86efac' },
    confirmBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
