import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import { StackParamList } from "../types/types";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppStack() {
    
    return (
        <Stack.Navigator id='MyStack' initialRouteName="Login" screenOptions={{
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              //initialParams={{ itemId: 42 }}
            />
            <Stack.Screen name="TabNavigator" component={TabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
    );
  }