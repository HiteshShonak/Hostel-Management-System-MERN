/**
 * StatusCarousel — infinite 2-slide carousel (pass ↔ attendance)
 *
 * Double-buffer: Slot A and Slot B are always mounted.
 * All mutable state stored in refs so PanResponder + timer closures
 * always read fresh values. Zero stale closures, zero jitter.
 */
import React, { useRef, useState, useEffect } from 'react';
import {
    View, Text, Pressable, StyleSheet,
    Animated, PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/lib/theme-context';
import { useCurrentGatePass, useTodayAttendance } from '@/lib/hooks';

const AUTO_MS = 2000;
const ANIM_MS = 340;
const SWIPE_PX = 40;

// ── slide content ─────────────────────────────────────────────────────────────

function AttendanceSlide() {
    const { isDark } = useTheme();
    const { data } = useTodayAttendance();
    const marked = data?.marked ?? false;

    const accent = marked ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#93c5fd' : '#1d4ed8');
    const bg = marked ? (isDark ? '#064e3b' : '#f0fdf4') : (isDark ? '#172554' : '#eff6ff');
    const border = marked ? (isDark ? '#065f46' : '#bbf7d0') : (isDark ? '#1e3a8a' : '#dbeafe');
    const iconBg = marked ? (isDark ? '#065f46' : '#dcfce7') : (isDark ? '#1e40af' : '#bfdbfe');

    return (
        <Pressable style={[styles.card, { backgroundColor: bg, borderColor: border }]}
            onPress={() => router.push('/attendance')}>
            <View style={[styles.icon, { backgroundColor: iconBg }]}>
                <Ionicons name={marked ? 'checkmark-circle' : 'location'} size={28} color={accent} />
            </View>
            <View style={styles.txt}>
                <Text style={[styles.title, { color: accent }]}>
                    {marked ? 'Attendance Marked' : 'Mark Your Attendance'}
                </Text>
                <Text style={[styles.sub, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                    {marked ? 'Successfully marked for today' : 'Verify your location to check in'}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={accent} />
        </Pressable>
    );
}

function PassSlide({ pass, out }: { pass: any; out: boolean }) {
    const { isDark } = useTheme();

    const accent = out ? (isDark ? '#fb923c' : '#ea580c') : (isDark ? '#60a5fa' : '#2563eb');
    const bg = out ? (isDark ? '#431407' : '#fff7ed') : (isDark ? '#172554' : '#eff6ff');
    const border = out ? (isDark ? '#7c2d12' : '#fdba74') : (isDark ? '#1e3a8a' : '#93c5fd');
    const iconBg = out ? (isDark ? '#7c2d12' : '#fed7aa') : (isDark ? '#1e40af' : '#bfdbfe');

    const d = new Date(pass.toDate);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

    return (
        <Pressable style={[styles.card, { backgroundColor: bg, borderColor: border }]}
            onPress={() => router.push('/gate-pass')}>
            <View style={[styles.icon, { backgroundColor: iconBg }]}>
                <Ionicons name={out ? 'walk' : 'document-text'} size={28} color={accent} />
            </View>
            <View style={styles.txt}>
                <Text style={[styles.title, { color: accent }]}>
                    {out ? 'Currently Outside' : 'Active Gate Pass'}
                </Text>
                <Text style={[styles.sub, { color: isDark ? '#9ca3af' : '#4b5563' }]}>
                    {out ? `Return by ${time}, ${date}` : `Valid until ${date}`}
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={accent} />
        </Pressable>
    );
}

// ── carousel ──────────────────────────────────────────────────────────────────

export function StatusCarousel({ showAttendance }: { showAttendance: boolean }) {
    const { isDark } = useTheme();
    const { data: passData } = useCurrentGatePass();
    const hasPass = !!passData?.pass;

    const slides: ('pass' | 'attendance')[] = [];
    if (hasPass) slides.push('pass');
    if (showAttendance) slides.push('attendance');
    const count = slides.length;

    // ======= ALL MUTABLE STATE IN REFS =======
    // so PanResponder + setInterval closures never go stale
    const cwRef = useRef(0);       // container width
    const countRef = useRef(count);
    const activeRef = useRef(0);       // 0 = slot A active, 1 = slot B active
    const busyRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const dragDirRef = useRef<0 | 1 | -1>(0);

    // keep countRef in sync
    countRef.current = count;

    // render state (triggers visual update)
    const [activeDot, setActiveDot] = useState(0);
    const [, forceUpdate] = useState(0);   // force re-render after width measured

    // two translateX animated values — one per slot, always mounted
    const xA = useRef(new Animated.Value(0)).current;
    const xB = useRef(new Animated.Value(0)).current;

    // dot spring values
    const dotA = useRef(new Animated.Value(1)).current;
    const dotB = useRef(new Animated.Value(0)).current;

    // ── helpers (plain functions reading from refs — never stale) ──

    function springDots(idx: number) {
        Animated.spring(dotA, { toValue: idx === 0 ? 1 : 0, useNativeDriver: false, tension: 180, friction: 12 }).start();
        Animated.spring(dotB, { toValue: idx === 1 ? 1 : 0, useNativeDriver: false, tension: 180, friction: 12 }).start();
    }

    function getSlots() {
        const isAactive = activeRef.current === 0;
        return {
            xActive: isAactive ? xA : xB,
            xStaging: isAactive ? xB : xA,
        };
    }

    function slideTo(targetIdx: number, dir: 1 | -1) {
        const w = cwRef.current;
        const n = countRef.current;
        if (busyRef.current || !w || n <= 1) return;

        const wrapped = ((targetIdx % n) + n) % n;
        if (wrapped === activeRef.current) return;

        busyRef.current = true;
        const { xActive, xStaging } = getSlots();

        // staging starts off-screen in the approach direction
        xStaging.setValue(dir * w);

        Animated.parallel([
            Animated.timing(xActive, { toValue: -dir * w, duration: ANIM_MS, useNativeDriver: true }),
            Animated.timing(xStaging, { toValue: 0, duration: ANIM_MS, useNativeDriver: true }),
        ]).start(() => {
            // park the old active off-screen for next transition
            xActive.setValue(w);
            activeRef.current = wrapped;
            setActiveDot(wrapped);
            springDots(wrapped);
            busyRef.current = false;
        });
    }

    function clearTimer() {
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    }

    function startTimer() {
        clearTimer();
        if (countRef.current <= 1 || !cwRef.current) return;
        timerRef.current = setInterval(() => {
            slideTo(activeRef.current + 1, 1);
        }, AUTO_MS);
    }

    // start auto-advance once we have width + slides
    useEffect(() => {
        if (cwRef.current > 0 && count > 1) startTimer();
        return () => clearTimer();
    }, [count, cwRef.current]);

    // reset when slides change
    useEffect(() => {
        clearTimer();
        busyRef.current = false;
        activeRef.current = 0;
        setActiveDot(0);
        xA.setValue(0);
        xB.setValue(cwRef.current || 9999);
        dotA.setValue(1);
        dotB.setValue(0);
        if (count > 1 && cwRef.current > 0) startTimer();
    }, [count]);

    // layout callback — stores width and parks slot B
    function onLayout(e: any) {
        const w = e.nativeEvent.layout.width;
        if (w === cwRef.current) return; // no change
        cwRef.current = w;
        // park inactive slot off-screen with the real width
        if (activeRef.current === 0) xB.setValue(w);
        else xA.setValue(w);
        forceUpdate(n => n + 1); // trigger re-render so slides get width
        startTimer();
    }

    // ── PanResponder ──
    // Reads ONLY from refs → never stale

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => false,
            onStartShouldSetPanResponderCapture: () => false,
            onMoveShouldSetPanResponder: (_, g) => {
                const dominated =
                    !busyRef.current &&
                    countRef.current > 1 &&
                    cwRef.current > 0 &&
                    Math.abs(g.dx) > 6 &&
                    Math.abs(g.dx) > Math.abs(g.dy);
                return dominated;
            },
            // CAPTURE phase — steal gesture from Pressable children
            // when we detect a clear horizontal drag
            onMoveShouldSetPanResponderCapture: (_, g) =>
                !busyRef.current &&
                countRef.current > 1 &&
                cwRef.current > 0 &&
                Math.abs(g.dx) > 10 &&
                Math.abs(g.dx) > Math.abs(g.dy) * 1.5,

            onPanResponderGrant: () => {
                clearTimer();
                xA.stopAnimation();
                xB.stopAnimation();
                dragDirRef.current = 0;
            },

            onPanResponderMove: (_, g) => {
                const w = cwRef.current;
                const n = countRef.current;
                if (!w || n <= 1) return;

                const dir: 1 | -1 = g.dx < 0 ? 1 : -1;

                // first meaningful move: lock direction & place staging off-screen
                if (dragDirRef.current === 0) {
                    dragDirRef.current = dir;
                    const { xStaging } = getSlots();
                    xStaging.setValue(dir * w);
                }

                // both cards follow finger
                const { xActive, xStaging } = getSlots();
                xActive.setValue(g.dx);
                xStaging.setValue(dragDirRef.current * w + g.dx);
            },

            onPanResponderRelease: (_, g) => {
                const w = cwRef.current;
                const n = countRef.current;
                const dir = dragDirRef.current;
                dragDirRef.current = 0;

                if (!dir || !w || n <= 1) {
                    startTimer();
                    return;
                }

                const triggered = Math.abs(g.dx) > SWIPE_PX || Math.abs(g.vx) > 0.4;

                if (triggered) {
                    const next = ((activeRef.current + dir) % n + n) % n;
                    busyRef.current = true;
                    const { xActive, xStaging } = getSlots();

                    Animated.parallel([
                        Animated.spring(xActive, { toValue: -dir * w, useNativeDriver: true, tension: 120, friction: 10, overshootClamping: true }),
                        Animated.spring(xStaging, { toValue: 0, useNativeDriver: true, tension: 120, friction: 10, overshootClamping: true }),
                    ]).start(() => {
                        xActive.setValue(w);
                        activeRef.current = next;
                        setActiveDot(next);
                        springDots(next);
                        busyRef.current = false;
                        startTimer();
                    });
                } else {
                    // snap back
                    const { xActive, xStaging } = getSlots();
                    Animated.parallel([
                        Animated.spring(xActive, { toValue: 0, useNativeDriver: true, tension: 150, friction: 14 }),
                        Animated.spring(xStaging, { toValue: dir * w, useNativeDriver: true, tension: 150, friction: 14 }),
                    ]).start(() => startTimer());
                }
            },

            onPanResponderTerminate: () => {
                dragDirRef.current = 0;
                const w = cwRef.current;
                if (activeRef.current === 0) { xA.setValue(0); xB.setValue(w); }
                else { xB.setValue(0); xA.setValue(w); }
                busyRef.current = false;
                startTimer();
            },
        })
    ).current;

    // ── render ──

    if (count === 0) return null;

    const w = cwRef.current;

    const renderSlot = (slotIdx: number) => {
        const type = slides[slotIdx];
        if (!type || !w) return <View />;
        if (type === 'pass' && passData?.pass) {
            return <PassSlide pass={passData.pass} out={passData.isCurrentlyOut} />;
        }
        return <AttendanceSlide />;
    };

    return (
        <View style={styles.outer}>
            <View style={styles.clipper} onLayout={onLayout} {...panResponder.panHandlers}>
                {/* Slot A — always mounted */}
                <Animated.View style={{ transform: [{ translateX: xA }] }}>
                    {renderSlot(0)}
                </Animated.View>

                {/* Slot B — always mounted (absolute overlay) */}
                {count > 1 && (
                    <Animated.View style={[styles.overlay, { transform: [{ translateX: xB }] }]}>
                        {renderSlot(1)}
                    </Animated.View>
                )}
            </View>

            {/* dots */}
            {count > 1 && (
                <View style={styles.dots}>
                    {[dotA, dotB].slice(0, count).map((anim, i) => (
                        <Pressable
                            key={i}
                            hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
                            onPress={() => {
                                clearTimer();
                                const dir: 1 | -1 = i > activeRef.current ? 1 : -1;
                                slideTo(i, dir);
                                startTimer();
                            }}
                        >
                            <Animated.View style={[styles.dot, {
                                backgroundColor: isDark ? '#94a3b8' : '#1d4ed8',
                                width: anim.interpolate({ inputRange: [0, 1], outputRange: [6, 22] }),
                                opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1] }),
                            }]} />
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

// ── styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    outer: { marginBottom: 8 },
    clipper: { marginHorizontal: 16, overflow: 'hidden' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 2,
        gap: 16,
    },
    icon: {
        width: 52, height: 52, borderRadius: 26,
        alignItems: 'center', justifyContent: 'center',
    },
    txt: { flex: 1 },
    title: { fontSize: 17, fontWeight: '700', marginBottom: 4, letterSpacing: 0.3 },
    sub: { fontSize: 13, fontWeight: '500' },
    dots: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        gap: 6, marginTop: 10, marginBottom: 2,
    },
    dot: { height: 6, borderRadius: 3 },
});
