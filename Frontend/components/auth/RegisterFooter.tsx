import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

interface RegisterFooterProps {
    isPending: boolean;
    onSubmit: () => void;
}

/**
 * Registration form submission button and Sign In navigation link.
 */
export function RegisterFooter({ isPending, onSubmit }: RegisterFooterProps) {
    const { colors } = useTheme();

    return (
        <>
            <Pressable
                style={[
                    styles.registerButton,
                    { backgroundColor: colors.primary },
                    isPending && styles.registerButtonDisabled,
                ]}
                onPress={onSubmit}
                disabled={isPending}
            >
                {isPending ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.registerButtonText}>Create Account</Text>
                )}
            </Pressable>

            <View style={styles.loginLink}>
                <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                    Already have an account?{' '}
                </Text>
                <Link href="/login" asChild>
                    <Pressable>
                        <Text style={[styles.loginLinkText, { color: colors.primary }]}>Sign In</Text>
                    </Pressable>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    registerButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    loginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    loginText: {
        fontSize: 14,
    },
    loginLinkText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
