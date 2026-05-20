import React, { useState } from 'react';
import {
    View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator,
    KeyboardAvoidingView, Platform, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useHelperRegisterUser } from '@/lib/hooks';
import { useTheme } from '@/lib/theme-context';
import { PageHeader } from '@/components/ui/PageHeader';

const ALL_ROLES = [
    { value: 'student', label: 'Student', icon: 'school-outline', color: '#6366f1' },
    { value: 'parent', label: 'Parent', icon: 'people-outline', color: '#f59e0b' },
    { value: 'warden', label: 'Warden', icon: 'shield-outline', color: '#10b981' },
    { value: 'guard', label: 'Guard', icon: 'shield-checkmark-outline', color: '#3b82f6' },
    { value: 'mess_staff', label: 'Mess Staff', icon: 'restaurant-outline', color: '#ef4444' },
    { value: 'helper', label: 'Helper', icon: 'person-add-outline', color: '#8b5cf6' },
    { value: 'admin', label: 'Admin', icon: 'settings-outline', color: '#64748b' },
] as const;

type RoleValue = typeof ALL_ROLES[number]['value'];

interface SuccessCard {
    name: string;
    email: string;
    role: string;
    rollNo: string;
    room: string;
    hostel: string;
}

export default function HelperRegisterUserScreen() {
    const { colors, isDark } = useTheme();
    const [role, setRole] = useState<RoleValue>('student');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rollNo, setRollNo] = useState('');
    const [room, setRoom] = useState('');
    const [hostel, setHostel] = useState('');
    const [phone, setPhone] = useState('');
    const [year, setYear] = useState<number>(1);
    const [parentEmail, setParentEmail] = useState('');
    const [successCard, setSuccessCard] = useState<SuccessCard | null>(null);

    const mutation = useHelperRegisterUser();
    const isStudent = role === 'student';
    const isParent = role === 'parent';
    const selectedRole = ALL_ROLES.find(r => r.value === role)!;

    const reset = () => {
        setName(''); setEmail(''); setPassword('');
        setRollNo(''); setRoom(''); setHostel('');
        setPhone(''); setYear(1); setParentEmail('');
        setSuccessCard(null);
    };

    const handleSubmit = () => {
        if (!name.trim() || !email.trim() || !password.trim() || !phone.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all required fields.');
            return;
        }
        if (!isParent && (!rollNo.trim() || !room.trim() || !hostel.trim())) {
            Alert.alert('Missing Fields', 'Please fill in Roll No, Room, and Hostel.');
            return;
        }
        if (isStudent && (!year || year < 1 || year > 4)) {
            Alert.alert('Missing Fields', 'Please select academic year for student.');
            return;
        }

        mutation.mutate(
            {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                rollNo: isParent ? 'PARENT' : rollNo.trim(),
                room: isParent ? 'N/A' : room.trim(),
                hostel: isParent ? 'N/A' : hostel.trim(),
                phone: phone.trim(),
                role,
                ...(isStudent ? { year } : {}),
                ...(parentEmail.trim() ? { parentEmail: parentEmail.trim().toLowerCase() } : {}),
            },
            {
                onSuccess: (data) => {
                    setSuccessCard({
                        name: data.name,
                        email: data.email,
                        role: data.role,
                        rollNo: data.rollNo,
                        room: data.room,
                        hostel: data.hostel,
                    });
                },
                onError: (error: any) => {
                    const msg = error?.response?.data?.message || error?.message || 'Registration failed.';
                    Alert.alert('Error', msg);
                },
            }
        );
    };

    if (successCard) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <PageHeader title="Register User" showBack />
                <ScrollView contentContainerStyle={styles.successContainer}>
                    <View style={[styles.successIcon, { backgroundColor: isDark ? '#052e16' : '#dcfce7' }]}>
                        <Ionicons name="checkmark-circle" size={56} color="#16a34a" />
                    </View>
                    <Text style={[styles.successTitle, { color: colors.text }]}>Account Created!</Text>
                    <Text style={[styles.successSub, { color: colors.textSecondary }]}>
                        The {successCard.role} account has been successfully created.
                    </Text>

                    <View style={[styles.successCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.successRow}>
                            <Ionicons name="person" size={16} color={colors.primary} />
                            <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Name</Text>
                            <Text style={[styles.successValue, { color: colors.text }]}>{successCard.name}</Text>
                        </View>
                        <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.successRow}>
                            <Ionicons name="mail" size={16} color={colors.primary} />
                            <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Email</Text>
                            <Text style={[styles.successValue, { color: colors.text }]}>{successCard.email}</Text>
                        </View>
                        <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.successRow}>
                            <Ionicons name="id-card" size={16} color={colors.primary} />
                            <Text style={[styles.successLabel, { color: colors.textSecondary }]}>ID</Text>
                            <Text style={[styles.successValue, { color: colors.text }]}>{successCard.rollNo}</Text>
                        </View>
                        <View style={[styles.successDivider, { backgroundColor: colors.border }]} />
                        <View style={styles.successRow}>
                            <Ionicons name="home" size={16} color={colors.primary} />
                            <Text style={[styles.successLabel, { color: colors.textSecondary }]}>Room</Text>
                            <Text style={[styles.successValue, { color: colors.text }]}>{successCard.room} — {successCard.hostel}</Text>
                        </View>
                    </View>

                    <Pressable
                        style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                        onPress={reset}
                    >
                        <Ionicons name="person-add" size={18} color="white" />
                        <Text style={styles.primaryBtnText}>Register Another User</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.secondaryBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Back to Dashboard</Text>
                    </Pressable>
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
                                    if (d?.errors?.length) return d.errors.map((e: any, i: number) => `${i + 1}. ${e.field?.replace('body.', '')}: ${e.message}`).join('\n');
                                    return d?.message || error?.message || 'Registration failed.';
                                })()}
                            </Text>
                        </View>
                    )}

                    {/* Role Picker */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Type</Text>
                        <View style={styles.roleGrid}>
                            {ALL_ROLES.map((r) => {
                                const isSelected = role === r.value;
                                return (
                                    <Pressable
                                        key={r.value}
                                        style={[
                                            styles.roleChip,
                                            { backgroundColor: colors.card, borderColor: colors.border },
                                            isSelected && { borderColor: r.color, backgroundColor: isDark ? `${r.color}22` : `${r.color}11` },
                                        ]}
                                        onPress={() => setRole(r.value)}
                                    >
                                        <Ionicons name={r.icon as any} size={18} color={isSelected ? r.color : colors.textSecondary} />
                                        <Text style={[styles.roleChipText, { color: isSelected ? r.color : colors.textSecondary }, isSelected && { fontWeight: '700' }]}>
                                            {r.label}
                                        </Text>
                                        {isSelected && <View style={[styles.roleChipDot, { backgroundColor: r.color }]} />}
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>

                    {/* Personal Info */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Info</Text>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                placeholder="Enter full name"
                                placeholderTextColor={colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                placeholder="user@email.com"
                                placeholderTextColor={colors.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone Number</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                placeholder="+91 98765 43210"
                                placeholderTextColor={colors.textTertiary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.field}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                            <View style={[styles.passwordRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                <TextInput
                                    style={[styles.passwordInput, { color: colors.text }]}
                                    placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                                    placeholderTextColor={colors.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
                                </Pressable>
                            </View>
                        </View>
                    </View>

                    {/* Hostel Info — hidden for parent */}
                    {!isParent && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hostel Details</Text>

                            <View style={styles.row}>
                                <View style={[styles.field, { flex: 1 }]}>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>{isStudent ? 'Roll No' : 'Employee ID'}</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                        placeholder={isStudent ? 'BT2401' : 'EMP001'}
                                        placeholderTextColor={colors.textTertiary}
                                        value={rollNo}
                                        onChangeText={setRollNo}
                                    />
                                </View>
                                <View style={[styles.field, { flex: 1, marginLeft: 10 }]}>
                                    <Text style={[styles.label, { color: colors.textSecondary }]}>Room</Text>
                                    <TextInput
                                        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                        placeholder="A-106"
                                        placeholderTextColor={colors.textTertiary}
                                        value={room}
                                        onChangeText={setRoom}
                                    />
                                </View>
                            </View>

                            <View style={styles.field}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Hostel Name</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                    placeholder="Enter hostel name"
                                    placeholderTextColor={colors.textTertiary}
                                    value={hostel}
                                    onChangeText={setHostel}
                                />
                            </View>

                            {/* Year picker for students */}
                            {isStudent && (
                                <View style={styles.field}>
                                    <View style={styles.labelRow}>
                                        <Text style={[styles.label, { color: colors.textSecondary }]}>Academic Year</Text>
                                        <View style={[styles.requiredBadge, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                                            <Text style={[styles.requiredText, { color: colors.primary }]}>Required</Text>
                                        </View>
                                    </View>
                                    <View style={styles.yearRow}>
                                        {[1, 2, 3, 4].map((y) => (
                                            <Pressable
                                                key={y}
                                                style={[
                                                    styles.yearBtn,
                                                    { backgroundColor: colors.card, borderColor: colors.border },
                                                    year === y && { borderColor: colors.primary, backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : '#eff6ff' },
                                                ]}
                                                onPress={() => setYear(y)}
                                            >
                                                <Text style={[styles.yearBtnNum, { color: year === y ? colors.primary : colors.text }, year === y && { fontWeight: '700' }]}>
                                                    {y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'}
                                                </Text>
                                                <Text style={[styles.yearBtnSub, { color: year === y ? colors.primary : colors.textTertiary }]}>Year</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {/* Parent email for students */}
                            <View style={styles.field}>
                                <Text style={[styles.label, { color: colors.textSecondary }]}>Parent Email (Optional)</Text>
                                <TextInput
                                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                                    placeholder="parent@email.com"
                                    placeholderTextColor={colors.textTertiary}
                                    value={parentEmail}
                                    onChangeText={setParentEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                                <Text style={[styles.hint, { color: colors.textTertiary }]}>
                                    Will auto-link student to parent if account exists
                                </Text>
                            </View>
                        </View>
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
    section: { gap: 14 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    roleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    roleChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 2, position: 'relative' },
    roleChipText: { fontSize: 13, fontWeight: '600' },
    roleChipDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 2 },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '500' },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    requiredBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    requiredText: { fontSize: 11, fontWeight: '600' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    hint: { fontSize: 12 },
    row: { flexDirection: 'row' },
    passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    passwordInput: { flex: 1, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    eyeBtn: { paddingRight: 14 },
    yearRow: { flexDirection: 'row', gap: 8 },
    yearBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 2 },
    yearBtnNum: { fontSize: 16, fontWeight: '600' },
    yearBtnSub: { fontSize: 11, marginTop: 2 },
    submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 14, marginTop: 4 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
    // Success screen
    successContainer: { padding: 24, alignItems: 'center', gap: 16 },
    successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginTop: 20 },
    successTitle: { fontSize: 26, fontWeight: '800', marginTop: 4 },
    successSub: { fontSize: 15, textAlign: 'center', lineHeight: 22 },
    successCard: { width: '100%', borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginTop: 8 },
    successRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    successLabel: { fontSize: 13, width: 48 },
    successValue: { flex: 1, fontSize: 14, fontWeight: '600' },
    successDivider: { height: 1, marginVertical: 2 },
    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', paddingVertical: 16, borderRadius: 14, marginTop: 8 },
    primaryBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
    secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 14, borderRadius: 14, borderWidth: 1 },
    secondaryBtnText: { fontSize: 15, fontWeight: '600' },
});
