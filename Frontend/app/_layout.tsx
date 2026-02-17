import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// setting up the query client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // keep data fresh for 5 mins
            staleTime: 1000 * 60 * 5,
            // cleanup garbage after 30 mins
            gcTime: 1000 * 60 * 30,
            // try one more time if it fails
            retry: 1,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // refresh when user comes back to app
            refetchOnWindowFocus: true,
            // always try to reconnect
            refetchOnReconnect: 'always',
            // keep old data showing while loading new stuff
            placeholderData: (previousData: unknown) => previousData,
            // stay online
            networkMode: 'online',
        },
        mutations: {
            // retry once for actions too
            retry: 1,
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
