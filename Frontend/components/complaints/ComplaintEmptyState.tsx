import React from 'react';
import { EmptyStateView } from '@/components/ui/EmptyStateView';

interface ComplaintEmptyStateProps {
    isWarden: boolean;
}

export function ComplaintEmptyState({ isWarden }: ComplaintEmptyStateProps) {
    return (
        <EmptyStateView
            icon="chatbox-ellipses-outline"
            title="No Complaints"
            subtitle={isWarden ? 'No complaints to review' : 'Lodge a complaint if you face any issues'}
        />
    );
}
