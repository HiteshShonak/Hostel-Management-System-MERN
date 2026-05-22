import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/contexts/auth';
import { useTheme } from '@/lib/contexts/theme';
import { PRIMARY_COLOR } from '@/lib/constants';

const studentNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'qr-code', label: 'Gate Pass', href: '/shared/gate-pass' },
  { icon: 'restaurant', label: 'Mess', href: '/mess/mess-menu' },
  { icon: 'notifications', label: 'Notices', href: '/shared/notices' },
  { icon: 'person', label: 'Profile', href: '/shared/profile' },
] as const;

const wardenNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'scan', label: 'Scanner', href: '/shared/qr-scanner' },
  { icon: 'checkmark-done', label: 'Passes', href: '/shared/gate-pass' },
  { icon: 'notifications', label: 'Notices', href: '/shared/notices' },
  { icon: 'person', label: 'Profile', href: '/shared/profile' },
] as const;

const messStaffNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'restaurant', label: 'Menu', href: '/mess/mess-menu' },
  { icon: 'star', label: 'Ratings', href: '/shared/food-ratings' },
  { icon: 'notifications', label: 'Notices', href: '/shared/notices' },
  { icon: 'person', label: 'Profile', href: '/shared/profile' },
] as const;

const guardNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'scan', label: 'Scanner', href: '/shared/qr-scanner' },
  { icon: 'notifications', label: 'Notices', href: '/shared/notices' },
  { icon: 'person', label: 'Profile', href: '/shared/profile' },
] as const;

const helperNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'person-add', label: 'Register', href: '/helper/register-user' },
  { icon: 'key', label: 'Reset Pwd', href: '/helper/reset-password' },
  { icon: 'person', label: 'Profile', href: '/shared/profile' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { colors, isDark } = useTheme();

  // Select nav items based on user role
  const getNavItems = () => {
    switch (user?.role) {
      case 'warden':
      case 'admin':
        return wardenNavItems;
      case 'mess_staff':
        return messStaffNavItems;
      case 'guard':
        return guardNavItems;
      case 'helper':
        return helperNavItems;
      default:
        return studentNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.cardBorder }]}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={`${item.href}-${item.label}`} href={item.href as any} asChild>
            <Pressable style={styles.navItem}>
              <View style={[styles.iconContainer, isActive && { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(29, 78, 216, 0.12)' }]}>
                <Ionicons
                  name={isActive ? item.icon : `${item.icon}-outline` as any}
                  size={22}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
              </View>
              <Text style={[styles.navLabel, { color: colors.textSecondary }, isActive && { color: colors.primary, fontWeight: '600' }]}>
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 16,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 60,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 32,
    borderRadius: 16,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

