import React, { Fragment, useState } from 'react';
import { Image } from 'react-native';
//import { Image } from 'expo-image';
import { StyleSheet, View, Platform  } from 'react-native';
import { WebView } from 'react-native-webview';
import { MyImageProps } from '../types/types';

const MyPDFReader: React.FC<MyImageProps> = ({src}) =>  {

    return (
      <WebView
          style={styles.webview}
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
    webview: {
        //flex: 1,
        width: '100%',
        height: 420
    },
    image: {
      flex: 1,
      width: '100%',
      backgroundColor: '#0553',
    },
  });

  export default MyPDFReader;