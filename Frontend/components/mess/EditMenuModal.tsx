import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, TextInput, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { MealType, DayType } from '@/lib/types';

interface EditMenuModalProps {
    visible: boolean;
    selectedMeal: MealType;
    selectedDay: DayType;
    editItems: string;
    isPending: boolean;
    onChangeText: (text: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export function EditMenuModal({
    visible,
    selectedMeal,
    selectedDay,
    editItems,
    isPending,
    onChangeText,
    onClose,
    onSave,
}: EditMenuModalProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
                    >
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: colors.text }]}>
                                    Edit {selectedMeal} - {selectedDay}
                                </Text>
                                <Pressable onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </Pressable>
                            </View>
                            <Text style={[styles.modalHint, { color: colors.textSecondary }]}>Enter one item per line</Text>
                            <TextInput
                                style={[
                                    styles.editInput,
                                    { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }
                                ]}
                                multiline
                                numberOfLines={8}
                                value={editItems}
                                onChangeText={onChangeText}
                                placeholder="Poha\nTea\nBread"
                                placeholderTextColor={colors.textTertiary}
                            />
                            <Pressable
                                style={[styles.saveBtn, { backgroundColor: colors.success }, isPending && styles.btnDisabled]}
                                onPress={onSave}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Save Menu</Text>
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
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    modalTitle: { fontSize: 18, fontWeight: '600' },
    modalHint: { fontSize: 13, marginBottom: 12 },
    editInput: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16, height: 200, textAlignVertical: 'top' },
    saveBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
    btnDisabled: { opacity: 0.7 },
    saveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
