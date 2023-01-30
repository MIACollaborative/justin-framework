import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { StackTabNavigatorScreenProps, TabParamList } from "../types/types";
import Ionicons from '@expo/vector-icons/Ionicons';
import SurveyScreen from "../screens/SurveyScreen";
const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator({ navigation, route }: StackTabNavigatorScreenProps) {
  return (
    <Tab.Navigator
    id='MyTab'
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {

        let iconName: 'ios-information-circle' | 'ios-information-circle-outline' | 'ios-list' | 'ios-list-outline' | undefined;

        if (route.name === 'Home') {
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        }
        else if (route.name === 'Survey') {
          iconName = focused ? 'ios-list' : 'ios-list-outline';
        } 
        else if (route.name === 'Settings') {
          iconName = focused ? 'ios-list' : 'ios-list-outline';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
    >
      <Tab.Screen name="Home" component={HomeScreen}
          /*
          options={({ navigation, route }) => ({
            headerTitle: (props) => <LogoTitle />, //<LogoTitle {...props} />
            // Add a placeholder button without the `onPress` to avoid flicker
            headerRight: () => (
              <Button title="Update count" />
            ),
          })}
          */
        />
        <Tab.Screen name="Survey" component={SurveyScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen}
        /*
          options={({ navigation, route }) => ({
            headerTitle: (props) => <LogoTitle />, //<LogoTitle {...props} />
            // Add a placeholder button without the `onPress` to avoid flicker
            headerRight: () => (
              <Button title="Update count" />
            ),
          })}
        */
        />
      
    </Tab.Navigator>
  );
}