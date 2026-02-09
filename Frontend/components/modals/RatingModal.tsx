import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingModalProps {
    visible: boolean;
    mealType: string | null;
    onRate: (rating: number) => void;
    onClose: () => void;
}

export function RatingModal({ visible, mealType, onRate, onClose }: RatingModalProps) {
    if (!visible || !mealType) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.title}>Rate {mealType}</Text>
                    <Text style={styles.subtitle}>How was your meal today?</Text>
                    <View style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Pressable key={star} onPress={() => onRate(star)} style={styles.starBtn}>
                                <Ionicons name="star" size={40} color="#f59e0b" />
                                <Text style={styles.starNum}>{star}</Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        width: '90%',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#0a0a0a',
    },
    subtitle: {
        fontSize: 14,
        color: '#737373',
        marginTop: 4,
        marginBottom: 24,
    },
    stars: {
        flexDirection: 'row',
        gap: 8,
    },
    starBtn: {
        alignItems: 'center',
        padding: 8,
    },
    starNum: {
        fontSize: 12,
        color: '#737373',
        marginTop: 4,
    },
    cancelBtn: {
        marginTop: 24,
    },
    cancelText: {
        color: '#737373',
        fontSize: 16,
    },
});
