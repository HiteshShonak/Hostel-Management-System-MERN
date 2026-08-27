import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { TimeScrollPicker } from '@/components/ui/TimeScrollPicker';
import type { MealType, MessTimings } from '@/lib/types';

interface EditTimingsModalProps {
    visible: boolean;
    selectedMeal: MealType;
    editTimings: MessTimings;
    isPending: boolean;
    onChangeTiming: (meal: MealType, field: 'start' | 'end', time: string) => void;
    onClose: () => void;
    onSave: () => void;
}

const MEAL_CONFIG: Record<MealType, { icon: string; color: string }> = {
    Breakfast: { icon: 'cafe', color: '#f59e0b' },
    Lunch: { icon: 'sunny', color: '#f97316' },
    Dinner: { icon: 'moon', color: '#6366f1' },
};

export function EditTimingsModal({
    visible,
    selectedMeal,
    editTimings,
    isPending,
    onChangeTiming,
    onClose,
    onSave,
}: EditTimingsModalProps) {
    const { colors, isDark } = useTheme();

    const getDuration = (startStr?: string, endStr?: string) => {
        if (!startStr || !endStr) return '';
        const [h1, m1] = startStr.split(':').map(Number);
        const [h2, m2] = endStr.split(':').map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60;
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
        if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
        return `${mins} mins`;
    };

    const mealConfig = MEAL_CONFIG[selectedMeal] || MEAL_CONFIG.Breakfast;
    const currentStart = editTimings[selectedMeal]?.start || '07:00';
    const currentEnd = editTimings[selectedMeal]?.end || '09:00';
    const duration = getDuration(currentStart, currentEnd);

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
                        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                            {/* Header */}
                            <View style={styles.modalHeader}>
                                <View style={styles.headerTitleRow}>
                                    <View style={[styles.headerIconCircle, { backgroundColor: isDark ? '#312e81' : '#e0e7ff' }]}>
                                        <Ionicons name={mealConfig.icon as any} size={20} color={mealConfig.color} />
                                    </View>
                                    <View>
                                        <Text style={[styles.modalTitle, { color: colors.text }]}>Edit {selectedMeal} Timings</Text>
                                        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>Set daily serving hours</Text>
                                    </View>
                                </View>
                                <Pressable onPress={onClose} hitSlop={8} style={styles.closeBtn}>
                                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                                </Pressable>
                            </View>

                            {/* Duration Banner */}
                            {duration ? (
                                <View style={[styles.durationBanner, { backgroundColor: isDark ? '#1e293b' : '#eff6ff', borderColor: isDark ? '#334155' : '#bfdbfe' }]}>
                                    <Ionicons name="timer" size={16} color="#6366f1" />
                                    <Text style={[styles.durationBannerText, { color: isDark ? '#93c5fd' : '#1d4ed8' }]}>
                                        {duration} serving window
                                    </Text>
                                </View>
                            ) : null}

                            {/* Start Time Section */}
                            <View style={[styles.timeSectionCard, { backgroundColor: isDark ? '#18181b' : '#f8fafc', borderColor: colors.cardBorder }]}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="log-in-outline" size={16} color={colors.primary} />
                                    <Text style={[styles.sectionLabel, { color: colors.text }]}>START TIME</Text>
                                </View>
                                <TimeScrollPicker
                                    value={currentStart}
                                    onChange={(time) => onChangeTiming(selectedMeal, 'start', time)}
                                />
                            </View>

                            {/* End Time Section */}
                            <View style={[styles.timeSectionCard, { backgroundColor: isDark ? '#18181b' : '#f8fafc', borderColor: colors.cardBorder }]}>
                                <View style={styles.sectionHeader}>
                                    <Ionicons name="log-out-outline" size={16} color={colors.primary} />
                                    <Text style={[styles.sectionLabel, { color: colors.text }]}>END TIME</Text>
                                </View>
                                <TimeScrollPicker
                                    value={currentEnd}
                                    onChange={(time) => onChangeTiming(selectedMeal, 'end', time)}
                                />
                            </View>

                            {/* Save Action Button */}
                            <Pressable
                                style={[styles.saveBtn, { backgroundColor: colors.success }, isPending && styles.btnDisabled]}
                                onPress={onSave}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <View style={styles.saveBtnContent}>
                                        <Ionicons name="checkmark-circle" size={18} color="white" />
                                        <Text style={styles.saveBtnText}>Save {selectedMeal} Timings</Text>
                                    </View>
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    scrollContent: { flexGrow: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, gap: 12 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    headerIconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
    modalTitle: { fontSize: 17, fontWeight: '700' },
    modalSubtitle: { fontSize: 12, marginTop: 1 },
    closeBtn: { padding: 4 },
    durationBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    durationBannerText: {
        fontSize: 13,
        fontWeight: '600',
    },
    timeSectionCard: {
        borderRadius: 16,
        borderWidth: 1,
        padding: 12,
        gap: 8,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    saveBtn: {
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 4,
    },
    saveBtnContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    btnDisabled: { opacity: 0.7 },
    saveBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
});
