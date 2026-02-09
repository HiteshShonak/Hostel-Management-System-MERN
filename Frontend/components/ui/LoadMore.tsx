import React from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '@/lib/constants';

interface LoadMoreProps {
    onLoadMore: () => void;
    isLoading?: boolean;
    hasMore: boolean;
    loadedCount?: number;
    totalCount?: number;
}

export function LoadMore({ onLoadMore, isLoading = false, hasMore, loadedCount, totalCount }: LoadMoreProps) {
    if (!hasMore && !isLoading) {
        return (
            <View style={styles.endContainer}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#a3a3a3" />
                <Text style={styles.endText}>
                    {loadedCount && totalCount
                        ? `Showing all ${totalCount} items`
                        : "You've reached the end"}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                    <Text style={styles.loadingText}>Loading more...</Text>
                </View>
            ) : (
                <Pressable style={styles.button} onPress={onLoadMore}>
                    <Text style={styles.buttonText}>Load More</Text>
                    <Ionicons name="chevron-down" size={18} color={PRIMARY_COLOR} />
                </Pressable>
            )}
            {loadedCount && totalCount && (
                <Text style={styles.countText}>
                    Showing {loadedCount} of {totalCount}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 16,
        gap: 8,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(29, 78, 216, 0.08)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        color: PRIMARY_COLOR,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
    },
    loadingText: {
        fontSize: 14,
        color: '#6b7280',
    },
    countText: {
        fontSize: 12,
        color: '#a3a3a3',
    },
    endContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 16,
    },
    endText: {
        fontSize: 13,
        color: '#a3a3a3',
    },
});
