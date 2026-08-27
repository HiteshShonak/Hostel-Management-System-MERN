import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/lib/contexts/theme';
import { formatDateYMD } from '@/lib/utils/date';

interface PastDateStripProps {
    selectedDate: string;
    onSelectDate: (dateStr: string) => void;
}

export function PastDateStrip({ selectedDate, onSelectDate }: PastDateStripProps) {
    const { colors } = useTheme();
    const dateScrollRef = useRef<ScrollView>(null);

    const today = new Date();

    const getPastWeekDates = () => {
        const dates = [];
        const now = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            dates.push(date);
        }
        return dates;
    };

    const pastWeekDates = getPastWeekDates();

    useEffect(() => {
        setTimeout(() => {
            dateScrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, []);

    const formatDate = (date: Date) => {
        const day = date.toLocaleDateString('en-IN', { weekday: 'short' });
        const dayNum = date.getDate();
        return { day, dayNum };
    };

    const isToday = (date: Date) => {
        return formatDateYMD(date) === formatDateYMD(today);
    };

    const isSelected = (date: Date) => {
        return formatDateYMD(date) === selectedDate;
    };

    return (
        <View>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Date</Text>
            <ScrollView
                ref={dateScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.dateScrollContent}
            >
                {pastWeekDates.map((date, index) => {
                    const { day, dayNum } = formatDate(date);
                    const selected = isSelected(date);
                    const todayCheck = isToday(date);

                    return (
                        <Pressable
                            key={formatDateYMD(date)}
                            onPress={() => onSelectDate(formatDateYMD(date))}
                            style={[
                                styles.dateCard,
                                {
                                    backgroundColor: selected ? colors.primary : colors.card,
                                    borderColor: selected ? colors.primary : colors.cardBorder,
                                    marginLeft: index === 0 ? 16 : 0,
                                    marginRight: index === pastWeekDates.length - 1 ? 16 : 10,
                                }
                            ]}
                        >
                            <Text style={[
                                styles.dateDayLabel,
                                { color: selected ? '#fff' : colors.textSecondary }
                            ]}>
                                {day}
                            </Text>
                            <Text style={[
                                styles.dateDayNum,
                                { color: selected ? '#fff' : colors.text }
                            ]}>
                                {dayNum}
                            </Text>
                            {todayCheck && (
                                <View style={[styles.todayIndicator, { backgroundColor: selected ? '#fff' : colors.success }]} />
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12, paddingHorizontal: 16 },
    dateScrollContent: { paddingVertical: 4 },
    dateCard: {
        width: 60,
        height: 72,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        gap: 2,
    },
    dateDayLabel: { fontSize: 12, fontWeight: '500' },
    dateDayNum: { fontSize: 18, fontWeight: '700' },
    todayIndicator: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
});
