import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    style?: ViewStyle;
}

export function Badge({ children, variant = 'default', style }: BadgeProps) {
    return (
        <View style={[styles.badge, variantStyles[variant], style]}>
            {typeof children === 'string' ? (
                <Text style={[styles.text, textVariantStyles[variant]]}>{children}</Text>
            ) : (
                children
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 9999,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '500',
    },
});

const variantStyles: Record<BadgeVariant, ViewStyle> = StyleSheet.create({
    default: { backgroundColor: '#1d4ed8' },
    secondary: { backgroundColor: '#f5f5f5' },
    destructive: { backgroundColor: '#ef4444' },
    outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#e5e5e5' },
    success: { backgroundColor: '#16a34a' },
    warning: { backgroundColor: '#f59e0b' },
});

const textVariantStyles: Record<BadgeVariant, any> = StyleSheet.create({
    default: { color: '#ffffff' },
    secondary: { color: '#171717' },
    destructive: { color: '#ffffff' },
    outline: { color: '#0a0a0a' },
    success: { color: '#ffffff' },
    warning: { color: '#ffffff' },
});
