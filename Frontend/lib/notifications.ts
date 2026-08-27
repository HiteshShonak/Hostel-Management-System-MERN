import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Configure notifications handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotificationsAsync() {
    // Remote push notifications were removed from the Expo Go client in SDK 53+
    // Standalone APK and Development Builds use native FCM and work normally
    if (isExpoGo && Platform.OS === 'android') {
        return undefined;
    }

    let token;

    if (Platform.OS === 'android') {
        // new channel id to force android to register it again
        // this fixes silent notifications
        await Notifications.setNotificationChannelAsync('hms-default-v1', {
            name: 'HMS Notifications',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return undefined;
        }
        try {
            // Get Expo push token
            token = (await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId || 'd0ca44c9-b72a-424f-88e5-ff0c4a1938b1'
            })).data;
        } catch (error) {
            console.warn('Could not register push token:', error);
        }
    }

    return token;
}

export async function scheduleNotification(title: string, body: string, seconds = 1) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data: { data: 'goes here' },
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: seconds,
            channelId: 'hms-default-v1',
        },
    });
}
