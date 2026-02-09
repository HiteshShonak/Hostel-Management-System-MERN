import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ViewStyle, TextStyle } from 'react-native';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';

interface ButtonProps extends TouchableOpacityProps {
    variant?: ButtonVariant;
    children: React.ReactNode;
}

export function Button({ variant = 'default', children, style, disabled, ...props }: ButtonProps) {
    const buttonStyle = [
        styles.button,
        variantStyles[variant],
        disabled && styles.disabled,
        style,
    ];

    return (
        <TouchableOpacity style={buttonStyle} disabled={disabled} activeOpacity={0.7} {...props}>
            {typeof children === 'string' ? (
                <Text style={[styles.text, textVariantStyles[variant]]}>{children}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
    disabled: {
        opacity: 0.5,
    },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = StyleSheet.create({
    default: { backgroundColor: '#1d4ed8' },
    destructive: { backgroundColor: '#ef4444' },
    outline: { backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e5e5e5' },
    secondary: { backgroundColor: '#f5f5f5' },
    ghost: { backgroundColor: 'transparent' },
});

const textVariantStyles: Record<ButtonVariant, TextStyle> = StyleSheet.create({
    default: { color: '#ffffff' },
    destructive: { color: '#ffffff' },
    outline: { color: '#0a0a0a' },
    secondary: { color: '#171717' },
    ghost: { color: '#0a0a0a' },
});
