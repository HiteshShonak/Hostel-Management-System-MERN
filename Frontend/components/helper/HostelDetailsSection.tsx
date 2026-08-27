import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';

interface HostelDetailsSectionProps {
    isStudent: boolean;
    rollNo: string;
    onChangeRollNo: (text: string) => void;
    room: string;
    onChangeRoom: (text: string) => void;
    hostel: string;
    onChangeHostel: (text: string) => void;
    year: number;
    onChangeYear: (year: number) => void;
    parentEmail: string;
    onChangeParentEmail: (text: string) => void;
}

export function HostelDetailsSection({
    isStudent,
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
}: HostelDetailsSectionProps) {
    const { colors, isDark } = useTheme();

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Hostel Details</Text>

            <View style={styles.row}>
                <View style={[styles.field, { flex: 1 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>
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
                <View style={[styles.field, { flex: 1, marginLeft: 10 }]}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Room</Text>
                    <TextInput
                        style={[styles.input, { color: colors.text, backgroundColor: colors.card, borderColor: colors.border }]}
                        placeholder="A-106"
                        placeholderTextColor={colors.textTertiary}
                        value={room}
                        onChangeText={onChangeRoom}
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
                    onChangeText={onChangeHostel}
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
                                    year === y && {
                                        borderColor: colors.primary,
                                        backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : '#eff6ff',
                                    },
                                ]}
                                onPress={() => onChangeYear(y)}
                            >
                                <Text
                                    style={[
                                        styles.yearBtnNum,
                                        { color: year === y ? colors.primary : colors.text },
                                        year === y && { fontWeight: '700' },
                                    ]}
                                >
                                    {y === 1 ? '1st' : y === 2 ? '2nd' : y === 3 ? '3rd' : '4th'}
                                </Text>
                                <Text
                                    style={[
                                        styles.yearBtnSub,
                                        { color: year === y ? colors.primary : colors.textTertiary },
                                    ]}
                                >
                                    Year
                                </Text>
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
                    onChangeText={onChangeParentEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={[styles.hint, { color: colors.textTertiary }]}>
                    Will auto-link student to parent if account exists
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 14 },
    sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
    row: { flexDirection: 'row' },
    field: { gap: 6 },
    label: { fontSize: 13, fontWeight: '500' },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    requiredBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
    requiredText: { fontSize: 11, fontWeight: '600' },
    input: { borderWidth: 1, borderRadius: 12, paddingVertical: 13, paddingHorizontal: 16, fontSize: 15 },
    hint: { fontSize: 12 },
    yearRow: { flexDirection: 'row', gap: 8 },
    yearBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 2 },
    yearBtnNum: { fontSize: 16, fontWeight: '600' },
    yearBtnSub: { fontSize: 11, marginTop: 2 },
});
