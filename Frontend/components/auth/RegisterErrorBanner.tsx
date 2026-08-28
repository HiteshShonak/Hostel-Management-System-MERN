import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface RegisterErrorBannerProps {
    error: any;
}

/**
 * Server error banner displayed on failed registration attempt.
 * Parses validation error lists or returns standard error message.
 */
export function RegisterErrorBanner({ error }: RegisterErrorBannerProps) {
    const { isDark } = useTheme();

    if (!error) return null;

    const errorData = error?.response?.data;
    let errorMessage = 'Registration failed. Please try again.';

    if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorMessage = errorData.errors
            .map((err: any, idx: number) => {
                const field = err.field?.replace('body.', '') || 'Field';
                const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
                return `${idx + 1}. ${capitalizedField}: ${err.message}`;
            })
            .join('\n');
    } else if (errorData?.message) {
        errorMessage = errorData.message;
    } else if (error?.message) {
        errorMessage = error.message;
    }

    return (
        <View
            style={[
                styles.errorBox,
                {
                    backgroundColor: isDark ? '#450a0a' : '#fef2f2',
                    borderColor: isDark ? '#7f1d1d' : '#fecaca',
                },
            ]}
        >
            <Ionicons name="alert-circle" size={20} color={isDark ? '#fca5a5' : '#ef4444'} />
            <View style={styles.textWrapper}>
                <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                    {errorMessage}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    textWrapper: {
        flex: 1,
    },
    errorText: {
        fontSize: 13,
        lineHeight: 18,
    },
});
