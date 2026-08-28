import { useEffect, useRef } from 'react';
import { BackHandler, ToastAndroid, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';

/**
 * Configuration options for Android back button handling.
 */
export interface UseBackHandlerOptions {
    /** Time window in milliseconds to confirm exit (default: 2000ms) */
    exitThresholdMs?: number;
    /** Message to display when user presses back on root (default: 'Press back again to exit') */
    exitMessage?: string;
}

/**
 * Custom hook to manage Android hardware back button actions.
 * 
 * - If in a nested screen with history, pops back safely.
 * - If in a top-level tab/screen without history, navigates back to root ('/').
 * - If on root dashboard ('/'), requires double back press within threshold to exit.
 * - Completely prevents 'GO_BACK was not handled by any navigator' warnings.
 */
export function useBackHandler(options: UseBackHandlerOptions = {}) {
    const {
        exitThresholdMs = 2000,
        exitMessage = 'Press back again to exit',
    } = options;

    const router = useRouter();
    const pathname = usePathname();
    const lastBackPressTimeRef = useRef<number>(0);

    useEffect(() => {
        const onHardwareBackPress = (): boolean => {
            // 1. If navigator has a previous screen in stack, pop it
            if (router.canGoBack()) {
                router.back();
                return true;
            }

            // 2. If user is on a top-level subpage (not root dashboard), navigate to root
            const isRoot = pathname === '/' || pathname === '' || pathname === '/index';
            if (!isRoot) {
                router.replace('/');
                return true;
            }

            // 3. User is on root dashboard: check double-press window
            const now = Date.now();
            const timeSinceLastPress = now - lastBackPressTimeRef.current;

            if (timeSinceLastPress < exitThresholdMs) {
                // Exit app cleanly on second press within time window
                BackHandler.exitApp();
                return true;
            }

            // First press on root: record timestamp and display message
            lastBackPressTimeRef.current = now;
            if (Platform.OS === 'android') {
                ToastAndroid.show(exitMessage, ToastAndroid.SHORT);
            }
            return true;
        };

        const backSubscription = BackHandler.addEventListener(
            'hardwareBackPress',
            onHardwareBackPress
        );

        return () => {
            backSubscription.remove();
        };
    }, [router, pathname, exitThresholdMs, exitMessage]);
}
