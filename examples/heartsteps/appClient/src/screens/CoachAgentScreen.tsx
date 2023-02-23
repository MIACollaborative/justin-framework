import { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

export default function CoachAgentScreen() {
  const [nextButtons, setNextButtons] = useState<string[]>([]);

  const handleOptionA = () => {
    console.log('option A selected');
    console.log('return X');
    return 'X';
  };

  const handleOptionB = () => {
    console.log('option B selected');
    console.log('return Y');
  };

  const handleOptionX = () => {
    console.log('option X selected');
    console.log('return A');
    return 'A';
  };

  const handleOptionY = () => {
    console.log('option Y selected');
    console.log('return B');
    return 'B';
  };

  const displayButton = (selectedOptions: string[]) => {
    console.log('selectedOptions', selectedOptions);
    if (selectedOptions.includes('A')) {
      console.log('includes A');
      return <Button title="Option X" onPress={handleOptionX} />;
    }
    if (selectedOptions.includes('B')) {
      console.log('includes B');
      return <Button title="Option Y" onPress={handleOptionY} />;
    }
    if (selectedOptions.includes('X')) {
      return <Button title="Option A" onPress={handleOptionA} />;
    }
    if (selectedOptions.includes('Y')) {
      return <Button title="Option B" onPress={handleOptionB} />;
    }
  };

  useEffect(() => {
    setNextButtons(['A', 'B']);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coach Agent</Text>
      {/* <Button title="Option A" onPress={handleOptionA} /> */}
      {/* <Button title="Option B" onPress={handleOptionB} /> */}
      {displayButton(nextButtons)}
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
