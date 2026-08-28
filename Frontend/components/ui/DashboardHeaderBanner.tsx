import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

export interface DashboardHeaderBannerProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    accentText?: string;
    iconColor?: string;
    iconBg?: string;
    bgLight?: string;
    bgDark?: string;
    borderLight?: string;
    borderDark?: string;
    route?: string;
    onPress?: () => void;
    showChevron?: boolean;
}

/**
 * Universal Hero/Identity banner displayed at top of role dashboards (Admin, Helper, Parent, Guard).
 */
export function DashboardHeaderBanner({
    icon,
    title,
    subtitle,
    accentText,
    iconColor = '#7c3aed',
    iconBg,
    bgLight = '#f3e8ff',
    bgDark = '#3b0764',
    borderLight = '#e9d5ff',
    borderDark = '#6b21a8',
    route,
    onPress,
    showChevron = false,
}: DashboardHeaderBannerProps) {
    const { colors, isDark } = useTheme();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (route) {
            router.push(route as any);
        }
    };

    const ContainerComponent = onPress || route ? Pressable : View;

    return (
        <ContainerComponent
            style={[
                styles.banner,
                {
                    backgroundColor: isDark ? bgDark : bgLight,
                    borderColor: isDark ? borderDark : borderLight,
                },
            ]}
            onPress={onPress || route ? handlePress : undefined}
        >
            <View style={[styles.iconCircle, { backgroundColor: iconBg || colors.card }]}>
                <Ionicons name={icon} size={36} color={iconColor} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
                {accentText ? (
                    <Text style={[styles.accentText, { color: iconColor }]}>{accentText}</Text>
                ) : null}
            </View>
            {showChevron ? (
                <Ionicons name="chevron-forward" size={24} color={iconColor} />
            ) : null}
        </ContainerComponent>
    );
}

const styles = StyleSheet.create({
    banner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        marginBottom: 24,
        borderWidth: 2,
    },
    iconCircle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    subtitle: {
        fontSize: 13,
        marginTop: 3,
    },
    accentText: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
});
