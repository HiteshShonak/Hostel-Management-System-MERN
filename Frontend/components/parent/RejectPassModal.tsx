import React from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Modal,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/lib/contexts/theme';

interface RejectPassModalProps {
    visible: boolean;
    reason: string;
    onChangeReason: (text: string) => void;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
}

export function RejectPassModal({
    visible,
    reason,
    onChangeReason,
    onClose,
    onConfirm,
    isPending,
}: RejectPassModalProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <Text style={[styles.modalTitle, { color: colors.text }]}>Reject Gate Pass</Text>
                            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                                Please provide a reason (optional)
                            </Text>
                            <TextInput
                                style={[styles.reasonInput, { backgroundColor: colors.background, color: colors.text }]}
                                placeholder="Reason for rejection..."
                                placeholderTextColor={colors.textTertiary}
                                value={reason}
                                onChangeText={onChangeReason}
                                multiline
                                numberOfLines={3}
                            />
                            <View style={styles.modalButtons}>
                                <Pressable style={[styles.cancelBtn, { backgroundColor: colors.background }]} onPress={onClose}>
                                    <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
                                </Pressable>
                                <Pressable style={styles.confirmRejectBtn} onPress={onConfirm} disabled={isPending}>
                                    {isPending ? (
                                        <ActivityIndicator size="small" color="white" />
                                    ) : (
                                        <Text style={styles.confirmRejectText}>Reject</Text>
                                    )}
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    scrollContainer: { flexGrow: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
    modalSubtitle: { fontSize: 14, marginBottom: 16 },
    reasonInput: { borderRadius: 12, padding: 12, minHeight: 80, textAlignVertical: 'top', fontSize: 14, marginBottom: 16 },
    modalButtons: { flexDirection: 'row', gap: 12 },
    cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
    cancelBtnText: { fontSize: 14, fontWeight: '600' },
    confirmRejectBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, backgroundColor: '#dc2626', alignItems: 'center' },
    confirmRejectText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
