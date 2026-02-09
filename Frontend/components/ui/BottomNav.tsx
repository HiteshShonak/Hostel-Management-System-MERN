import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { PRIMARY_COLOR } from '@/lib/constants';

const studentNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'qr-code', label: 'Gate Pass', href: '/gate-pass' },
  { icon: 'restaurant', label: 'Mess', href: '/mess-menu' },
  { icon: 'notifications', label: 'Notices', href: '/notices' },
  { icon: 'person', label: 'Profile', href: '/profile' },
] as const;

const wardenNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'scan', label: 'Scanner', href: '/qr-scanner' },
  { icon: 'checkmark-done', label: 'Passes', href: '/gate-pass' },
  { icon: 'notifications', label: 'Notices', href: '/notices' },
  { icon: 'person', label: 'Profile', href: '/profile' },
] as const;

const messStaffNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'restaurant', label: 'Menu', href: '/mess-menu' },
  { icon: 'star', label: 'Ratings', href: '/mess-menu' },
  { icon: 'notifications', label: 'Notices', href: '/notices' },
  { icon: 'person', label: 'Profile', href: '/profile' },
] as const;

const guardNavItems = [
  { icon: 'home', label: 'Home', href: '/' },
  { icon: 'scan', label: 'Scanner', href: '/qr-scanner' },
  { icon: 'notifications', label: 'Notices', href: '/notices' },
  { icon: 'person', label: 'Profile', href: '/profile' },
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
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingHorizontal: 4,
    paddingTop: 8,
    paddingBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
  iconContainerActive: {
    backgroundColor: 'rgba(29, 78, 216, 0.12)',
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  navLabelActive: {
    color: PRIMARY_COLOR,
    fontWeight: '600',
  },
});

