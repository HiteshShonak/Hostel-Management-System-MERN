import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    TextInput,
    Switch,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface CreateNoticeModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    onChangeTitle: (text: string) => void;
    description: string;
    onChangeDescription: (text: string) => void;
    urgent: boolean;
    onToggleUrgent: (value: boolean) => void;
    onSubmit: () => void;
    isPending: boolean;
}

export function CreateNoticeModal({
    visible,
    onClose,
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    urgent,
    onToggleUrgent,
    onSubmit,
    isPending,
}: CreateNoticeModalProps) {
    const { colors, isDark } = useTheme();

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
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Issue Notice</Text>
                                <Pressable onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="Notice title"
                                    placeholderTextColor={colors.textTertiary}
                                    value={title}
                                    onChangeText={onChangeTitle}
                                />
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Min 5 characters</Text>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.textArea,
                                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text },
                                    ]}
                                    placeholder="Notice details..."
                                    placeholderTextColor={colors.textTertiary}
                                    value={description}
                                    onChangeText={onChangeDescription}
                                    multiline
                                    numberOfLines={4}
                                />
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Min 10 characters</Text>
                            </View>

                            <View style={styles.switchRow}>
                                <Text style={[styles.switchLabel, { color: colors.text }]}>Mark as Urgent</Text>
                                <Switch
                                    value={urgent}
                                    onValueChange={onToggleUrgent}
                                    trackColor={{ false: colors.cardBorder, true: isDark ? '#be123c' : '#fecaca' }}
                                    thumbColor={urgent ? (isDark ? '#fb7185' : '#dc2626') : isDark ? '#737373' : '#f4f4f4'}
                                />
                            </View>

                            <Pressable
                                style={[styles.submitBtn, { backgroundColor: colors.primary }, isPending && styles.btnDisabled]}
                                onPress={onSubmit}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Publish Notice</Text>
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
    textArea: { height: 100, textAlignVertical: 'top' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    switchLabel: { fontSize: 16 },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center' },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
