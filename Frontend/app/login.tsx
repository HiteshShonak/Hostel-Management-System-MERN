import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLogin } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { getErrorMessage } from '@/lib/error-utils';
import { useTheme } from '@/lib/theme-context';

export default function LoginPage() {
    const { colors, isDark } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const loginMutation = useLogin();
    const { signIn } = useAuth();

    const handleLogin = () => {
        if (!email || !password) {
            return;
        }
        loginMutation.mutate(
            { email, password },
            {
                onSuccess: (data) => {
                    if (data?.token) {
                        signIn(data.token);
                    }
                    router.replace('/');
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={[styles.logoContainer, { backgroundColor: isDark ? 'rgba(29, 78, 216, 0.2)' : 'rgba(29, 78, 216, 0.1)' }]}>
                        <Ionicons name="home" size={48} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Sign in to your hostel account</Text>
                </View>

                <View style={styles.form}>
                    {loginMutation.isError && (
                        <View style={[styles.errorBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
                            <Ionicons name="alert-circle" size={20} color={isDark ? '#fca5a5' : '#ef4444'} />
                            <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>{getErrorMessage(loginMutation.error)}</Text>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter your email"
                                placeholderTextColor={colors.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                placeholder="Enter your password"
                                placeholderTextColor={colors.textTertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                            </Pressable>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.loginButton, { backgroundColor: colors.primary }, loginMutation.isPending && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        )}
                    </Pressable>

                    <View style={styles.registerLink}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <Pressable>
                                <Text style={[styles.registerLinkText, { color: colors.primary }]}>Register</Text>
                            </Pressable>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    logoContainer: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { fontSize: 16, marginTop: 4 },
    form: { gap: 20 },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
    errorText: { flex: 1 },
    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '500' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    inputIcon: { paddingLeft: 16 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 12, fontSize: 16 },
    eyeIcon: { paddingRight: 16 },
    loginButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
    loginButtonDisabled: { opacity: 0.7 },
    loginButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    registerLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    registerText: {},
    registerLinkText: { fontWeight: '600' },
});
