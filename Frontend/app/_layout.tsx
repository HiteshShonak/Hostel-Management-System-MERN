import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// Create a client with gold-level configuration
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Default stale time - 5 minutes for most data
            staleTime: 1000 * 60 * 5,
            // Garbage collection time - 30 minutes
            gcTime: 1000 * 60 * 30,
            // Retry failed queries once with exponential backoff
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Don't refetch on reconnect by default (let staleTime handle it)
            refetchOnReconnect: 'always',
            // Keep previous data while refetching for smooth UX
            placeholderData: (previousData: unknown) => previousData,
            // Network mode - always try to fetch unless offline
            networkMode: 'online',
        },
        mutations: {
            // Retry mutations once
            retry: 1,
            // Network mode for mutations
            networkMode: 'online',
        },
    },
});

function RootLayoutContent() {
    const { isDark, colors } = useTheme();
    const statusBarBg = isDark ? '#1e293b' : '#1d4ed8';

    return (
        <SafeAreaProvider>
            <SafeAreaView style={[styles.container, { backgroundColor: statusBarBg }]} edges={['top']}>
                <StatusBar style="light" backgroundColor={statusBarBg} />
                <View style={[styles.content, { backgroundColor: colors.background }]}>
                    <ErrorBoundary>
                        <Slot />
                    </ErrorBoundary>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider>
                    <RootLayoutContent />
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
