import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import type { MealType } from '@/lib/types';

interface RateMealModalProps {
    ratingMeal: MealType | null;
    onRate: (star: number) => void;
    onClose: () => void;
}

export function RateMealModal({ ratingMeal, onRate, onClose }: RateMealModalProps) {
    const { colors } = useTheme();

    return (
        <Modal visible={!!ratingMeal} animationType="fade" transparent>
            <View style={styles.ratingOverlay}>
                <View style={[styles.ratingContent, { backgroundColor: colors.card }]}>
                    <Text style={[styles.ratingTitle, { color: colors.text }]}>Rate {ratingMeal}</Text>
                    <Text style={[styles.ratingSubtitle, { color: colors.textSecondary }]}>How was your meal today?</Text>
                    <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable key={star} onPress={() => onRate(star)} style={styles.ratingStarBtn}>
                                <Ionicons name="star" size={40} color="#f59e0b" />
                                <Text style={[styles.ratingStarNum, { color: colors.textSecondary }]}>{star}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={styles.cancelBtn} onPress={onClose}>
                        <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    ratingOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
    ratingContent: { borderRadius: 24, padding: 24, width: '90%', alignItems: 'center' },
    ratingTitle: { fontSize: 20, fontWeight: '600' },
    ratingSubtitle: { fontSize: 14, marginTop: 4, marginBottom: 24 },
    ratingStars: { flexDirection: 'row', gap: 8 },
    ratingStarBtn: { alignItems: 'center', padding: 8 },
    ratingStarNum: { fontSize: 12, marginTop: 4 },
    cancelBtn: { marginTop: 24 },
    cancelBtnText: { fontSize: 16 },
});
