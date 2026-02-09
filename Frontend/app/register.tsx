import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRegister } from '@/lib/hooks';
import { useAuth } from '@/lib/auth-context';
import { UserRole } from '@/lib/types';
import { useTheme } from '@/lib/theme-context';

const ROLES: { value: UserRole; label: string; icon: string }[] = [
    { value: 'student', label: 'Student', icon: 'school' },
    { value: 'parent', label: 'Parent', icon: 'people' },
    { value: 'guard', label: 'Guard', icon: 'shield-checkmark' },
    { value: 'warden', label: 'Warden', icon: 'shield' },
    { value: 'mess_staff', label: 'Mess Staff', icon: 'restaurant' },
];

export default function RegisterPage() {
    const { colors, isDark } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollNo, setRollNo] = useState('');
    const [room, setRoom] = useState('');
    const [hostel, setHostel] = useState('');
    const [phone, setPhone] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [role, setRole] = useState<UserRole>('student');
    const [showPassword, setShowPassword] = useState(false);

    const registerMutation = useRegister();
    const { signIn } = useAuth();

    const isStudent = role === 'student';
    const isParent = role === 'parent';

    const handleRegister = () => {
        if (!name || !email || !password || !phone) {
            return;
        }
        if (!isParent && (!rollNo || !room || !hostel)) {
            return;
        }

        registerMutation.mutate(
            {
                name,
                email,
                password,
                rollNo: isParent ? 'PARENT' : rollNo,
                room: isParent ? 'N/A' : room,
                hostel: isParent ? 'N/A' : hostel,
                phone,
                role,
                parentEmail: !isParent && parentEmail ? parentEmail : undefined,
            },
            {
                onSuccess: (data) => {
                    if (data?.token) {
                        signIn(data.token);
                    }
                    router.replace('/');
                },
                onError: (error: any) => {
                    console.log('Register error:', error);
                },
            }
        );
    };

    return (
        <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Register for hostel services</Text>
                </View>

                <View style={styles.form}>
                    {registerMutation.isError && (
                        <View style={[styles.errorBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
                            <Ionicons name="alert-circle" size={20} color={isDark ? '#fca5a5' : '#ef4444'} />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                                    {(() => {
                                        const error: any = registerMutation.error;
                                        const errorData = error?.response?.data;
                                        if (errorData?.errors && Array.isArray(errorData.errors)) {
                                            return errorData.errors.map((err: any, idx: number) => {
                                                const field = err.field?.replace('body.', '') || 'Field';
                                                const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
                                                return `${idx + 1}. ${capitalizedField}: ${err.message}`;
                                            }).join('\n');
                                        }
                                        return errorData?.message || error?.message || 'Registration failed. Please try again.';
                                    })()}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Role Selector */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Role (For Testing)</Text>
                        <View style={styles.roleContainer}>
                            {ROLES.map((r) => (
                                <Pressable
                                    key={r.value}
                                    style={[
                                        styles.roleButton,
                                        { backgroundColor: colors.card, borderColor: colors.border },
                                        role === r.value && { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(29, 78, 216, 0.2)' : '#eff6ff' },
                                    ]}
                                    onPress={() => setRole(r.value)}
                                >
                                    <Ionicons
                                        name={r.icon as any}
                                        size={20}
                                        color={role === r.value ? colors.primary : colors.textSecondary}
                                    />
                                    <Text
                                        style={[
                                            styles.roleText,
                                            { color: colors.textSecondary },
                                            role === r.value && { color: colors.primary },
                                        ]}
                                    >
                                        {r.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder="Enter your full name" placeholderTextColor={colors.textTertiary} value={name} onChangeText={setName} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder="Enter your email" placeholderTextColor={colors.textTertiary} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <View style={[styles.passwordContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TextInput style={[styles.passwordInput, { color: colors.text }]} placeholder="Create password" placeholderTextColor={colors.textTertiary} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                            </Pressable>
                        </View>
                    </View>

                    {!isParent && (
                        <>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={[styles.label, { color: colors.text }]}>{isStudent ? 'Roll No' : 'Employee ID'}</Text>
                                    <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder={isStudent ? 'BT2401' : 'EMP001'} placeholderTextColor={colors.textTertiary} value={rollNo} onChangeText={setRollNo} />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                    <Text style={[styles.label, { color: colors.text }]}>Room</Text>
                                    <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder="A-106" placeholderTextColor={colors.textTertiary} value={room} onChangeText={setRoom} />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Hostel</Text>
                                <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder="Enter hostel name" placeholderTextColor={colors.textTertiary} value={hostel} onChangeText={setHostel} />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Parent's Email (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                    placeholder="parent@email.com"
                                    placeholderTextColor={colors.textTertiary}
                                    value={parentEmail}
                                    onChangeText={setParentEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                                    If your parent is registered, you'll be auto-linked
                                </Text>
                            </View>
                        </>
                    )}

                    {isParent && (
                        <View style={[styles.parentHint, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                            <Ionicons name="information-circle" size={20} color={isDark ? '#fbbf24' : '#b45309'} />
                            <Text style={[styles.parentHintText, { color: isDark ? '#fcd34d' : '#92400e' }]}>
                                After registration, ask the admin to link you with your child's account.
                            </Text>
                        </View>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
                        <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]} placeholder="+91 98765 43210" placeholderTextColor={colors.textTertiary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                    </View>

                    <Pressable
                        style={[styles.registerButton, { backgroundColor: colors.primary }, registerMutation.isPending && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.registerButtonText}>Create Account</Text>
                        )}
                    </Pressable>

                    <View style={styles.loginLink}>
                        <Text style={[styles.loginText, { color: colors.textSecondary }]}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <Pressable>
                                <Text style={[styles.loginLinkText, { color: colors.primary }]}>Sign In</Text>
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
    scrollContent: { flexGrow: 1, padding: 24 },
    header: { marginBottom: 24 },
    backButton: { marginBottom: 16 },
    title: { fontSize: 28, fontWeight: '700' },
    subtitle: { fontSize: 16, marginTop: 4 },
    form: { gap: 16 },
    errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1 },
    errorText: { flex: 1 },
    inputGroup: { gap: 6 },
    label: { fontSize: 14, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    helperText: { fontSize: 12, marginTop: 4 },
    row: { flexDirection: 'row' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    passwordInput: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    eyeIcon: { paddingRight: 16 },
    roleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    roleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 12, borderWidth: 2, minWidth: '30%' },
    roleText: { fontSize: 12, fontWeight: '600' },
    registerButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    registerButtonDisabled: { opacity: 0.7 },
    registerButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
    loginLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
    loginText: {},
    loginLinkText: { fontWeight: '600' },
    parentHint: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, marginTop: 4 },
    parentHintText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
