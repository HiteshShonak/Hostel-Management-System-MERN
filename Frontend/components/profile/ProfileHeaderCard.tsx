import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { useTheme } from '@/lib/contexts/theme';
import { User } from '@/lib/types';

interface ProfileHeaderCardProps {
    user: User;
}

/**
 * Avatar, user name, and role badge header for Profile screen.
 */
export function ProfileHeaderCard({ user }: ProfileHeaderCardProps) {
    const { colors } = useTheme();

    const initials = user.name
        ? user.name.split(' ').map((n) => n[0]).join('')
        : 'U';

    const roleName = user.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1).replace('_', ' ')
        : 'User';

    return (
        <View style={styles.profileHeader}>
            <Avatar style={styles.avatar}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                    <Text style={styles.initials}>{initials}</Text>
                </AvatarFallback>
            </Avatar>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.userRole, { color: colors.primary }]}>{roleName}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 4,
        borderColor: 'rgba(29, 78, 216, 0.2)',
    },
    avatarFallback: {},
    initials: {
        color: 'white',
        fontSize: 24,
        fontWeight: '600',
    },
    userName: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: '600',
    },
    userRole: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
});
