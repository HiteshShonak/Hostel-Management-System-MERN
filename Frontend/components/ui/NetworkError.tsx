import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

interface NetworkErrorProps {
    onRetry?: () => void;
    message?: string;
    isTimeout?: boolean;
}

export function NetworkError({ onRetry, message, isTimeout = false }: NetworkErrorProps) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Ionicons
                        name={isTimeout ? "time-outline" : "cloud-offline-outline"}
                        size={64}
                        color={PRIMARY_COLOR}
                    />
                </View>
                <View style={styles.wifiSlash}>
                    {!isTimeout && (
                        <Ionicons name="close" size={24} color="#ef4444" />
                    )}
                </View>
            </View>

            <Text style={styles.title}>
                {isTimeout ? "Connection Timeout" : "No Internet Connection"}
            </Text>

            <Text style={styles.subtitle}>
                {message || (isTimeout
                    ? "The server took too long to respond. Please check your connection and try again."
                    : "Please check your internet connection and try again. We'll get you back to your hostel dashboard soon!"
                )}
            </Text>

            {onRetry && (
                <Pressable style={styles.retryButton} onPress={onRetry}>
                    <Ionicons name="refresh" size={20} color="white" />
                    <Text style={styles.retryText}>Try Again</Text>
                </Pressable>
            )}

            <View style={styles.footer}>
                <Ionicons name="home-outline" size={16} color="#a3a3a3" />
                <Text style={styles.footerText}>HMS - Hostel Management System</Text>
            </View>
        </View>
    );
}

export function LoadingState({ message = "Loading..." }: { message?: string }) {
    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingSpinner}>
                <Ionicons name="sync" size={32} color={PRIMARY_COLOR} />
            </View>
            <Text style={styles.loadingText}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#ffffff',
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 24,
    },
    iconCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(29, 78, 216, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wifiSlash: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 2,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0a0a0a',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        elevation: 4,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    retryText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerText: {
        fontSize: 13,
        color: '#a3a3a3',
    },
    // Loading state styles
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    loadingSpinner: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(29, 78, 216, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
    },
});
