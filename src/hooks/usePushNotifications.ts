import { useState, useEffect, useRef } from 'react'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Contants from 'expo-constants';
import { Platform } from 'react-native';
import { useUtilState } from '../states/util';
import * as SecureStore from 'expo-secure-store';
import { useDetailsState } from '../states/userState';
import { useMutation } from 'react-query';
import httpService from '../utils/httpService';
import { URLS } from '../services/urls';
import { PaginatedResponse } from '../models/PaginatedResponse';
import { CUSTOM_STATUS_CODE } from '../enums/CustomCodes';
export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken,
    notification?: Notifications.Notification
}

export const usePushNotification = (): PushNotificationState => {
    // check if the user is loged in b4 asking
    const { isLoggedIn } = useUtilState((state) => state);
    const { id } = useDetailsState((state) => state);

    const { mutate } = useMutation({
        mutationFn: (data: { userId: number, token: string}) => httpService.post(`${URLS.SEND_PUSH_NOTIFICATION_TOKEN}`, data),
        onSuccess: (data) => {
            const item: PaginatedResponse<any> = data.data;
            if (item.code == CUSTOM_STATUS_CODE.SUCCESS) {
                //alert(JSON.stringify(item.data));
            }
        }
    })

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldShowAlert: true,
            shouldSetBadge: false,
        })
    });

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>();
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    const notiticationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    async function registerFoPushNotifications() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                //alert('Failed to get push token for push notification!');
                return;
            }
            token = await Notifications.getExpoPushTokenAsync({
                projectId: Contants.expoConfig?.extra?.eas.projectId
            });
            setExpoPushToken(token);
            // make api request
        } else {
            alert('Must use physical device for Push Notifications');
            return;
        }

        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        SecureStore.setItemAsync('expoPushToken', token.data);
        mutate({ userId: id, token: token.data });
        return token;
    }

    useEffect(() => {

        (async function () {
            const token = await SecureStore.getItemAsync('expoPushToken');
            // await SecureStore.deleteItemAsync('expoPushToken');
            
            if (isLoggedIn && !token) {
                alert(token ? token : 'no token');
                registerFoPushNotifications().then(token => setExpoPushToken(token));
                notiticationListener.current = Notifications.addNotificationReceivedListener(notification => {
                    setNotification(notification);
                });

                responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                    console.log(response);
                });
            }
        })()

        return () => {
            Notifications.removeNotificationSubscription(notiticationListener.current!);
            Notifications.removeNotificationSubscription(responseListener.current!);
        }
    }, []);

    return {
        expoPushToken,
        notification
    }
}