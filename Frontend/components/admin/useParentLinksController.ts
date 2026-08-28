import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAdminParentLinks, useAdminUnlinkParent } from '@/lib/hooks';
import type { ParentStudentLink } from '@/lib/services';

export function useParentLinksController() {
    const { data, isLoading, refetch, isRefetching } = useAdminParentLinks();
    const unlinkMutation = useAdminUnlinkParent();

    useEffect(() => {
        if (unlinkMutation.isSuccess) {
            Alert.alert('Success', 'Link has been removed');
        }
    }, [unlinkMutation.isSuccess]);

    useEffect(() => {
        if (unlinkMutation.isError) {
            Alert.alert('Error', (unlinkMutation.error as any)?.message || 'Failed to remove link');
        }
    }, [unlinkMutation.isError]);

    const handleUnlink = (link: ParentStudentLink) => {
        Alert.alert(
            'Remove Link',
            `Are you sure you want to unlink ${link.parent.name} from ${link.student.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => unlinkMutation.mutate(link._id) },
            ]
        );
    };

    return {
        data,
        isLoading,
        refetch,
        isRefetching,
        unlinkMutation,
        handleUnlink,
    };
}
