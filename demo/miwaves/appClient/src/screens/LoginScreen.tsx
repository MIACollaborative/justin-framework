
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { StackLoginScreenProps } from "../types/types";
import GenericScreen from './GenericScreen';

export default function LoginScreen({ route, navigation }: StackLoginScreenProps) {
  /* 2. Get the param */
  /*
  const { itemId, otherParam } = route.params;
  <Text>itemId: {JSON.stringify(itemId)}</Text>
  <Text>otherParam: {JSON.stringify(otherParam)}</Text>
  */

  return (

    <GenericScreen navigation={navigation} route={route} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <Text></Text>

      <Button
        title="Login"
        onPress={() => {
          navigation.push('TabNavigator');
        }
        }
      />
    </GenericScreen>
  );
}