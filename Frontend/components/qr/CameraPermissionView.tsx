import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface CameraPermissionViewProps {
    hasPermissionObject: boolean;
    onRequestPermission: () => void;
}

// Camera permission request view
export function CameraPermissionView({
    hasPermissionObject,
    onRequestPermission,
}: CameraPermissionViewProps) {
    const { colors } = useTheme();

    if (!hasPermissionObject) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Ionicons name="camera-outline" size={64} color={colors.textSecondary} />
                    <Text style={[styles.text, { color: colors.textSecondary }]}>Camera permission is required</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Ionicons name="camera-outline" size={64} color={colors.primary} />
                <Text style={[styles.title, { color: colors.text }]}>Camera Access Required</Text>
                <Text style={[styles.text, { color: colors.textSecondary }]}>We need camera access to scan QR codes on gate passes</Text>
                <Pressable style={[styles.grantBtn, { backgroundColor: colors.primary }]} onPress={onRequestPermission}>
                    <Text style={styles.grantBtnText}>Grant Permission</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    title: { fontSize: 20, fontWeight: '600', marginTop: 16 },
    text: { fontSize: 14, textAlign: 'center', marginTop: 8 },
    grantBtn: { marginTop: 24, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
    grantBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
});
