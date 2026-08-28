import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Modal,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { COMPLAINT_CATEGORIES, ComplaintCategory } from './useComplaintsController';

interface LodgeComplaintModalProps {
    visible: boolean;
    onClose: () => void;
    category: ComplaintCategory;
    onChangeCategory: (cat: ComplaintCategory) => void;
    title: string;
    onChangeTitle: (text: string) => void;
    description: string;
    onChangeDescription: (text: string) => void;
    onSubmit: () => void;
    isPending: boolean;
}

export function LodgeComplaintModal({
    visible,
    onClose,
    category,
    onChangeCategory,
    title,
    onChangeTitle,
    description,
    onChangeDescription,
    onSubmit,
    isPending,
}: LodgeComplaintModalProps) {
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
                                <Text style={[styles.modalTitle, { color: colors.text }]}>Lodge Complaint</Text>
                                <Pressable onPress={onClose}>
                                    <Ionicons name="close" size={24} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Category</Text>
                                <View style={styles.categoryRow}>
                                    {COMPLAINT_CATEGORIES.map((cat) => (
                                        <Pressable
                                            key={cat}
                                            style={[
                                                styles.categoryBtn,
                                                { backgroundColor: category === cat ? colors.primary : isDark ? colors.background : '#f5f5f5' },
                                            ]}
                                            onPress={() => onChangeCategory(cat)}
                                        >
                                            <Text
                                                style={[
                                                    styles.categoryText,
                                                    { color: category === cat ? 'white' : colors.textSecondary },
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Title</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text }]}
                                    placeholder="Brief title"
                                    placeholderTextColor={colors.textTertiary}
                                    value={title}
                                    onChangeText={onChangeTitle}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: colors.text }]}>Description</Text>
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.textArea,
                                        { borderColor: colors.inputBorder, backgroundColor: colors.inputBackground, color: colors.text },
                                    ]}
                                    placeholder="Describe the issue in detail..."
                                    placeholderTextColor={colors.textTertiary}
                                    value={description}
                                    onChangeText={onChangeDescription}
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <Pressable
                                style={[styles.submitBtn, { backgroundColor: '#f59e0b' }, isPending && styles.btnDisabled]}
                                onPress={onSubmit}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.submitBtnText}>Submit Complaint</Text>
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
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: '600' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
    input: { borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 16 },
    textArea: { height: 100, textAlignVertical: 'top' },
    categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 9999 },
    categoryText: { fontSize: 14 },
    submitBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    submitBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
