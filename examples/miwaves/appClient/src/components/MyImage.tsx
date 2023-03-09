import React, { Fragment, useState } from 'react';
import { Image } from 'react-native';
//import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { MyImageProps } from '../types/types';

const MyImage: React.FC<MyImageProps> = ({src}) =>  {
    const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  

    return (
      <Image
          style={{ width: 250, height: 250 }}
          source={{
            uri: src,
          }}
      />
  );
    
      /*
    return (
        <Image
        style={styles.image}
        source="https://walktojoy.info/image/gif/dancing-bear-7.gif"
        placeholder={blurhash}
        contentFit="cover"
        transition={1000}
      />
    );
    */
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: '#0553',
    },
  });

  export default MyImage;