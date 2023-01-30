
//import * as React from 'react';
import AppNav from './src/navigation/AppNav';
import React, {useRef, useState, useEffect} from 'react';
import {AppState, StyleSheet, Text, View} from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import {DateTime} from "luxon";

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