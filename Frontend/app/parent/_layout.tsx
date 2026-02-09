import { Stack } from 'expo-router';

export default function ParentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="children" />
            <Stack.Screen name="pending-passes" />
            <Stack.Screen name="today-attendance" />
            <Stack.Screen name="pass-history" />
            <Stack.Screen name="attendance-history" />
        </Stack>
    );
}
