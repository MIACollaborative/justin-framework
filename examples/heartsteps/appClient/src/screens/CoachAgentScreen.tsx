import { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function CoachAgentScreen() {
  const [currOptions, setCurrOptions] = useState<string[]>(['A', 'B']);
  // const [nextButtons, setNextButtons] = useState<string[]>([]);

  const displayCurrButtons = (selectedOptions: string[]) => {
    console.log('selectedOptions', selectedOptions);
    let returnVal: any[] = [];
    if (selectedOptions.includes('A')) {
      console.log('includes A');
      returnVal.push(
        <Button title="Option X" onPress={() => updateOptions('X', 'A')} />
      );
    }
    if (selectedOptions.includes('B')) {
      console.log('includes B');
      returnVal.push(
        <Button title="Option Y" onPress={() => updateOptions('Y', 'B')} />
      );
    }
    if (selectedOptions.includes('X')) {
      returnVal.push(
        <Button title="Option A" onPress={() => updateOptions('A', 'X')} />
      );
    }
    if (selectedOptions.includes('Y')) {
      returnVal.push(
        <Button title="Option B" onPress={() => updateOptions('B', 'Y')} />
      );
    }
    return returnVal;
  };

  // TODO: make parameters type string[] to add/remove multiple buttons
  const updateOptions = (newOption: string, optionToRemove?: string) => {
    let updatedOpts = currOptions;
    updatedOpts = [...updatedOpts, newOption];
    if (optionToRemove) {
      let index = updatedOpts.indexOf(optionToRemove);
      if (index !== -1) {
        updatedOpts.splice(index, 1);
      }
    }
    setCurrOptions(updatedOpts);
  };

  // useEffect(() => {
  //   setCurrOptions(['A', 'B']);
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coach Agent</Text>
      {/* <Button title="Option A" onPress={handleOptionA} /> */}
      {/* <Button title="Option B" onPress={handleOptionB} /> */}
      {displayCurrButtons(currOptions)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%'
  }
});
