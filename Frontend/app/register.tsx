import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { RoleSelectGrid, PasswordInput } from '@/components/forms';
import {
    useRegisterController,
    RegisterErrorBanner,
    RegisterResidentFields,
    RegisterFooter,
} from '@/components/auth';

export default function RegisterPage() {
    const { colors } = useTheme();
    const {
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        rollNo,
        setRollNo,
        room,
        setRoom,
        hostel,
        setHostel,
        phone,
        setPhone,
        parentEmail,
        setParentEmail,
        role,
        setRole,
        year,
        setYear,
        isStudent,
        isParent,
        registerMutation,
        handleRegister,
    } = useRegisterController();

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable
                        onPress={() => router.canGoBack() ? router.back() : router.replace('/login')}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color={colors.text} />
                    </Pressable>
                    <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Register for hostel services</Text>
                </View>

                <View style={styles.form}>
                    <RegisterErrorBanner error={registerMutation.error} />

                    {/* Role Selector */}
                    <RoleSelectGrid
                        selectedRole={role}
                        onSelectRole={setRole}
                        label="Role (For Testing)"
                    />

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                            placeholder="Enter your full name"
                            placeholderTextColor={colors.textTertiary}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                            placeholder="Enter your email"
                            placeholderTextColor={colors.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
                        <PasswordInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create password"
                        />
                    </View>

                    <RegisterResidentFields
                        isStudent={isStudent}
                        isParent={isParent}
                        rollNo={rollNo}
                        onChangeRollNo={setRollNo}
                        room={room}
                        onChangeRoom={setRoom}
                        hostel={hostel}
                        onChangeHostel={setHostel}
                        year={year}
                        onChangeYear={setYear}
                        parentEmail={parentEmail}
                        onChangeParentEmail={setParentEmail}
                    />

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                            placeholder="+91 98765 43210"
                            placeholderTextColor={colors.textTertiary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <RegisterFooter
                        isPending={registerMutation.isPending}
                        onSubmit={handleRegister}
                    />
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
    inputGroup: { gap: 6 },
    label: { fontSize: 14, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
});
