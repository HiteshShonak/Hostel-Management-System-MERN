import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PageHeader } from '@/components/ui/PageHeader';
import { BottomNav } from '@/components/ui/BottomNav';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { authService } from '@/lib/services';
import { useQueryClient } from '@tanstack/react-query';

const menuItems = [
    { icon: 'settings', label: 'Settings', destructive: false },
    { icon: 'help-circle', label: 'Help & Support', destructive: false },
    { icon: 'log-out', label: 'Logout', destructive: true },
] as const;

export default function ProfilePage() {
    const { user, isLoading, signOut } = useAuth();
    const { mode, setMode, colors, isDark } = useTheme();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await authService.logout();
                        signOut();
                        queryClient.clear();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    const handleMenuPress = (label: string) => {
        if (label === 'Logout') {
            handleLogout();
        } else if (label === 'Settings') {
            router.push('/settings');
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Profile" />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
                <BottomNav />
            </View>
        );
    }

    // not logged in? show sign in screen
    if (!user) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Profile" />
                <View style={styles.notLoggedIn}>
                    <Ionicons name="person-circle-outline" size={80} color={colors.textTertiary} />
                    <Text style={[styles.notLoggedInTitle, { color: colors.text }]}>Not Logged In</Text>
                    <Text style={[styles.notLoggedInText, { color: colors.textSecondary }]}>Sign in to access your profile</Text>
                    <Pressable style={[styles.loginButton, { backgroundColor: colors.primary }]} onPress={() => router.push('/login')}>
                        <Text style={styles.loginButtonText}>Sign In</Text>
                    </Pressable>
                    <Pressable style={styles.registerButton} onPress={() => router.push('/register')}>
                        <Text style={[styles.registerButtonText, { color: colors.primary }]}>Create Account</Text>
                    </Pressable>
                </View>
                <BottomNav />
            </View>
        );
    }

    // what to show depends on the role
    const isStudent = user.role === 'student';
    const isParent = user.role === 'parent';
    const isStaff = ['warden', 'admin', 'guard', 'mess_staff'].includes(user.role);

    const profileItems: Array<{ icon: string; label: string; value: string }> = [];

    // staff get employee id, students get roll number
    if (isStudent) {
        profileItems.push({ icon: 'keypad', label: 'Roll Number', value: user.rollNo || 'N/A' });
    } else if (isStaff) {
        profileItems.push({ icon: 'id-card', label: 'Employee ID', value: user.rollNo || 'N/A' });
    }

    // only students have rooms
    if (isStudent) {
        profileItems.push({ icon: 'bed', label: 'Room Number', value: user.room || 'N/A' });
        profileItems.push({ icon: 'business', label: 'Hostel', value: user.hostel || 'N/A' });
    }

    // Email for everyone
    profileItems.push({ icon: 'mail', label: 'Email', value: user.email });

    // Phone for everyone
    profileItems.push({ icon: 'call', label: 'Phone', value: user.phone || 'N/A' });

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Profile" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <Avatar style={styles.avatar}>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                                <Text style={styles.initials}>{user.name.split(' ').map((n) => n[0]).join('')}</Text>
                            </AvatarFallback>
                        </Avatar>
                        <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
                        <Text style={[styles.userRole, { color: colors.primary }]}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Text>
                    </View>

                    {/* Theme Selection */}
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        <View style={styles.themeRow}>
                            <View style={styles.themeHeader}>
                                <Ionicons name="color-palette" size={20} color={colors.textSecondary} />
                                <Text style={[styles.themeTitle, { color: colors.text }]}>Appearance</Text>
                            </View>
                            <View style={styles.themeToggleGroup}>
                                <Pressable
                                    onPress={() => setMode('light')}
                                    style={[
                                        styles.themeToggle,
                                        { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                                        mode === 'light' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }
                                    ]}
                                >
                                    <Ionicons name="sunny" size={20} color={mode === 'light' ? colors.primary : colors.textSecondary} />
                                </Pressable>
                                <Pressable
                                    onPress={() => setMode('dark')}
                                    style={[
                                        styles.themeToggle,
                                        { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                                        mode === 'dark' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }
                                    ]}
                                >
                                    <Ionicons name="moon" size={20} color={mode === 'dark' ? colors.primary : colors.textSecondary} />
                                </Pressable>
                                <Pressable
                                    onPress={() => setMode('system')}
                                    style={[
                                        styles.themeToggle,
                                        { backgroundColor: colors.backgroundSecondary, borderColor: colors.cardBorder },
                                        mode === 'system' && { borderColor: colors.primary, backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }
                                    ]}
                                >
                                    <Ionicons name="phone-portrait" size={20} color={mode === 'system' ? colors.primary : colors.textSecondary} />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Profile Details */}
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        {profileItems.map((item, index) => (
                            <View key={item.label} style={[styles.itemRow, index !== profileItems.length - 1 && [styles.itemBorder, { borderBottomColor: colors.cardBorder }]]}>
                                <View style={[styles.iconBox, { backgroundColor: isDark ? colors.backgroundSecondary : '#f5f5f5' }]}>
                                    <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={[styles.itemLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                                    <Text style={[styles.itemValue, { color: colors.text }]}>{item.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Menu Items */}
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                        {menuItems.map((item, index) => (
                            <Pressable key={item.label} onPress={() => handleMenuPress(item.label)} style={[styles.itemRow, index !== menuItems.length - 1 && [styles.itemBorder, { borderBottomColor: colors.cardBorder }]]}>
                                <View style={[styles.iconBox, item.destructive && (isDark ? { backgroundColor: '#3a1a1a' } : styles.iconBoxDestructive), !item.destructive && { backgroundColor: isDark ? colors.backgroundSecondary : '#f5f5f5' }]}>
                                    <Ionicons name={item.icon as any} size={20} color={item.destructive ? colors.danger : colors.primary} />
                                </View>
                                <Text style={[styles.menuLabel, { color: item.destructive ? colors.danger : colors.text }]}>{item.label}</Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </Pressable>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },
    scrollView: { flex: 1 },
    scrollContent: { paddingBottom: 80 },
    content: { padding: 16, gap: 24 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    notLoggedIn: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    notLoggedInTitle: { fontSize: 20, fontWeight: '600', color: '#0a0a0a', marginTop: 16 },
    notLoggedInText: { fontSize: 14, color: '#737373', marginTop: 4 },
    loginButton: { backgroundColor: '#1d4ed8', paddingVertical: 14, paddingHorizontal: 48, borderRadius: 12, marginTop: 24 },
    loginButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    registerButton: { paddingVertical: 14, paddingHorizontal: 48, marginTop: 12 },
    registerButtonText: { color: '#1d4ed8', fontSize: 16, fontWeight: '600' },
    profileHeader: { alignItems: 'center', paddingVertical: 16 },
    avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: 'rgba(29, 78, 216, 0.2)' },
    avatarFallback: { backgroundColor: '#1d4ed8' },
    initials: { color: 'white', fontSize: 24, fontWeight: '600' },
    userName: { marginTop: 16, fontSize: 20, fontWeight: '600', color: '#0a0a0a' },
    userRole: { fontSize: 14, color: '#1d4ed8', fontWeight: '500', marginTop: 4 },
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        overflow: 'hidden',
    },
    themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    themeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    themeTitle: { fontSize: 14, fontWeight: '600', color: '#0a0a0a' },
    themeToggleGroup: { flexDirection: 'row', gap: 8 },
    themeToggle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, backgroundColor: '#f5f5f5', borderColor: '#e5e5e5' },
    itemRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 },
    itemBorder: { borderBottomWidth: 1, borderBottomColor: '#e5e5e5' },
    iconBox: { padding: 8, backgroundColor: '#f5f5f5', borderRadius: 8 },
    iconBoxDestructive: { backgroundColor: '#fef2f2' },
    itemContent: { flex: 1 },
    itemLabel: { fontSize: 12, color: '#737373' },
    itemValue: { fontWeight: '500', color: '#0a0a0a' },
    menuLabel: { flex: 1, fontWeight: '500', color: '#0a0a0a' },
    menuLabelDestructive: { color: '#ef4444' },
});
