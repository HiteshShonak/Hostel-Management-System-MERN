import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAdminUsers, useAdminLinkParent } from '@/lib/hooks';
import type { AdminUser } from '@/lib/services';

export type RelationshipType = 'Father' | 'Mother' | 'Guardian';

export function useLinkParentController() {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedParent, setSelectedParent] = useState<AdminUser | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<AdminUser | null>(null);
    const [relationship, setRelationship] = useState<RelationshipType>('Father');
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

    const resetForm = () => {
        setStep(1);
        setSelectedParent(null);
        setSelectedStudent(null);
        setRelationship('Father');
        setSearchParent('');
        setSearchStudent('');
    };

    useEffect(() => {
        if (linkMutation.isSuccess) {
            Alert.alert(
                'Success',
                `${selectedParent?.name} has been linked to ${selectedStudent?.name} as ${relationship}`,
                [{ text: 'OK', onPress: resetForm }]
            );
        }
    }, [linkMutation.isSuccess]);

    useEffect(() => {
        if (linkMutation.isError) {
            Alert.alert('Error', (linkMutation.error as any)?.message || 'Failed to link parent');
        }
    }, [linkMutation.isError]);

    const parents = parentsData?.users || [];
    const students = studentsData?.users || [];

    const handleLink = () => {
        if (selectedParent && selectedStudent) {
            linkMutation.mutate({
                parentId: selectedParent._id,
                studentId: selectedStudent._id,
                relationship,
            });
        }
    };

    return {
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
        resetForm,
    };
}
