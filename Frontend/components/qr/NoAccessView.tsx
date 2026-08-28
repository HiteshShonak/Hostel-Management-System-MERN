import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/contexts/theme';

// Unauthorized access state view
export function NoAccessView() {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Ionicons name="lock-closed" size={64} color="#dc2626" />
                <Text style={[styles.title, { color: colors.text }]}>Access Denied</Text>
                <Text style={[styles.text, { color: colors.textSecondary }]}>Only staff members can verify gate passes</Text>
                <Pressable
                    style={[styles.backBtn, { backgroundColor: colors.background }]}
                    onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
                >
                    <Text style={[styles.backBtnText, { color: colors.text }]}>Go Back</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    title: { fontSize: 24, fontWeight: '700', marginTop: 16 },
    text: { fontSize: 14, marginTop: 8, textAlign: 'center' },
    backBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
    backBtnText: { fontWeight: '600' },
});
