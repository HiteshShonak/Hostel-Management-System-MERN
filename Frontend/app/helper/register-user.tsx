import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageHeader } from '@/components/ui/PageHeader';
import { useTheme } from '@/lib/contexts/theme';
import {
    useRegisterUserController,
    RegistrationSuccessCard,
    AccountTypeSection,
    PersonalInfoSection,
    HostelDetailsSection,
} from '@/components/helper';

export default function HelperRegisterUserScreen() {
    const { colors, isDark } = useTheme();
    const {
        role,
        setRole,
        name,
        setName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        rollNo,
        setRollNo,
        room,
        setRoom,
        hostel,
        setHostel,
        phone,
        setPhone,
        year,
        setYear,
        parentEmail,
        setParentEmail,
        successCard,
        mutation,
        isStudent,
        isParent,
        selectedRole,
        reset,
        handleSubmit,
    } = useRegisterUserController();

    if (successCard) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Register User" showBack />
                <ScrollView
                    contentContainerStyle={styles.successContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <RegistrationSuccessCard data={successCard} onRegisterAnother={reset} />
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <PageHeader title="Register User" showBack />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
                    {/* Error banner */}
                    {mutation.isError && (
                        <View style={[styles.errorBox, { backgroundColor: isDark ? '#450a0a' : '#fef2f2', borderColor: isDark ? '#7f1d1d' : '#fecaca' }]}>
                            <Ionicons name="alert-circle" size={18} color="#ef4444" />
                            <Text style={[styles.errorText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                                {(() => {
                                    const error: any = mutation.error;
                                    const d = error?.response?.data;
                                    if (d?.errors?.length) {
                                        return d.errors.map((e: any, i: number) => `${i + 1}. ${e.field?.replace('body.', '')}: ${e.message}`).join('\n');
                                    }
                                    return d?.message || error?.message || 'Registration failed.';
                                })()}
                            </Text>
                        </View>
                    )}

                    {/* Role Picker */}
                    <AccountTypeSection role={role} onSelectRole={setRole} />

                    {/* Personal Info */}
                    <PersonalInfoSection
                        name={name}
                        onChangeName={setName}
                        email={email}
                        onChangeEmail={setEmail}
                        phone={phone}
                        onChangePhone={setPhone}
                        password={password}
                        onChangePassword={setPassword}
                        showPassword={showPassword}
                        onToggleShowPassword={() => setShowPassword(!showPassword)}
                    />

                    {/* Hostel Info — hidden for parent */}
                    {!isParent && (
                        <HostelDetailsSection
                            isStudent={isStudent}
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
                    )}

                    {/* Submit */}
                    <Pressable
                        style={[styles.submitBtn, { backgroundColor: selectedRole.color }, mutation.isPending && { opacity: 0.7 }]}
                        onPress={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="person-add" size={20} color="white" />
                                <Text style={styles.submitBtnText}>Create {selectedRole.label} Account</Text>
                            </>
                        )}
                    </Pressable>

                    <View style={{ height: 32 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { padding: 20, gap: 20 },
    errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 14, borderWidth: 1 },
    errorText: { flex: 1, fontSize: 13, lineHeight: 18 },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14, marginTop: 4 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
    successContainer: { padding: 24 },
});
