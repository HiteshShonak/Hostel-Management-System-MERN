import React from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';
import { useSendTestPush } from '@/lib/hooks';
import { FEATURE_TEST_NOTIFICATIONS } from '@/lib/constants';

/**
 * Temporary dev-only card that sends a real push notification to the current
 * device via POST /test/push-to-me, for verifying FCM delivery end-to-end.
 * Hidden unless EXPO_PUBLIC_ENABLE_TEST_NOTIFICATIONS=true. Remove once push
 * is confirmed stable in production.
 */
export function TestNotificationCard() {
    const { colors, isDark } = useTheme();
    const testPushMutation = useSendTestPush();

    if (!FEATURE_TEST_NOTIFICATIONS) return null;

    const handleSendTestPush = () => {
        testPushMutation.mutate(undefined, {
            onSuccess: (data) => {
                Alert.alert('Sent', data.message || 'Test notification sent. Check your device.');
            },
            onError: (error: any) => {
                const message = error?.response?.data?.message || error?.response?.data?.error || 'Failed to send test notification';
                Alert.alert('Error', message);
            },
        });
    };

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <View style={[styles.sectionIconBox, { backgroundColor: isDark ? '#172554' : '#eff6ff' }]}>
                    <Ionicons name="notifications" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Developer</Text>
            </View>

            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                <Pressable
                    style={[styles.sendBtn, { backgroundColor: colors.primary }, testPushMutation.isPending && styles.btnDisabled]}
                    onPress={handleSendTestPush}
                    disabled={testPushMutation.isPending}
                >
                    {testPushMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Ionicons name="paper-plane" size={20} color="white" />
                            <Text style={styles.sendBtnText}>Send Test Notification</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { gap: 12 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    sectionIconBox: { padding: 8, borderRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: '600' },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 16,
    },
    sendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12 },
    btnDisabled: { opacity: 0.7 },
    sendBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
