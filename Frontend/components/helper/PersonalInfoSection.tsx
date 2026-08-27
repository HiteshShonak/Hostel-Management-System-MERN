import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface PersonalInfoSectionProps {
    name: string;
    onChangeName: (text: string) => void;
    email: string;
    onChangeEmail: (text: string) => void;
    phone: string;
    onChangePhone: (text: string) => void;
    password: string;
    onChangePassword: (text: string) => void;
    showPassword: boolean;
    onToggleShowPassword: () => void;
}

export function PersonalInfoSection({
    name,
    onChangeName,
    email,
    onChangeEmail,
    phone,
    onChangePhone,
    password,
    onChangePassword,
    showPassword,
    onToggleShowPassword,
}: PersonalInfoSectionProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Info</Text>

            <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                    placeholder="Enter full name"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={onChangeName}
                />
            </View>

            <View style={styles.field}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Email Address</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                    placeholder="user@email.com"
                    placeholderTextColor={colors.textTertiary}
                    value={email}
                    onChangeText={onChangeEmail}
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
                    onChangeText={onChangePhone}
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
                        onChangeText={onChangePassword}
                        secureTextEntry={!showPassword}
                    />
                    <Pressable onPress={onToggleShowPassword} style={styles.eyeBtn}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={colors.textSecondary}
                        />
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 14 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12 },
    passwordInput: { flex: 1, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    eyeBtn: { paddingRight: 14 },
});
