import { useState, useCallback } from 'react';
import { Vibration } from 'react-native';
import { useValidateGatePass, useMarkExit, useMarkEntry } from '@/lib/hooks';
import { ScanResult } from './ScanResultStatusHeader';
import { User } from '@/lib/types';

// Custom hook managing QR scan mutations, vibration triggers, and result state
export function useQRScanner() {
    const [scanned, setScanned] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);
    const [actionCompleted, setActionCompleted] = useState(false);
    const [isValidating, setIsValidating] = useState(false);

    const validateMutation = useValidateGatePass();
    const markExitMutation = useMarkExit();
    const markEntryMutation = useMarkEntry();

    const resetScanState = useCallback(() => {
        setScanned(false);
        setScanResult(null);
        setActionCompleted(false);
        setIsValidating(false);
    }, []);

    const handleBarCodeScanned = ({ data }: { data: string }) => {
        if (scanned) return;

        setScanned(true);
        setIsValidating(true);
        Vibration.vibrate(100);

        validateMutation.mutate(data, {
            onSuccess: (result) => {
                setIsValidating(false);
                if (result.valid) {
                    Vibration.vibrate([0, 100, 50, 100]);
                    setScanResult({
                        type: 'success',
                        message: 'Gate Pass Verified! Student may exit.',
                        pass: result.pass,
                        status: result.status,
                    });
                } else if (result.status === 'EXPIRED') {
                    Vibration.vibrate([0, 300, 100, 300]);
                    const isOutside = result.isStudentOutside;
                    setScanResult({
                        type: 'expired',
                        message: isOutside
                            ? 'EXPIRED - Student is still outside and needs to return immediately!'
                            : 'Pass has expired',
                        pass: result.pass,
                        status: 'EXPIRED',
                    });
                } else if (result.status === 'NOT_STARTED') {
                    Vibration.vibrate([0, 200]);
                    setScanResult({
                        type: 'pending',
                        message: result.error || 'Pass not valid yet',
                        pass: result.pass,
                        status: 'NOT_STARTED',
                    });
                } else if (result.status === 'PENDING') {
                    Vibration.vibrate([0, 300]);
                    setScanResult({
                        type: 'pending',
                        message: 'Gate pass is awaiting approval from Warden.',
                        pass: result.pass,
                        status: 'PENDING',
                    });
                } else {
                    Vibration.vibrate([0, 200, 100, 200]);
                    setScanResult({
                        type: 'error',
                        message: result.error || 'Gate pass is not valid for exit',
                        pass: result.pass,
                        status: result.status,
                    });
                }
            },
            onError: (error: any) => {
                setIsValidating(false);
                Vibration.vibrate([0, 500]);
                setScanResult({
                    type: 'invalid',
                    message: error?.response?.data?.error || 'Failed to verify pass',
                });
            },
        });
    };

    const getUserInfo = (passUser: string | User | undefined) => {
        if (typeof passUser === 'object' && passUser) {
            return passUser;
        }
        return null;
    };

    const handleLetOut = () => {
        if (!scanResult?.pass) return;

        markExitMutation.mutate(scanResult.pass._id, {
            onSuccess: () => {
                Vibration.vibrate([0, 100]);
                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                setActionCompleted(true);
                setScanResult({
                    ...scanResult,
                    message: `Exit recorded at ${now}`,
                });
            },
        });
    };

    const handleLetIn = () => {
        if (!scanResult?.pass) return;

        markEntryMutation.mutate(scanResult.pass._id, {
            onSuccess: (data) => {
                Vibration.vibrate([0, 100]);
                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const isLate = data?.isLate || false;
                const lateNote = data?.lateNote || '';

                setActionCompleted(true);
                if (isLate) {
                    setScanResult({
                        type: 'late',
                        message: `Late return at ${now} — ${lateNote}`,
                        pass: scanResult.pass,
                        isLate: true,
                        lateNote: lateNote,
                    });
                } else {
                    setScanResult({
                        ...scanResult,
                        message: `Entry recorded at ${now}. Welcome back!`,
                    });
                }
            },
        });
    };

    const studentInfo = scanResult?.pass ? getUserInfo(scanResult.pass.user) : null;
    const hasExited = Boolean(scanResult?.pass?.exitTime && !scanResult?.pass?.entryTime);
    const isPassExpired = Boolean(scanResult?.pass && hasExited && new Date() > new Date(scanResult.pass.toDate));
    const isPending = markExitMutation.isPending || markEntryMutation.isPending;

    return {
        scanned,
        scanResult,
        actionCompleted,
        isValidating,
        handleBarCodeScanned,
        handleLetOut,
        handleLetIn,
        resetScanState,
        studentInfo,
        hasExited,
        isPassExpired,
        isPending,
    };
}
