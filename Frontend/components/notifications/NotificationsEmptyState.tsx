import React from 'react';
import { EmptyStateView } from '@/components/ui/EmptyStateView';

export interface NotificationsEmptyStateProps {
    title?: string;
    subtitle?: string;
}

/**
 * Placeholder view displayed when there are no notifications in history.
 */
export function NotificationsEmptyState({
    title = 'No Notifications',
    subtitle = "You're all caught up!",
}: NotificationsEmptyStateProps) {
    return (
        <EmptyStateView
            icon="notifications-off-outline"
            title={title}
            subtitle={subtitle}
        />
    );
}
