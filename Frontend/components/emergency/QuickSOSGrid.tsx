import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface QuickSOSGridProps {
    quickHoldType: string | null;
    isPending: boolean;
    quickProgressAnim: Animated.Value;
    onPressIn: (type: string, message: string) => void;
    onPressOut: () => void;
}

export function QuickSOSGrid({
    quickHoldType,
    isPending,
    quickProgressAnim,
    onPressIn,
    onPressOut,
}: QuickSOSGridProps) {
    const { isDark } = useTheme();

    const quickProgressWidth = quickProgressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    const QUICK_BUTTONS = [
        {
            type: 'Medical',
            msg: 'Medical Emergency!',
            bg: isDark ? '#3f1118' : '#fef2f2',
            color: isDark ? '#fb7185' : '#dc2626',
            icon: 'medkit' as const,
            pbg: isDark ? 'rgba(251,113,133,0.3)' : 'rgba(220,38,38,0.2)',
        },
        {
            type: 'Fire',
            msg: 'Fire Emergency!',
            bg: isDark ? '#451a03' : '#fef3c7',
            color: isDark ? '#fbbf24' : '#d97706',
            icon: 'flame' as const,
            pbg: isDark ? 'rgba(251,191,36,0.3)' : 'rgba(217,119,6,0.2)',
        },
        {
            type: 'Ragging',
            msg: 'Ragging Incident!',
            bg: isDark ? '#2e1065' : '#ede9fe',
            color: isDark ? '#a78bfa' : '#7c3aed',
            icon: 'shield' as const,
            pbg: isDark ? 'rgba(167,139,250,0.3)' : 'rgba(124,58,237,0.2)',
        },
    ];

    return (
        <View style={styles.quickButtons}>
            {QUICK_BUTTONS.map(({ type, msg, bg, color, icon, pbg }) => (
                <Pressable
                    key={type}
                    style={[styles.quickBtn, { backgroundColor: bg, overflow: 'hidden' }]}
                    onPressIn={() => onPressIn(type, msg)}
                    onPressOut={onPressOut}
                    disabled={isPending}
                >
                    {quickHoldType === type && (
                        <Animated.View style={[styles.quickProgress, { width: quickProgressWidth, backgroundColor: pbg }]} />
                    )}
                    <Ionicons name={icon} size={28} color={color} />
                    <Text style={[styles.quickBtnText, { color }]}>{type}</Text>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    quickButtons: { flexDirection: 'row', gap: 12, marginBottom: 32 },
    quickBtn: { flex: 1, alignItems: 'center', paddingVertical: 20, borderRadius: 16 },
    quickProgress: { position: 'absolute', top: 0, left: 0, bottom: 0 },
    quickBtnText: { fontSize: 13, fontWeight: '600', marginTop: 8 },
});
