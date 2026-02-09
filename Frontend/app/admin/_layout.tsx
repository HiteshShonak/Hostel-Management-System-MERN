import { Stack } from 'expo-router';

export default function AdminLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="users" />
            <Stack.Screen name="link-parent" />
            <Stack.Screen name="parent-links" />
        </Stack>
    );
}
