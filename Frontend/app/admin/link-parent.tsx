import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/lib/contexts/theme';
import {
    useLinkParentController,
    LinkProgressSteps,
    SelectParentStep,
    SelectStudentStep,
    ConfirmLinkStep,
} from '@/components/admin';

export default function AdminLinkParent() {
    const { colors } = useTheme();
    const {
        step,
        setStep,
        selectedParent,
        setSelectedParent,
        selectedStudent,
        setSelectedStudent,
        relationship,
        setRelationship,
        searchParent,
        setSearchParent,
        searchStudent,
        setSearchStudent,
        parents,
        students,
        loadingParents,
        loadingStudents,
        linkMutation,
        handleLink,
    } = useLinkParentController();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="🔗 Link Parent & Student" showBack />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                {/* Progress Steps */}
                <LinkProgressSteps step={step} />

                {step === 1 && (
                    <SelectParentStep
                        searchParent={searchParent}
                        onChangeSearchParent={setSearchParent}
                        parents={parents}
                        loadingParents={loadingParents}
                        selectedParent={selectedParent}
                        onSelectParent={setSelectedParent}
                        onNext={() => setStep(2)}
                    />
                )}

                {step === 2 && (
                    <SelectStudentStep
                        searchStudent={searchStudent}
                        onChangeSearchStudent={setSearchStudent}
                        students={students}
                        loadingStudents={loadingStudents}
                        selectedStudent={selectedStudent}
                        selectedParentName={selectedParent?.name}
                        onSelectStudent={setSelectedStudent}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                    />
                )}

                {step === 3 && selectedParent && selectedStudent && (
                    <ConfirmLinkStep
                        selectedParent={selectedParent}
                        selectedStudent={selectedStudent}
                        relationship={relationship}
                        onChangeRelationship={setRelationship}
                        onBack={() => setStep(2)}
                        onConfirm={handleLink}
                        isPending={linkMutation.isPending}
                    />
                )}
            </ScrollView>

            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16, paddingBottom: 100 },
});
