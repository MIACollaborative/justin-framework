
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native';
import { PromptCollectionInfo, PromptResponseInfo, ResponseInfo, TabSettingsScreenProps, TabSurveyScreenProps } from "../types/types";
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider } from '@rneui/themed';
import MyPromptResponseBlock from '../components/MyPromptResponseBlock';
import MyPromptCollectionComponent from '../components/MyPromptCollectionComponent';

export default function GenericScreen(props: any) {
  console.log(`GenericScreen.start children: ${props.children}`);

  // navigation={navigation} route={route}

  const {navigation, route,style} = props;

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log(`GenericScreen.focus: ${JSON.stringify(route)}`);
    });

    return unsubscribe;
  }, [props.navigation]);

  
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      console.log(`GenericScreen.beforeRemove: ${JSON.stringify(route)}`);
    });

    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', () => {
      console.log(`GenericScreen.blur: ${JSON.stringify(route)}`);
    });

    return unsubscribe;
  }, [props.navigation]);
  

  useEffect(() => {
    function handleStatusChange(status: string) {
        console.log(`GenericScreen.useEffect: handleStatusChange: ${status}`);
    }

    handleStatusChange(`(screen rendered)`);

    return function cleanup() {
        console.log(`GenericScreen.useEffect: cleanup`);
        handleStatusChange(`GenericScreen.useEffect: end`);
    };
});


// style={style}

  return (
    <View style={{flex: 1}} >
      {props.children}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fonts: {
    marginBottom: 8,
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  image: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
});