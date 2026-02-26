import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { DashboardHeader } from '../components/dashboard/header';
import { QuickActions } from '../components/dashboard/quick-actions';
import { AttendanceCard } from '../components/dashboard/attendance-card';
import { ActivePassCard } from '../components/dashboard/active-pass-card';
import { RecentNotices } from '../components/dashboard/recent-notices';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { usePendingGatePasses, useActiveAlerts, useRefreshDashboard, useWardenDashboardStats, useSystemConfig } from '@/lib/hooks';
import { getCurrentISTHour, isWithinTimeWindow } from '@/lib/utils/date';

function StudentDashboard() {
    const { data: config } = useSystemConfig();
    const currentHour = getCurrentISTHour();
    // is it attendance time? default to 7-10pm
    const isAttendanceTime = config?.attendanceWindow?.enabled
        ? isWithinTimeWindow(config.attendanceWindow.startHour, config.attendanceWindow.endHour)
        : currentHour >= 19 && currentHour < 22;

    return (
        <>
            <ActivePassCard />
            <QuickActions />
            {isAttendanceTime && <AttendanceCard />}
            <RecentNotices />
        </>
    );
}

// stuff for wardens
function WardenDashboard() {
    const { colors, isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();
    const { data: stats } = useWardenDashboardStats();


    return (
        <View style={styles.wardenContent}>
            {/* quick stats - 2x2 grid */}
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#052e16' : 'white' }]}>
                        <Ionicons name="home" size={22} color="#16a34a" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.studentsInside || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Inside</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                        <Ionicons name="walk" size={22} color="#f59e0b" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.studentsOut || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Outside</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#172554' : 'white' }]}>
                        <Ionicons name="checkmark-circle" size={22} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{stats?.attendancePercentage || 0}%</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Attendance</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#450a0a' : 'white' }]}>
                        <Ionicons name="warning" size={22} color="#dc2626" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{activeAlerts?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Alerts</Text>
                </View>
            </View>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/students')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="people" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Students</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/gate-pass')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="time" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Requests ({pendingPasses?.length || 0})</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/pass-history')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="document-text" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Pass History</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/qr-scanner')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="scan" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Scan QR</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="list" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/notices')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                        <Ionicons name="megaphone" size={24} color="#9333ea" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Notices</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/emergency')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                        <Ionicons name="alert-circle" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>SOS Alerts</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/complaints')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="chatbox-ellipses" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Complaints</Text>
                </Pressable>
            </View>
        </View>
    );
}

// mess staff dashboard
function MessStaffDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.staffContent}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess-menu')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Edit Menu</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/food-ratings')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="star" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>View Ratings</Text>
                </Pressable>
            </View>
        </View>
    );
}

// guard dashboard with scanner
function GuardDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.guardContent}>
            {/* big scan button */}
            <Pressable style={[styles.scanQRButton, {
                backgroundColor: isDark ? '#052e16' : '#dcfce7',
                borderColor: isDark ? '#14532d' : '#bbf7d0'
            }]} onPress={() => router.push('/qr-scanner')}>
                <View style={[styles.scanQRIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="scan" size={48} color={isDark ? '#22c55e' : '#16a34a'} />
                </View>
                <View style={styles.scanQRTextContainer}>
                    <Text style={[styles.scanQRTitle, { color: isDark ? '#4ade80' : '#166534' }]}>Scan Gate Pass</Text>
                    <Text style={[styles.scanQRSubtitle, { color: isDark ? '#22c55e' : '#15803d' }]}>Verify student entry/exit</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color={isDark ? '#4ade80' : '#16a34a'} />
            </Pressable>

            {/* Quick Actions */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
            <View style={styles.quickGrid}>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="footsteps" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
                <Pressable style={[styles.quickCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess-menu')}>
                    <View style={[styles.quickIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.quickLabel, { color: colors.text }]}>Mess Menu</Text>
                </Pressable>
            </View>

            <RecentNotices />
        </View>
    );
}

// parent dashboard (gold theme)
function ParentDashboard() {
    const { colors, isDark } = useTheme();
    return (
        <View style={styles.parentContent}>
            {/* Welcome Section */}
            <View style={[styles.parentWelcome, {
                backgroundColor: isDark ? '#451a03' : '#fef3c7',
                borderColor: isDark ? '#92400e' : '#fcd34d'
            }]}>
                <View style={[styles.parentWelcomeIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="people" size={32} color="#b45309" />
                </View>
                <View style={styles.parentWelcomeText}>
                    <Text style={[styles.parentWelcomeTitle, { color: isDark ? '#fbbf24' : '#92400e' }]}>Parent Dashboard</Text>
                    <Text style={[styles.parentWelcomeSubtitle, { color: isDark ? '#fcd34d' : '#b45309' }]}>Monitor your child's activities</Text>
                </View>
            </View>

            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>My Children</Text>
            <Pressable style={[styles.parentActionCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/children')}>
                <View style={[styles.parentActionIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                    <Ionicons name="people-circle" size={28} color="#b45309" />
                </View>
                <View style={styles.parentActionInfo}>
                    <Text style={[styles.parentActionTitle, { color: colors.text }]}>View Children</Text>
                    <Text style={[styles.parentActionSubtitle, { color: colors.textSecondary }]}>See linked students and their details</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#b45309" />
            </Pressable>

            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>Gate Pass Approvals</Text>
            <View style={styles.parentGrid}>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/pending-passes')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="time" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>Pending</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>Awaiting approval</Text>
                </Pressable>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/pass-history')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="checkmark-done" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>History</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>all gate passes</Text>
                </Pressable>
            </View>

            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>Attendance Tracking</Text>
            <View style={styles.parentGrid}>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/today-attendance')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="today" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>Today</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>Current status</Text>
                </Pressable>
                <Pressable style={[styles.parentGridCard, { backgroundColor: colors.card }]} onPress={() => router.push('/parent/attendance-history')}>
                    <View style={[styles.parentGridIcon, { backgroundColor: isDark ? '#581c87' : '#fae8ff' }]}>
                        <Ionicons name="calendar" size={24} color="#a855f7" />
                    </View>
                    <Text style={[styles.parentGridLabel, { color: colors.text }]}>History</Text>
                    <Text style={[styles.parentGridSubtext, { color: colors.textSecondary }]}>Full attendance</Text>
                </Pressable>
            </View>

            <Text style={[styles.parentSectionTitle, { color: isDark ? '#fbbf24' : '#78350f' }]}>General</Text>
            <Pressable style={[styles.parentActionCard, { backgroundColor: colors.card }]} onPress={() => router.push('/notices')}>
                <View style={[styles.parentActionIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="megaphone" size={28} color="#1d4ed8" />
                </View>
                <View style={styles.parentActionInfo}>
                    <Text style={[styles.parentActionTitle, { color: colors.text }]}>Notices</Text>
                    <Text style={[styles.parentActionSubtitle, { color: colors.textSecondary }]}>View hostel announcements</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#1d4ed8" />
            </Pressable>
        </View>
    );
}

// admin dashboard (God mode)
function AdminDashboard() {
    const { colors, isDark } = useTheme();
    const { data: pendingPasses } = usePendingGatePasses();
    const { data: activeAlerts } = useActiveAlerts();


    return (
        <View style={styles.adminContent}>
            {/* Admin Header */}
            <View style={[styles.adminHeader, {
                backgroundColor: isDark ? '#3b0764' : '#f3e8ff',
                borderColor: isDark ? '#6b21a8' : '#e9d5ff'
            }]}>
                <View style={[styles.adminHeaderIcon, { backgroundColor: colors.card }]}>
                    <Ionicons name="shield-checkmark" size={32} color="#7c3aed" />
                </View>
                <View style={styles.adminHeaderText}>
                    <Text style={[styles.adminHeaderTitle, { color: isDark ? '#e9d5ff' : '#5b21b6' }]}>Admin Dashboard</Text>
                    <Text style={[styles.adminHeaderSubtitle, { color: isDark ? '#d8b4fe' : '#7c3aed' }]}>Full system access</Text>
                </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.statsRow}>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#450a0a' : 'white' }]}>
                        <Ionicons name="warning" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{activeAlerts?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Alerts</Text>
                </View>
                <View style={[styles.statCard, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                    <View style={[styles.statIcon, { backgroundColor: isDark ? '#431407' : 'white' }]}>
                        <Ionicons name="time" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.statNumber, { color: colors.text }]}>{pendingPasses?.length || 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Passes</Text>
                </View>
            </View>

            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Administration</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/users')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#3b0764' : '#f3e8ff' }]}>
                        <Ionicons name="people" size={24} color="#7c3aed" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Users</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/link-parent')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="link" size={24} color="#b45309" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Link Parents</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/parent-links')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="git-network" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>View Links</Text>
                </Pressable>
            </View>

            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Gate Pass Management</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/qr-scanner')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="scan" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Scan QR</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/gate-pass')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                        <Ionicons name="checkmark-done" size={24} color="#1d4ed8" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Approve</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/students-out')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#431407' : '#fff7ed' }]}>
                        <Ionicons name="walk" size={24} color="#f59e0b" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Outside</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/recent-entries')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="enter" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Entries</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/guard/activity-logs')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="footsteps" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Logs</Text>
                </Pressable>
            </View>

            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Communication</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/notices')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#451a03' : '#fef3c7' }]}>
                        <Ionicons name="megaphone" size={24} color="#d97706" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Notices</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/emergency')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#450a0a' : '#fef2f2' }]}>
                        <Ionicons name="alert-circle" size={24} color="#dc2626" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>SOS Alerts</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/complaints')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="chatbox-ellipses" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Complaints</Text>
                </Pressable>
            </View>

            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>Mess Management</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/mess-menu')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#f0fdf4' }]}>
                        <Ionicons name="restaurant" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Mess Menu</Text>
                </Pressable>
            </View>

            <Text style={[styles.adminSectionTitle, { color: isDark ? '#a78bfa' : '#4c1d95' }]}>System Settings</Text>
            <View style={styles.adminGrid}>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/stats')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#1e1b4b' : '#e0e7ff' }]}>
                        <Ionicons name="stats-chart" size={24} color="#4f46e5" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Statistics</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/admin/config')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#831843' : '#fce7f3' }]}>
                        <Ionicons name="settings" size={24} color="#db2777" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Config</Text>
                </Pressable>
                <Pressable style={[styles.adminCard, { backgroundColor: colors.card }]} onPress={() => router.push('/warden/students')}>
                    <View style={[styles.adminCardIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="people" size={24} color="#16a34a" />
                    </View>
                    <Text style={[styles.adminCardLabel, { color: colors.text }]}>Students</Text>
                </Pressable>
            </View>
        </View>
    );
}

export default function Dashboard() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const { colors, isDark } = useTheme();
    const { refreshing, onRefresh } = useRefreshDashboard();

    if (isLoading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color="#1d4ed8" />
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </View>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    // pick the right dashboard based on role
    const renderDashboard = () => {
        switch (user?.role) {
            case 'admin':
                return <AdminDashboard />;
            case 'warden':
                return <WardenDashboard />;
            case 'parent':
                return <ParentDashboard />;
            case 'mess_staff':
                return <MessStaffDashboard />;
            case 'guard':
                return <GuardDashboard />;
            default:
                return <StudentDashboard />;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <DashboardHeader />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1d4ed8']} tintColor="#1d4ed8" />
                }
            >
                {renderDashboard()}
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12 },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 100 },
    wardenContent: { padding: 16 },
    staffContent: { padding: 16 },
    guardContent: { padding: 16 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    statCard: {
        width: '48%',
        padding: 16,
        borderRadius: 14,
        alignItems: 'center',
    },
    statIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    statNumber: { fontSize: 24, fontWeight: '700' },
    statLabel: { fontSize: 13, marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
    quickCard: {
        width: '47%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    quickIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    quickLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center' },
    // Guard Dashboard Styles
    scanQRButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        marginBottom: 24,
    },
    scanQRIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    scanQRTextContainer: { flex: 1 },
    scanQRTitle: { fontSize: 20, fontWeight: '700' },
    scanQRSubtitle: { fontSize: 14, marginTop: 4 },
    // Parent Dashboard Styles - Gold Theme
    parentContent: { padding: 16 },
    parentWelcome: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    parentWelcomeIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    parentWelcomeText: { flex: 1 },
    parentWelcomeTitle: { fontSize: 22, fontWeight: '700' },
    parentWelcomeSubtitle: { fontSize: 14, marginTop: 4 },
    parentSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    parentActionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    parentActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    parentActionInfo: { flex: 1 },
    parentActionTitle: { fontSize: 16, fontWeight: '600' },
    parentActionSubtitle: { fontSize: 13, marginTop: 2 },
    parentGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    parentGridCard: {
        flex: 1,
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    parentGridIcon: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    parentGridLabel: { fontSize: 15, fontWeight: '600' },
    parentGridSubtext: { fontSize: 13, marginTop: 2 },
    // Admin Dashboard Styles - Purple Accent
    adminContent: { padding: 16 },
    adminHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    adminHeaderIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    adminHeaderText: { flex: 1 },
    adminHeaderTitle: { fontSize: 22, fontWeight: '700' },
    adminHeaderSubtitle: { fontSize: 14, marginTop: 4 },
    adminSectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, marginTop: 8 },
    adminGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
    adminCard: {
        width: '30%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    adminCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    adminCardLabel: { fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
