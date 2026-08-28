import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { AcademicYearPicker } from '@/components/forms';

interface RegisterResidentFieldsProps {
    isStudent: boolean;
    isParent: boolean;
    rollNo: string;
    onChangeRollNo: (val: string) => void;
    room: string;
    onChangeRoom: (val: string) => void;
    hostel: string;
    onChangeHostel: (val: string) => void;
    year: number;
    onChangeYear: (val: number) => void;
    parentEmail: string;
    onChangeParentEmail: (val: string) => void;
}

/**
 * Resident and role-specific conditional inputs for the registration flow.
 */
export function RegisterResidentFields({
    isStudent,
    isParent,
    rollNo,
    onChangeRollNo,
    room,
    onChangeRoom,
    hostel,
    onChangeHostel,
    year,
    onChangeYear,
    parentEmail,
    onChangeParentEmail,
}: RegisterResidentFieldsProps) {
    const { colors, isDark } = useTheme();

    if (isParent) {
        return (
            <View style={[styles.parentHint, { backgroundColor: isDark ? '#422006' : '#fef3c7' }]}>
                <Ionicons name="information-circle" size={20} color={isDark ? '#fbbf24' : '#b45309'} />
                <Text style={[styles.parentHintText, { color: isDark ? '#fcd34d' : '#92400e' }]}>
                    After registration, ask the admin to link you with your child's account.
                </Text>
            </View>
        );
    }

    return (
        <>
            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.text }]}>
                        {isStudent ? 'Roll No' : 'Employee ID'}
                    </Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                        placeholder={isStudent ? 'BT2401' : 'EMP001'}
                        placeholderTextColor={colors.textTertiary}
                        value={rollNo}
                        onChangeText={onChangeRollNo}
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                    <Text style={[styles.label, { color: colors.text }]}>Room</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                        placeholder="A-106"
                        placeholderTextColor={colors.textTertiary}
                        value={room}
                        onChangeText={onChangeRoom}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Hostel</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                    placeholder="Enter hostel name"
                    placeholderTextColor={colors.textTertiary}
                    value={hostel}
                    onChangeText={onChangeHostel}
                />
            </View>

            {isStudent && (
                <AcademicYearPicker
                    selectedYear={year}
                    onSelectYear={onChangeYear}
                />
            )}

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>Parent's Email (Optional)</Text>
                <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                    placeholder="parent@email.com"
                    placeholderTextColor={colors.textTertiary}
                    value={parentEmail}
                    onChangeText={onChangeParentEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                    If your parent is registered, you'll be auto-linked
                </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    row: { flexDirection: 'row' },
    inputGroup: { gap: 6 },
    label: { fontSize: 14, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
    helperText: { fontSize: 12, marginTop: 4 },
    parentHint: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 12, marginTop: 4 },
    parentHintText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
