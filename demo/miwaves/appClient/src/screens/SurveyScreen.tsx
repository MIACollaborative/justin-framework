
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Image, ScrollView } from 'react-native';
import { PromptCollectionInfo, PromptResponseInfo, ResponseInfo, TabSettingsScreenProps, TabSurveyScreenProps } from "../types/types";
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider } from '@rneui/themed';
import MyPromptResponseBlock from '../components/MyPromptResponseBlock';
import MyPromptCollectionComponent from '../components/MyPromptCollectionComponent';
import GenericScreen from './GenericScreen';

export default function SurveyScreen({ navigation, route }: TabSurveyScreenProps) {
  //const [count, setCount] = React.useState(0);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [value, setValue] = useState(0);

  const [surveyResponseMap, setSurveyResponseMap] = useState({});

  const interpolate = (start: number, end: number) => {
    let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
    return Math.ceil((1 - k) * start + k * end) % 256;
  };

  const color = () => {
    let r = interpolate(255, 0);
    let g = interpolate(0, 255);
    let b = interpolate(0, 0);
    return `rgb(${r},${g},${b})`;
  };

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

  // <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

  /*
  let onePromptResponseInfo: PromptResponseInfo = {
    name: "stress_am",
    prompt: "How stressed are you right now?",
    type: "likert5",
    response: [0, 1, 2, 3, 4],
    responseLabel: ["Not at all", " ", "Somewhat", " ", "A lot"]
  };
  */
  let promptCollectionInfo: PromptCollectionInfo = {
    "name": "am_survey",
    "header": "Good morning! Please answer the following questions and press the arrow in the bottom right corner once you are finished.",
    "messageOnComplete": "Thanks for completing this survey!",
    promptList: [
      {
        name: "suds_am",
        prompt: "How anxious or distressed are you right now? Please choose a value from 0 to 10 using the following anchors:",
        type: "ruler",
        min: 0,
        max: 10,
        step: 1,
        minLabel: "Totally relaxed",
        maxLabel: "The highest anxiety",
        response: [],
        responseLabel: [],
        requiredType: "required"
      },
      {
        name: "survey_window_monday",
        prompt: "On Mondays, what time windows are best for you to complete a brief survey?",
        type: "two-column-multiple-choice",
        requiredType: "optional",
        response: ["6 - 8 am", "7 - 9 am", "8 - 10 am", "9 - 11 am", "10 - 12 pm"],
        responseLabel: ["6 - 8 am", "7 - 9 am", "8 - 10 am", "9 - 11 am", "10 - 12 pm"],
        response2: ["6 - 8 pm", "7 - 9 pm", "8 - 10 pm", "9 - 11 pm", "10 - 12 am"],
        responseLabel2: ["6 - 8 pm", "7 - 9 pm", "8 - 10 pm", "9 - 11 pm", "10 - 12 am"]
      },
      {
        name: "stress_am",
        prompt: "How stressed are you right now?",
        type: "likert5",
        requiredType: "confirmed-to-skip",
        response: [0, 1, 2, 3, 4],
        responseLabel: ["Not at all", " ", "Somewhat", " ", "A lot"]
      },
      {
        name: "drinks_am",
        prompt: "How many drinks containing alcohol did you have yesterday?",
        type: "number-input",
        response: [],
        responseLabel: [],
        requiredType: "required",
      },
      {
        name: "preferred_name",
        prompt: "How should we call you?",
        type: "text-input",
        requiredType: "required",
        response: [],
        responseLabel: []
      },
      
      
      {
        name: "drinks_am",
        prompt: "How many drinks containing alcohol did you have yesterday?",
        type: "number-input",
        response: [],
        responseLabel: [],
        requiredType: "required",
      },
      {
        name: "sleep_am",
        prompt: "In the past 12 hours, what hours were you asleep?",
        type: "hour-input",
        requiredType: "optional",
        response: ["0 - 4 am", "4 - 8 am", "8 am - 12 pm", "12 - 4 pm", "4 - 8 pm", "8 pm - 0 am"],
        responseLabel: ["0 - 4 am", "4 - 8 am", "8 am - 12 pm", "12 - 4 pm", "4 - 8 pm", "8 pm - 0 am"]
      },
      
      {
        name: "rl_am",
        prompt: "Since yesterday evening, did you think about or use any activity or suggestion by MiWaves?",
        type: "multiple-choice",
        response: ["Yes", "No"],
        responseLabel: ["Yes", "No"],
        requiredType: "required",
      },
      {
        name: "reasons_use_am",
        prompt: "What were your reasons for using cannabis? (select all that apply)",
        type: "select-all",
        response: [1, 2, 3, 4, 5, 6, 7],
        responseLabel: ["To enjoy the effects", "To feel less depressed", "To feel less anxious", "To help sleep", "To feel less pain", "Nothing better to do", " "],
        withOther: true,
        otherLabel: "Another reason:",
        requiredType: "required",
      }
    ]
  };
  let promptResponseInfoList = promptCollectionInfo.promptList;

  const onChange = (data: ResponseInfo, index: number) => {
    console.log(`name: ${data["name"]}, value: ${JSON.stringify(data["responseList"], null, 2)}`);

    // update surveyResponseList
    //surveyResponseMap[data.name] = data["response"];



    // display surveyResponseList

  }

  const onSurveyRespondingDone = (responseList: ResponseInfo[]) => {
    console.log(`onSurveyRespondingDone: ${JSON.stringify(responseList, null, 2)}`);
    // should submit the response

  }

  const onSurveyFinish = () => {
    console.log(`onSurveyFinish`);
    // should close the survey
    navigation.navigate('Home');
  }



  return (
    <GenericScreen navigation={navigation} route={route} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <MyPromptCollectionComponent promptCollectionInfo={promptCollectionInfo} onRespondingDone={onSurveyRespondingDone} onFinish={onSurveyFinish} ></MyPromptCollectionComponent>
    </GenericScreen>
  );
}
/*
<ScrollView>
        <Card>
          <Text >Good morning! Please answer the following questions and press the arrow in the bottom right corner once you are finished.</Text>
        </Card>
        {
          promptResponseInfoList.map((promptResponseInfo, index) => {
            return <MyPromptResponseBlock key={index} promptResponseInfo={promptResponseInfo} onChange={onChange}></MyPromptResponseBlock>
          })
        }

        <Button
          title="Home"
          onPress={() => navigation.navigate('Home')}
        />
      </ScrollView>
*/


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