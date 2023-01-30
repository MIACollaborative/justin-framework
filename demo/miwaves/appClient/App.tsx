
//import * as React from 'react';
import AppNav from './src/navigation/AppNav';
import React, {useRef, useState, useEffect} from 'react';
import {AppState, StyleSheet, Text, View, Button, Platform, TouchableOpacity } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import {DateTime} from "luxon";

import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import * as Location from 'expo-location';
import { Accelerometer } from 'expo-sensors';

// for background
import { NotificationCategory } from 'expo-notifications';
import { Subscription } from 'expo-sensors/build/Pedometer';

// for demo purposes
let counter = 0;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const LOCATION_TASK_NAME = 'background-location-task';
const requestPermissions = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === 'granted') {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.Balanced,
    });
  }
};
// for background

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: {locations:Object}, error }):void => {

  if (error) {
    // Error occurred - check `error.message` for more details.
    return;
  }
  
  if (data) {
    //const { locations } = data;

    let locations = data["locations"];

    console.log(locations);
    //let locations = (data:{locations:Object}).locations;
    // do something with the locations captured in the background
    console.log(`Background location[${counter++}]`);
  }
});


const APP_STATE_REPORT_TASK = 'app-state-report-task';

const intervalID = setInterval(reportStatus, 10 * 1000);

function reportStatus()
{
 // Your code here
 // Parameters are purely optional.
 console.log(`[${DateTime.now().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}] reportStatus: ${AppState.currentState}`);
}

TaskManager.defineTask(APP_STATE_REPORT_TASK, async () => {
  // get the app state and print it
  console.log(`${APP_STATE_REPORT_TASK}: ${AppState.currentState}`);
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function registerBackgroundFetchAsync() {
  console.log(`registerBackgroundFetchAsync`);
  return BackgroundFetch.registerTaskAsync(APP_STATE_REPORT_TASK, {
    minimumInterval: 1, //60 * 10, // 10 minutes
    stopOnTerminate: true, //false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  console.log(`unregisterBackgroundFetchAsync`);
  return BackgroundFetch.unregisterTaskAsync(APP_STATE_REPORT_TASK);
}

export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [notificationCategory, setNotificationCategory] = useState<NotificationCategory | undefined>(undefined);
  const notificationListener = useRef<Subscription | undefined>(undefined);
  const responseListener = useRef<Subscription | undefined>(undefined);

  // location
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // accelerometer
  const [data, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    console.log(`useEffect - notification`);
    registerForPushNotificationsAsync().then((token: string | undefined) => {setExpoPushToken(token)});

    Notifications.setNotificationCategoryAsync("notification", [
      {
        identifier: "a",
        buttonTitle: "1"
      },
      {
        identifier: "b",
        buttonTitle: "2"
      },
      {
        identifier: "c",
        buttonTitle: "3"
      }
    ]).then((nCategory:NotificationCategory) => {
      console.log(`setNotificationCategoryAsync.then: ${JSON.stringify(nCategory)}`);
      setNotificationCategory(nCategory);
    });



    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notificationX: Notifications.Notification) => {
      setNotification(notificationX);

      console.log(`notification received: ${JSON.stringify(notificationX, null, 2)}`);
    });



    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(`NotificationResponse: ${response}`);
    });

    return () => {
      console.log(`Clean up`);
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);


  // location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      
      setLocation(location);
    })();
  }, []);

  // background
  useEffect(() => {
    requestPermissions();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  // accelerometer
  const _slow = () => {
    Accelerometer.setUpdateInterval(1000);
  };

  const _fast = () => {
    Accelerometer.setUpdateInterval(16);
  };

  const _subscribe = () => {
    setSubscription(
      Accelerometer.addListener(accelerometerData => {
        setData(accelerometerData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const { x, y, z } = data;

  
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  React.useEffect(() => {
    checkStatusAsync();
  }, []);

  const checkStatusAsync = async () => {
    console.log(`checkStatusAsync: ${DateTime.now().toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS)}`);
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(APP_STATE_REPORT_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
    console.log(`checkStatusAsync: status: ${status}, isRegistered: ${isRegistered}`);
  };

  const toggleFetchTask = async () => {
    console.log(`toggleFetchTask`);
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };
  

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('nextAppState: ', nextAppState);

      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState: ', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('memoryWarning', () => {
      console.log('Device running out of memory!');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <AppNav></AppNav>
  );
}

function round(n) {
  if (!n) {
    return 0;
  }
  return Math.floor(n * 100) / 100;
}

// Can use this function below, OR use Expo's Push Notification Tool-> https://expo.dev/notifications
async function sendPushNotification(expoPushToken: string) {
  console.log(`sendPushNotification`);
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
    categoryId: "notification"
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {
  console.log(`registerForPushNotificationsAsync`);
  let token: string | undefined;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/