import { useRef, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import { ScanResult } from './ScanResultStatusHeader';

// Custom hook managing scanner pulse, staggered result entrance, and reset animations
export function useScannerAnimation(
    isValidating: boolean,
    scanResult: ScanResult | null,
    actionCompleted: boolean,
    onResetCompleted: () => void
) {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const validatePulse = useRef(new Animated.Value(0.4)).current;
    const resultOpacity = useRef(new Animated.Value(0)).current;
    const statusSlide = useRef(new Animated.Value(30)).current;
    const cardSlide = useRef(new Animated.Value(30)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const actionsSlide = useRef(new Animated.Value(30)).current;
    const actionsOpacity = useRef(new Animated.Value(0)).current;
    const confirmOpacity = useRef(new Animated.Value(0)).current;
    const confirmSlide = useRef(new Animated.Value(20)).current;

    // Pulse animation for scan frame
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, [pulseAnim]);

    // Validating pulse loop
    useEffect(() => {
        if (isValidating) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(validatePulse, { toValue: 1, duration: 800, useNativeDriver: true }),
                    Animated.timing(validatePulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [isValidating, validatePulse]);

    // Staggered result entry animation
    useEffect(() => {
        if (scanResult && !isValidating) {
            resultOpacity.setValue(0);
            statusSlide.setValue(30);
            cardOpacity.setValue(0);
            cardSlide.setValue(30);
            actionsOpacity.setValue(0);
            actionsSlide.setValue(30);

            Animated.stagger(120, [
                Animated.parallel([
                    Animated.timing(resultOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(statusSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(cardOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(cardSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
                Animated.parallel([
                    Animated.timing(actionsOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                    Animated.spring(actionsSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
                ]),
            ]).start();
        }
    }, [scanResult, isValidating, resultOpacity, statusSlide, cardOpacity, cardSlide, actionsOpacity, actionsSlide]);

    // Action completion crossfade
    useEffect(() => {
        if (actionCompleted) {
            confirmOpacity.setValue(0);
            confirmSlide.setValue(20);
            Animated.parallel([
                Animated.timing(confirmOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(confirmSlide, { toValue: 0, tension: 60, friction: 8, useNativeDriver: true }),
            ]).start();
        }
    }, [actionCompleted, confirmOpacity, confirmSlide]);

    const resetScan = useCallback(() => {
        Animated.timing(resultOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
            onResetCompleted();
            resultOpacity.setValue(0);
            statusSlide.setValue(30);
            cardOpacity.setValue(0);
            cardSlide.setValue(30);
            actionsOpacity.setValue(0);
            actionsSlide.setValue(30);
            confirmOpacity.setValue(0);
            confirmSlide.setValue(20);
        });
    }, [onResetCompleted, resultOpacity, statusSlide, cardOpacity, cardSlide, actionsOpacity, actionsSlide, confirmOpacity, confirmSlide]);

    return {
        pulseAnim,
        validatePulse,
        resultOpacity,
        statusSlide,
        cardSlide,
        cardOpacity,
        actionsSlide,
        actionsOpacity,
        confirmOpacity,
        confirmSlide,
        resetScan,
    };
}
