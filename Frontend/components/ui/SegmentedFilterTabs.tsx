import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/lib/contexts/theme';

export interface FilterTabItem<T = string> {
    id: T;
    label: string;
    icon?: keyof typeof Ionicons.glyphMap;
    count?: number;
    badgeColor?: string;
}

export interface SegmentedFilterTabsProps<T = string> {
    tabs: FilterTabItem<T>[];
    activeTab: T;
    onSelectTab: (tabId: T) => void;
    scrollable?: boolean;
    activeColor?: string;
    style?: ViewStyle;
}

export function SegmentedFilterTabs<T = string>({
    tabs,
    activeTab,
    onSelectTab,
    scrollable = true,
    activeColor,
    style,
}: SegmentedFilterTabsProps<T>) {
    const { colors, isDark } = useTheme();

    const selectedBg = activeColor || colors.primary;

    const renderTab = (tab: FilterTabItem<T>) => {
        const isActive = activeTab === tab.id;

        return (
            <Pressable
                key={String(tab.id)}
                style={[
                    styles.tabChip,
                    { backgroundColor: colors.card },
                    isActive && { backgroundColor: selectedBg },
                ]}
                onPress={() => onSelectTab(tab.id)}
            >
                {tab.icon && (
                    <Ionicons
                        name={tab.icon}
                        size={15}
                        color={isActive ? 'white' : colors.textSecondary}
                    />
                )}
                <Text
                    style={[
                        styles.tabText,
                        { color: colors.textSecondary },
                        isActive && styles.tabTextActive,
                    ]}
                >
                    {tab.label}
                </Text>
                {tab.count !== undefined && (
                    <View
                        style={[
                            styles.countBadge,
                            { backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : (isDark ? '#374151' : '#e5e7eb') },
                        ]}
                    >
                        <Text
                            style={[
                                styles.countText,
                                { color: isActive ? 'white' : colors.textSecondary },
                            ]}
                        >
                            {tab.count}
                        </Text>
                    </View>
                )}
            </Pressable>
        );
    };

    if (scrollable) {
        return (
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[styles.scrollContainer, style]}
                contentContainerStyle={styles.scrollContent}
            >
                {tabs.map(renderTab)}
            </ScrollView>
        );
    }

    return (
        <View style={[styles.fixedContainer, { backgroundColor: colors.backgroundSecondary }, style]}>
            {tabs.map(renderTab)}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        marginBottom: 16,
    },
    scrollContent: {
        gap: 8,
        paddingHorizontal: 2,
    },
    fixedContainer: {
        flexDirection: 'row',
        padding: 4,
        borderRadius: 12,
        gap: 4,
        marginBottom: 16,
    },
    tabChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 9,
        borderRadius: 20,
        gap: 6,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    tabTextActive: {
        color: 'white',
        fontWeight: '600',
    },
    countBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
        marginLeft: 2,
    },
    countText: {
        fontSize: 11,
        fontWeight: '700',
    },
});