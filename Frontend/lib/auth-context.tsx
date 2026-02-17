import React, { createContext, useContext, useEffect, useState } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import { useUser } from './hooks';
import { getToken, saveToken, removeToken } from './api';
import { User } from './types';
import { registerForPushNotificationsAsync } from './notifications';
import { authService } from './services';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    signIn: (token: string) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    signIn: () => { },
    signOut: () => { },
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading: userLoading, error } = useUser();
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const segments = useSegments();
    const navigationState = useRootNavigationState();

    // Check if token exists on mount
    useEffect(() => {
        const checkToken = async () => {
            const token = await getToken();
            setHasToken(!!token);
        };
        checkToken();
    }, []);

    // Register or refresh push token when user is authenticated
    useEffect(() => {
        if (user && hasToken) {
            registerForPushNotificationsAsync()
                .then(pushToken => {
                    if (pushToken) {
                        authService.updatePushToken(pushToken).catch(err => {
                            console.error('Failed to update push token:', err);
                        });
                    }
                })
                .catch(err => {
                    console.error('Failed to register push notifications:', err);
                });
        }
    }, [user, hasToken]);

    const signIn = (token: string) => {
        saveToken(token);
        setHasToken(true);
    };

    const signOut = () => {
        removeToken();
        setHasToken(false);
    };

    // Handle navigation based on auth state
    useEffect(() => {
        if (!navigationState?.key) return; // Wait for navigation to be ready
        if (hasToken === null) return; // Wait for token check

        const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';
        const isAuthenticated = hasToken && (!error || !!user);

        if (!isAuthenticated && !inAuthGroup) {
            // Redirect to login if not authenticated and not already on auth pages
            router.replace('/login');
        } else if (isAuthenticated && inAuthGroup) {
            // Redirect to home if authenticated and on auth pages
            router.replace('/');
        }
    }, [user, error, segments, navigationState?.key, hasToken]);

    const isLoading = userLoading || hasToken === null;
    const isAuthenticated = hasToken === true && !!user && !error;

    return (
        <AuthContext.Provider value={{ user: user || null, isLoading, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}
