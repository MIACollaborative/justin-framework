
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { TabHomeScreenProps, TabRewardCardScreenProps } from "../types/types";
import GenericScreen from './GenericScreen';
import { Canvas, Fill, Circle, BlurMask, vec } from "@shopify/react-native-skia";


export default function RewardCardScreen({ navigation, route }: TabRewardCardScreenProps) {
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
      <Text>Reward Card Screen</Text>
      <Canvas style={{ flex: 1 }}>
        <Circle c={vec(128)} r={128} color="lightblue">
          <BlurMask blur={20} style="normal" />
        </Circle>
      </Canvas>

      <Button
        title="home"
        onPress={() => navigation.navigate('Home')}
      />
    </GenericScreen>

  );
}

/*
  <View >
        
  </View>

*/