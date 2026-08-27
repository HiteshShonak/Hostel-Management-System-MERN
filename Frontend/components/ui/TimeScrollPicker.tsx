import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/lib/contexts/theme';

interface TimeScrollPickerProps {
    value: string; // "HH:MM" 24h format
    onChange: (time: string) => void;
}

function CylinderColumn({
    prevVal,
    currentVal,
    nextVal,
    onPrev,
    onNext,
    isDark,
}: {
    prevVal: number;
    currentVal: number;
    nextVal: number;
    onPrev: () => void;
    onNext: () => void;
    isDark: boolean;
}) {
    return (
        <View style={styles.cylinderColumn}>
            <Pressable style={({ pressed }) => [styles.sideNumberBtn, styles.top3DTransform, pressed && { opacity: 0.8 }]} onPress={onPrev} hitSlop={8}>
                <Text style={[styles.sideNumberText, { color: isDark ? '#71717a' : '#94a3b8' }]}>{prevVal.toString().padStart(2, '0')}</Text>
            </Pressable>
            <View style={[styles.activeDigitCard, { borderColor: isDark ? '#6366f1' : '#818cf8', shadowColor: '#6366f1' }]}>
                <LinearGradient colors={isDark ? ['#312e81', '#1e1b4b'] : ['#ffffff', '#eff6ff']} style={styles.activeCardGradient}>
                    <Text style={[styles.activeDigitText, { color: isDark ? '#e0e7ff' : '#1e40af' }]}>{currentVal.toString().padStart(2, '0')}</Text>
                </LinearGradient>
            </View>
            <Pressable style={({ pressed }) => [styles.sideNumberBtn, styles.bottom3DTransform, pressed && { opacity: 0.8 }]} onPress={onNext} hitSlop={8}>
                <Text style={[styles.sideNumberText, { color: isDark ? '#71717a' : '#94a3b8' }]}>{nextVal.toString().padStart(2, '0')}</Text>
            </Pressable>
        </View>
    );
}

export function TimeScrollPicker({ value, onChange }: TimeScrollPickerProps) {
    const { colors, isDark } = useTheme();

    const parseTime = (timeStr: string) => {
        const [rawH, rawM] = (timeStr || '07:00').split(':').map(Number);
        const h = isNaN(rawH) ? 7 : Math.min(Math.max(rawH, 0), 23);
        const m = isNaN(rawM) ? 0 : Math.min(Math.max(rawM, 0), 59);
        return { hour12: h % 12 || 12, minute: m, isPM: h >= 12 };
    };

    const { hour12, minute, isPM } = parseTime(value);
    const prevHour = hour12 === 1 ? 12 : hour12 - 1;
    const nextHour = hour12 === 12 ? 1 : hour12 + 1;
    const prevMinute = minute - 5 < 0 ? minute - 5 + 60 : minute - 5;
    const nextMinute = (minute + 5) % 60;

    const updateTime = (newHour12: number, newMinute: number, newIsPM: boolean) => {
        let h24 = newHour12 % 12 + (newIsPM ? 12 : 0);
        onChange(`${h24.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`);
    };

    const changeHour = (delta: number) => {
        let next = hour12 + delta;
        updateTime(next > 12 ? 1 : next < 1 ? 12 : next, minute, isPM);
    };

    const changeMinute = (delta: number) => {
        let nextMin = (minute + delta + 60) % 60;
        updateTime(hour12, nextMin, isPM);
    };

    return (
        <View style={styles.container}>
            <View style={styles.drumRow}>
                {/* 3D Hour Column */}
                <CylinderColumn prevVal={prevHour} currentVal={hour12} nextVal={nextHour} onPrev={() => changeHour(-1)} onNext={() => changeHour(1)} isDark={isDark} />

                {/* Glowing 3D Colon Separator */}
                <View style={styles.colonContainer}>
                    <View style={[styles.colonDot, { backgroundColor: isDark ? '#818cf8' : '#6366f1' }]} />
                    <View style={[styles.colonDot, { backgroundColor: isDark ? '#818cf8' : '#6366f1' }]} />
                </View>

                {/* 3D Minute Column */}
                <CylinderColumn prevVal={prevMinute} currentVal={minute} nextVal={nextMinute} onPrev={() => changeMinute(-5)} onNext={() => changeMinute(5)} isDark={isDark} />

                {/* 3D AM / PM Vertical Switch */}
                <View style={[styles.periodSwitch3D, { backgroundColor: isDark ? '#1c1917' : '#f1f5f9', borderColor: colors.cardBorder }]}>
                    <Pressable onPress={() => !isPM || updateTime(hour12, minute, false)} style={[styles.periodBtn3D, !isPM && styles.periodBtn3DActive]}>
                        <Text style={[styles.periodText3D, { color: !isPM ? '#ffffff' : colors.textTertiary }]}>AM</Text>
                    </Pressable>
                    <Pressable onPress={() => isPM || updateTime(hour12, minute, true)} style={[styles.periodBtn3D, isPM && styles.periodBtn3DActive]}>
                        <Text style={[styles.periodText3D, { color: isPM ? '#ffffff' : colors.textTertiary }]}>PM</Text>
                    </Pressable>
                </View>
            </View>

            {/* Quick Adjust Preset Pills */}
            <View style={styles.chipsRow}>
                {[-15, 15, 30].map((mins) => (
                    <Pressable
                        key={mins}
                        style={({ pressed }) => [styles.chip3D, { backgroundColor: isDark ? '#27272a' : '#f8fafc', borderColor: colors.cardBorder }, pressed && { transform: [{ scale: 0.94 }] }]}
                        onPress={() => changeMinute(mins)}
                    >
                        <Text style={[styles.chipText3D, { color: isDark ? '#cbd5e1' : '#475569' }]}>{mins > 0 ? `+${mins}m` : `${mins}m`}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', gap: 6, width: '100%' },
    drumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    cylinderColumn: { alignItems: 'center', width: 54, height: 104, justifyContent: 'space-between' },
    sideNumberBtn: { width: 50, height: 26, alignItems: 'center', justifyContent: 'center' },
    sideNumberText: { fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
    top3DTransform: { transform: [{ perspective: 350 }, { rotateX: '45deg' }, { scale: 0.8 }, { translateY: 3 }], opacity: 0.45 },
    bottom3DTransform: { transform: [{ perspective: 350 }, { rotateX: '-45deg' }, { scale: 0.8 }, { translateY: -3 }], opacity: 0.45 },
    activeDigitCard: { width: 54, height: 46, borderRadius: 12, borderWidth: 1.5, overflow: 'hidden', elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
    activeCardGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    activeDigitText: { fontSize: 22, fontWeight: '800', fontVariant: ['tabular-nums'] },
    colonContainer: { gap: 6, paddingHorizontal: 2, alignItems: 'center', justifyContent: 'center' },
    colonDot: { width: 5, height: 5, borderRadius: 2.5 },
    periodSwitch3D: { flexDirection: 'column', borderRadius: 12, borderWidth: 1, padding: 3, marginLeft: 4, gap: 3, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2 },
    periodBtn3D: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    periodBtn3DActive: { backgroundColor: '#6366f1', elevation: 3, shadowColor: '#6366f1', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.35, shadowRadius: 3 },
    periodText3D: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
    chipsRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 4 },
    chip3D: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, borderWidth: 1, elevation: 1 },
    chipText3D: { fontSize: 11, fontWeight: '700' },
});
