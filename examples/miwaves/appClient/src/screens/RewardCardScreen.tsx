
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ScrollView,TextInput } from 'react-native';
import { TabHomeScreenProps, TabRewardCardScreenProps } from "../types/types";
import GenericScreen from './GenericScreen';
import {
  Canvas, Fill, Circle, BlurMask, vec, Image, useImage, Group, Mask, Rect, useTouchHandler,
  useValue
} from "@shopify/react-native-skia";
import MyImage from '../components/MyImage';
import MyPDFReader from "../components/MyPDFReader";

import { Video, AVPlaybackStatus, ResizeMode } from 'expo-av';

interface Coordinate {
  x: number;
  y: number;
}

export default function RewardCardScreen({ navigation, route }: TabRewardCardScreenProps) {
  const cx = useValue(100);
  const cy = useValue(100);

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  let [paintDropList, setPaintDropList] = useState<Array<Coordinate>>([]);

  const touchHandler = useTouchHandler({
    onActive: ({ x, y }) => {
      console.log(`onActive: ${x},${y}`);
      let newList = [...paintDropList];
      newList.push({
        x: x,
        y: y
      });
      setPaintDropList(newList);
      console.log(`onActive: list.legnth: ${newList.length}`);


      cx.current = x;
      cy.current = y;



    },
  });



  const size = 256;
  const r = size * 0.33;
  
  //const image = useImage("https://www.travelandleisure.com/thmb/qEhmGkCAQF4oO5TgIjJZozVdjdM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/university-michigan-library-UMICH0217-189e251b1e9b4f1a9a644a200776a3d2.jpg");

  // https://walktojoy.info/image/gif/dancing-bear-7.gif
  const image = useImage("https://walktojoy.info/image/gif/dancing-bear-7.gif");


  // <MyImage source={"https://walktojoy.info/image/gif/dancing-bear-7.gif"}></MyImage>

  console.log(`paintDropList.length: ${paintDropList.length}`);

  return (
    <GenericScreen navigation={navigation} route={route} style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Reward Card Screen</Text>
      <MyPDFReader width={"100%"} height={640} src={"https://drive.google.com/file/d/1bKoULnH1FVbPbcD30YN6jb1dDweGVzqA/view?usp=share_link"}></MyPDFReader>
      <ScrollView >
      <Canvas style={{ width: 256, height: 256 }} onTouch={touchHandler}>
        <Mask
          mode="alpha"
          mask={
            <Group>
              {
                paintDropList.map(

                  (item, index) => {
                    const { x, y }: Coordinate = item;

                    return <Circle key={index} cx={x} cy={y} r={50} color="red" />;
                  }

                )
              }

            </Group>
          }
        >
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
        </Mask>

      </Canvas>
      

      </ScrollView>
      <Button
        title="home"
        onPress={() => navigation.navigate('Home')}
      />
      
    </GenericScreen>

  );
}
// https://www.dropbox.com/s/rlwheybjkfecka6/MiWavesInstructionMockup.pdf?dl=0

// "https://www.youtube.com/watch?v=0u8lwD2bBfc"
// https://peiyaoh.github.io/files/Hung_Pei-Yao_Resume.pdf

/*
      <Video
        ref={video}
        style={{ width: 360, height: 270 }}
        source={{
          uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
        }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <MyImage src={"https://walktojoy.info/image/gif/dancing-bear-7.gif"}></MyImage>

      

      <Canvas style={{ width: 256, height: 256 }}>
        <Group blendMode="multiply">
          <Circle cx={r} cy={r} r={r} color="cyan" />
          <Circle cx={size - r} cy={r} r={r} color="magenta" />
          <Circle
            cx={size / 2}
            cy={size - r}
            r={r}
            color="yellow"
          />
        </Group>
      </Canvas>

*/


