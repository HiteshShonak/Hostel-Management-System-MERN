import React from 'react';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatusCarousel } from '@/components/dashboard/status-carousel';
import { RecentNotices } from '@/components/dashboard/recent-notices';

// Student dashboard component
export function StudentDashboard() {
    return (
        <>
            <QuickActions />
            <StatusCarousel />
            <RecentNotices />
        </>
    );
}
