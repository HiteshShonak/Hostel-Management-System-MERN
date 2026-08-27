import React from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

interface SOSBigButtonProps {
    isHolding: boolean;
    isPending: boolean;
    scaleAnim: Animated.Value;
    progressAnim: Animated.Value;
    onPressIn: () => void;
    onPressOut: () => void;
}

export function SOSBigButton({
    isHolding,
    isPending,
    scaleAnim,
    progressAnim,
    onPressIn,
    onPressOut,
}: SOSBigButtonProps) {
    const { colors } = useTheme();

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.sosSection}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                    style={styles.sosButton}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    disabled={isPending}
                >
                    <View style={[styles.sosInner, isPending && styles.sosInnerLoading]}>
                        {isPending ? (
                            <ActivityIndicator size="large" color="white" />
                        ) : (
                            <>
                                <Ionicons name="warning" size={48} color="white" />
                                <Text style={styles.sosText}>SOS</Text>
                            </>
                        )}
                        {isHolding && (
                            <Animated.View style={[styles.progressOverlay, { width: progressWidth }]} />
                        )}
                    </View>
                </Pressable>
            </Animated.View>
            <Text style={styles.sosHelp}>
                {isHolding ? '🔴 Keep holding to send SOS...' : 'Hold for 3 seconds to send emergency alert'}
            </Text>
            <Text style={[styles.sosSubtext, { color: colors.textSecondary }]}>
                This will alert wardens and security immediately
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    sosSection: { alignItems: 'center', marginBottom: 32 },
    sosButton: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#fecaca',
        padding: 14,
        shadowColor: '#dc2626',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 15,
    },
    sosInner: {
        flex: 1,
        borderRadius: 80,
        backgroundColor: '#dc2626',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: 'white',
        overflow: 'hidden',
    },
    sosInnerLoading: { backgroundColor: '#ef4444' },
    sosText: { color: 'white', fontSize: 28, fontWeight: '800', marginTop: 4 },
    progressOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '100%',
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    sosHelp: { textAlign: 'center', marginTop: 24, fontSize: 16, fontWeight: '600', color: '#dc2626' },
    sosSubtext: { textAlign: 'center', marginTop: 8, fontSize: 14 },
});
