import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    TextInput,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/lib/contexts/theme';
import { formatTime, formatDate } from '@/lib/utils';

interface ApplyGatePassModalProps {
    visible: boolean;
    onClose: () => void;
    reason: string;
    onChangeReason: (text: string) => void;
    fromDate: Date;
    toDate: Date;
    showPicker: boolean;
    mode: 'date' | 'time';
    activeField: 'from' | 'to';
    onShowPicker: (mode: 'date' | 'time', field: 'from' | 'to') => void;
    onChangePicker: (event: any, selectedDate?: Date) => void;
    onSubmit: () => void;
    isPending: boolean;
}

export function ApplyGatePassModal({
    visible,
    onClose,
    reason,
    onChangeReason,
    fromDate,
    toDate,
    showPicker,
    mode,
    activeField,
    onShowPicker,
    onChangePicker,
    onSubmit,
    isPending,
}: ApplyGatePassModalProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Apply Gate Pass</Text>
                                <Pressable onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Reason</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            minHeight: 60,
                                            borderColor: colors.inputBorder,
                                            backgroundColor: colors.inputBackground,
                                            color: colors.text,
                                        },
                                    ]}
                                    placeholder="e.g., Going home for weekend"
                                    placeholderTextColor={colors.textTertiary}
                                    value={reason}
                                    onChangeText={onChangeReason}
                                    multiline
                                />
                                <Text style={[styles.helperText, { color: colors.textSecondary }]}>Minimum 5 characters required</Text>
                            </View>

                            <View style={styles.row}>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.label, { color: colors.text }]}>From</Text>
                                    <Pressable
                                        style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                                        onPress={() => onShowPicker('date', 'from')}
                                    >
                                        <Text style={{ color: colors.text }}>{formatDate(fromDate)}</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.input, { marginTop: 8, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                                        onPress={() => onShowPicker('time', 'from')}
                                    >
                                        <Text style={{ color: colors.text }}>{formatTime(fromDate)}</Text>
                                    </Pressable>
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={[styles.label, { color: colors.text }]}>To</Text>
                                    <Pressable
                                        style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                                        onPress={() => onShowPicker('date', 'to')}
                                    >
                                        <Text style={{ color: colors.text }}>{formatDate(toDate)}</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.input, { marginTop: 8, borderColor: colors.inputBorder, backgroundColor: colors.inputBackground }]}
                                        onPress={() => onShowPicker('time', 'to')}
                                    >
                                        <Text style={{ color: colors.text }}>{formatTime(toDate)}</Text>
                                    </Pressable>
                                </View>
                            </View>

                            {showPicker && (
                                <DateTimePicker
                                    testID="dateTimePicker"
                                    value={activeField === 'from' ? fromDate : toDate}
                                    mode={mode}
                                    is24Hour={false}
                                    onChange={onChangePicker}
                                />
                            )}

                            <Pressable
                                style={[styles.submitBtn, { backgroundColor: colors.primary }, isPending && styles.btnDisabled]}
                                onPress={onSubmit}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Submit Request</Text>
                                )}
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    row: { flexDirection: 'row' },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
    helperText: { fontSize: 12, marginTop: 4 },
});
