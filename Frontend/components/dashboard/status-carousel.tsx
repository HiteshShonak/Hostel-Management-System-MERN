import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';
import { useCurrentGatePass } from '@/lib/hooks';
import { formatTime } from '@/lib/utils';

export function StatusCarousel() {
    const { isDark } = useTheme();
    const { data: passData } = useCurrentGatePass();
    const pass = passData?.pass;
    const isOut = passData?.isCurrentlyOut ?? false;

    if (!pass) return null;

    const accent = isOut ? (isDark ? '#fb923c' : '#ea580c') : (isDark ? '#60a5fa' : '#2563eb');
    const bg = isOut ? (isDark ? '#431407' : '#fff7ed') : (isDark ? '#172554' : '#eff6ff');
    const border = isOut ? (isDark ? '#7c2d12' : '#fdba74') : (isDark ? '#1e3a8a' : '#93c5fd');
    const iconBg = isOut ? (isDark ? '#7c2d12' : '#fed7aa') : (isDark ? '#1e40af' : '#bfdbfe');

    const d = new Date(pass.toDate);
    const time = formatTime(pass.toDate);
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

    return (
        <View style={styles.outer}>
            <View style={styles.clipper}>
                <Pressable
                    style={[styles.card, { backgroundColor: bg, borderColor: border }]}
                    onPress={() => router.push('/shared/gate-pass')}
                >
                    <View style={[styles.icon, { backgroundColor: iconBg }]}>
                        <Ionicons name={isOut ? 'walk' : 'document-text'} size={28} color={accent} />
                    </View>
                    <View style={styles.txt}>
                        <Text style={[styles.title, { color: accent }]}>
                            {isOut ? 'Currently Outside' : 'Active Gate Pass'}
                        </Text>
                        <Text style={[styles.sub, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                            {isOut ? `Return by ${time}, ${date}` : `Valid until ${date}`}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={accent} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: { marginBottom: 8 },
    clipper: { marginHorizontal: 16 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        gap: 16,
    },
    icon: {
        width: 52, height: 52, borderRadius: 26,
        alignItems: 'center', justifyContent: 'center',
    },
    txt: { flex: 1 },
    title: { fontSize: 17, fontWeight: '700', marginBottom: 4, letterSpacing: 0.3 },
    sub: { fontSize: 13, fontWeight: '500' },
});
