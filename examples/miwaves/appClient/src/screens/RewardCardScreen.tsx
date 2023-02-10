
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { TabHomeScreenProps, TabRewardCardScreenProps } from "../types/types";
import GenericScreen from './GenericScreen';
import { Canvas, Fill, Circle, BlurMask, vec, Image, useImage, Group } from "@shopify/react-native-skia";


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

  //const image = useImage(require("../../assets/icon.png"));
  const size = 256;
  const r = size * 0.33;
  const image = useImage("https://d3c.isr.umich.edu/wp-content/uploads/2022/01/d3c-icon-copy-2.png");

  return (
    <GenericScreen navigation={navigation} route={route} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Canvas style={{ width: 256, height: 256 }}>
      <Group blendMode="multiply">
        <Circle cx={r} cy={r} r={r} color="cyan" />
        <Circle cx={size - r} cy={r} r={r} color="magenta" />
        <Circle
          cx={size/2}
          cy={size - r}
          r={r}
          color="yellow"
        />
      </Group>
    </Canvas>
      <Canvas style={{ width: 256, height: 256 }}>
      {image && (
        <Image
          image={image}
          fit="contain"
          x={0}
          y={0}
          width={256}
          height={256}
        />
      )}
    </Canvas>
    <Text>Reward Card Screen</Text>
      <Canvas style={{ width: 256, height: 256 }}>
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