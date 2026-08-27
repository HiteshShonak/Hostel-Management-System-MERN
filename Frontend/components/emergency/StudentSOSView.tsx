import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Vibration, Alert } from 'react-native';
import { useEmergencyContacts, useSOS } from '@/lib/hooks';
import { SOSBigButton } from './SOSBigButton';
import { QuickSOSGrid } from './QuickSOSGrid';
import { EmergencyContactsList } from './EmergencyContactsList';

const HOLD_DURATION = 3000;

export function StudentSOSView() {
    const { data: contacts, isLoading: loadingContacts } = useEmergencyContacts();
    const sosMutation = useSOS();

    const [isHolding, setIsHolding] = useState(false);
    const [quickHoldType, setQuickHoldType] = useState<string | null>(null);
    const holdTimer = useRef<NodeJS.Timeout | null>(null);
    const progressAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const quickProgressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        return () => {
            if (holdTimer.current) clearTimeout(holdTimer.current);
        };
    }, []);

    const startHold = () => {
        setIsHolding(true);
        Vibration.vibrate(50);
        Animated.timing(progressAnim, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.1, duration: 300, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
            ])
        ).start();
        holdTimer.current = setTimeout(() => triggerSOS(), HOLD_DURATION);
    };

    const cancelHold = () => {
        setIsHolding(false);
        if (holdTimer.current) clearTimeout(holdTimer.current);
        progressAnim.setValue(0);
        scaleAnim.setValue(1);
        scaleAnim.stopAnimation();
    };

    const startQuickHold = (type: string, message: string) => {
        setQuickHoldType(type);
        Vibration.vibrate(50);
        Animated.timing(quickProgressAnim, { toValue: 1, duration: HOLD_DURATION, useNativeDriver: false }).start();
        holdTimer.current = setTimeout(() => triggerQuickSOS(type, message), HOLD_DURATION);
    };

    const cancelQuickHold = () => {
        setQuickHoldType(null);
        if (holdTimer.current) clearTimeout(holdTimer.current);
        quickProgressAnim.setValue(0);
    };

    const triggerQuickSOS = (type: string, message: string) => {
        Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        setQuickHoldType(null);
        quickProgressAnim.setValue(0);
        sosMutation.mutate(
            { type: type as 'Medical' | 'Fire' | 'Ragging' | 'Other', message },
            {
                onSuccess: () => {
                    Alert.alert('Alert Sent!', `${type} emergency alert has been sent. Help is on the way.`, [{ text: 'OK' }]);
                },
                onError: () => {
                    Alert.alert('Alert Failed', 'Could not send alert. Please try calling emergency contacts directly.', [{ text: 'OK' }]);
                },
            }
        );
    };

    const triggerSOS = () => {
        Vibration.vibrate([0, 100, 50, 100, 50, 100]);
        setIsHolding(false);
        progressAnim.setValue(0);
        scaleAnim.setValue(1);
        sosMutation.mutate(
            { type: 'Other', message: 'Emergency SOS Alert!' },
            {
                onSuccess: () => {
                    Alert.alert('SOS Sent!', 'Help is on the way. The warden and security have been alerted.', [{ text: 'OK' }]);
                },
                onError: () => {
                    Alert.alert('SOS Failed', 'Could not send SOS. Please call emergency contacts directly.', [{ text: 'OK' }]);
                },
            }
        );
    };

    return (
        <View style={styles.content}>
            <SOSBigButton
                isHolding={isHolding}
                isPending={sosMutation.isPending}
                scaleAnim={scaleAnim}
                progressAnim={progressAnim}
                onPressIn={startHold}
                onPressOut={cancelHold}
            />

            <QuickSOSGrid
                quickHoldType={quickHoldType}
                isPending={sosMutation.isPending}
                quickProgressAnim={quickProgressAnim}
                onPressIn={startQuickHold}
                onPressOut={cancelQuickHold}
            />

            <EmergencyContactsList
                contacts={contacts}
                isLoading={loadingContacts}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    content: { padding: 16 },
});
