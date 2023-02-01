
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { TabHomeScreenProps } from "../types/types";
import GenericScreen from './GenericScreen';

export default function HomeScreen({ navigation, route }: TabHomeScreenProps) {
    //const [count, setCount] = React.useState(0);
  
    /*
    React.useEffect(() => {
      // Use `setOptions` to update the button that we previously specified
      // Now the button includes an `onPress` handler to update the count
      navigation.setOptions({
        headerRight: () => (
          <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
        ),
      });
    }, [navigation]);
    React.useEffect(() => {
      if (route.params?.post) {
        // Post updated, do something with `route.params.post`
        // For example, send the post to the server
      }
    }, [route.params?.post]);
    */
  
    // <Text style={{ margin: 10 }}>Post: {route.params?.post}</Text>
    // <Text>Count: {count}</Text>
  
    return (
      <GenericScreen navigation={navigation} route={route} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
        
        <Button
          title="Settings"
          onPress={() => navigation.navigate('Settings')}
        />  
      </GenericScreen>

    );
  }

/*
  <View >
        
  </View>

*/