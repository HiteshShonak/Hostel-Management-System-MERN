import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { AdminUser } from '@/lib/services';

interface SelectStudentStepProps {
    searchStudent: string;
    onChangeSearchStudent: (text: string) => void;
    students: AdminUser[];
    loadingStudents: boolean;
    selectedStudent: AdminUser | null;
    selectedParentName?: string;
    onSelectStudent: (student: AdminUser) => void;
    onBack: () => void;
    onNext: () => void;
}

export function SelectStudentStep({
    searchStudent,
    onChangeSearchStudent,
    students,
    loadingStudents,
    selectedStudent,
    selectedParentName,
    onSelectStudent,
    onBack,
    onNext,
}: SelectStudentStepProps) {
    const { colors, isDark } = useTheme();

    return (
        <>
            <Pressable style={styles.backStep} onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="#7c3aed" />
                <Text style={styles.backStepText}>Back</Text>
            </Pressable>

            <Text style={[styles.stepTitle, { color: colors.text }]}>Step 2: Select Student</Text>
            <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
                Choose the student to link with {selectedParentName}
            </Text>

            <View style={[styles.searchBox, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textTertiary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search by name or roll number..."
                    placeholderTextColor={colors.textTertiary}
                    value={searchStudent}
                    onChangeText={onChangeSearchStudent}
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
                            selectedStudent?._id === student._id && {
                                borderColor: '#7c3aed',
                                backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                            },
                        ]}
                        onPress={() => onSelectStudent(student)}
                    >
                        <View style={[styles.userAvatar, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                            <Text style={[styles.userAvatarText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                                {student.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View style={styles.userInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{student.name}</Text>
                            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                                {student.rollNo} • Room {student.room}
                            </Text>
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
                onPress={onNext}
                disabled={!selectedStudent}
            >
                <Text style={[styles.nextBtnText, !selectedStudent && { color: isDark ? '#a78bfa' : 'white' }]}>
                    Next: Confirm Link
                </Text>
                <Ionicons name="arrow-forward" size={20} color={!selectedStudent && isDark ? '#a78bfa' : 'white'} />
            </Pressable>
        </>
    );
}

const styles = StyleSheet.create({
    backStep: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    backStepText: { fontSize: 14, color: '#7c3aed', fontWeight: '500' },
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
    nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#7c3aed', padding: 16, borderRadius: 12, marginTop: 24, gap: 8 },
    nextBtnText: { fontSize: 16, fontWeight: '600', color: 'white' },
});
