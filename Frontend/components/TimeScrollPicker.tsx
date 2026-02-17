import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/theme-context';

interface TimeScrollPickerProps {
    value: string; // "HH:MM" format
    onChange: (time: string) => void;
}

const ITEM_HEIGHT = 32;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export function TimeScrollPicker({ value, onChange }: TimeScrollPickerProps) {
    const { colors, isDark } = useTheme();
    const [hour, min] = value.split(':').map(Number);

    const hourScrollRef = useRef<ScrollView>(null);
    const minScrollRef = useRef<ScrollView>(null);

    const [selectedHour, setSelectedHour] = useState(hour);
    const [selectedMin, setSelectedMin] = useState(min);

    // Create infinite scroll data
    const createInfiniteData = (max: number) => {
        const base = Array.from({ length: max }, (_, i) => i);
        return [...base, ...base, ...base];
    };

    const hours = createInfiniteData(24);
    const minutes = createInfiniteData(60);

    // start in the middle so they can scroll up/down
    useEffect(() => {
        setTimeout(() => {
            hourScrollRef.current?.scrollTo({
                y: (24 + selectedHour) * ITEM_HEIGHT,
                animated: false,
            });
            minScrollRef.current?.scrollTo({
                y: (60 + selectedMin) * ITEM_HEIGHT,
                animated: false,
            });
        }, 100);
    }, []);

    const handleScroll = (
        event: any,
        max: number,
        setState: (val: number) => void,
        scrollRef: React.RefObject<ScrollView | null>,
        isHour: boolean
    ) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        const value = index % max;

        setState(value);

        const formatted = isHour
            ? `${value.toString().padStart(2, '0')}:${selectedMin.toString().padStart(2, '0')}`
            : `${selectedHour.toString().padStart(2, '0')}:${value.toString().padStart(2, '0')}`;
        onChange(formatted);

        // keep it infinite by jumping back to middle
        if (index < max * 0.5 || index > max * 2.5) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    y: (max + value) * ITEM_HEIGHT,
                    animated: false,
                });
            }, 50);
        }
    };

    const renderPicker = (
        data: number[],
        max: number,
        selectedValue: number,
        scrollRef: React.RefObject<ScrollView | null>,
        isHour: boolean
    ) => {
        return (
            <View style={styles.pickerContainer}>
                {/* nice fade effect */}
                <LinearGradient
                    colors={isDark
                        ? ['rgba(17,24,39,0.98)', 'rgba(17,24,39,0.5)', 'rgba(17,24,39,0)', 'rgba(17,24,39,0.5)', 'rgba(17,24,39,0.98)'] as const
                        : ['rgba(255,255,255,0.98)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.5)', 'rgba(255,255,255,0.98)'] as const
                    }
                    locations={[0, 0.15, 0.5, 0.85, 1]}
                    style={styles.gradientOverlay}
                    pointerEvents="none"
                />

                {/* selection box */}
                <View
                    style={[
                        styles.selectionBox,
                        {
                            backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)',
                            borderColor: isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)',
                        },
                    ]}
                />

                <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => handleScroll(e, max, isHour ? setSelectedHour : setSelectedMin, scrollRef, isHour)}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* padding to center first item */}
                    <View style={{ height: ITEM_HEIGHT }} />

                    {data.map((item, idx) => {
                        const isSelected = item === selectedValue;
                        const centerIdx = data.findIndex((v, i) => v === selectedValue && i >= max && i < max * 2);
                        const distance = Math.abs(idx - centerIdx);

                        // Sleek minimalist effects
                        const opacity = Math.max(0.2, 1 - distance * 0.25);
                        const scale = isSelected ? 1.0 : Math.max(0.75, 1 - distance * 0.08);

                        return (
                            <View
                                key={`${item}-${idx}`}
                                style={[styles.item, { height: ITEM_HEIGHT }]}
                            >
                                <Text
                                    style={[
                                        styles.itemText,
                                        {
                                            color: isSelected
                                                ? (isDark ? '#818cf8' : '#6366f1')
                                                : colors.text,
                                            opacity,
                                            transform: [{ scale }],
                                            fontWeight: isSelected ? '600' : '400',
                                        },
                                    ]}
                                >
                                    {item.toString().padStart(2, '0')}
                                </Text>
                            </View>
                        );
                    })}

                    {/* bottom padding */}
                    <View style={{ height: ITEM_HEIGHT }} />
                </ScrollView>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderPicker(hours, 24, selectedHour, hourScrollRef, true)}
            <Text style={[styles.separator, {
                color: isDark ? '#818cf8' : '#6366f1',
            }]}>:</Text>
            {renderPicker(minutes, 60, selectedMin, minScrollRef, false)}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    pickerContainer: {
        height: PICKER_HEIGHT,
        width: 48,
        position: 'relative',
        overflow: 'hidden',
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2,
        pointerEvents: 'none',
    },
    selectionBox: {
        position: 'absolute',
        top: ITEM_HEIGHT,
        left: 0,
        right: 0,
        height: ITEM_HEIGHT,
        borderRadius: 6,
        borderWidth: 1,
        zIndex: 1,
        pointerEvents: 'none',
    },
    scrollContent: {
        paddingHorizontal: 0,
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemText: {
        fontSize: 18,
        fontVariant: ['tabular-nums'],
    },
    separator: {
        fontSize: 20,
        fontWeight: '500',
        marginHorizontal: 2,
    },
});
