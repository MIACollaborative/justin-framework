
import React, { Fragment, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider } from '@rneui/themed';
import { PromptResponseInfo, ResponseWidgetProps } from '../types/types';
import voca from 'voca';
import { View } from 'react-native';


const isValueInList = (value:any, list:any[]) => {
    let result = false;

    for(let i = 0; i < list.length; i++){
        if( value == list[i]){
            result = true;
            break;
        }
    }


    return result;
}

const MySliderWidget: React.FC<ResponseWidgetProps> = ({promptResponseInfo, onChange, type="number", existingResponseInfo}) => {

    console.log(`MySliderWidget: existingResponseInfo: ${JSON.stringify(existingResponseInfo)}`);

    const [value, setValue] = useState<number>(!existingResponseInfo.hasOwnProperty("responseList") || existingResponseInfo.responseList.length == 0 || existingResponseInfo.responseList[0].valueList.length == 0? 0: existingResponseInfo.responseList[0].valueList[0]);

    console.log(`MySliderWidget: value: ${value}`);

    const interpolate = (start: number, end: number) => {
      //let k = (value - 0) / 10; // 0 =>min  && 10 => MAX
      let k = 0;
      return Math.ceil((1 - k) * start + k * end) % 256;
    };
    
    
    const color = () => {
      let r = interpolate(255, 0);
      let g = interpolate(0, 255);
      let b = interpolate(0, 0);
      return `rgb(${r},${g},${b})`;
    };


    const myOnChange = (newIndexes: number[], index: number, newValue: number) => {

        let responseObj = {
            indexList: newIndexes,
            valueList: [newValue],
            labelList: [""],
            extraList: []
        };
        
        onChange({
            name: promptResponseInfo.name,
            responseList: [responseObj]
        }, index, {isComplete: true});
    };

    /*
    "min": 0,
      "max": 10,
      "step": 1,
      "minLabel": "Totally relaxed, on the verge of sleep",
      "maxLabel": "The highest anxiety you have ever experienced"
    */

    return <Fragment>
       <Text style={{ paddingTop: 20 }}>Value: {value}</Text>
       <Divider style={{ marginBottom: 20 }} color="#FFFFFF"></Divider>
        <Slider
            value={value}
            onValueChange={(newValue) => {
              // this.setState({ comment: value })
              setValue(newValue);
              myOnChange([0], 0, newValue);
          }}
            maximumValue={promptResponseInfo.max}
            minimumValue={promptResponseInfo.min}
            step={promptResponseInfo.step}

            allowTouchTrack
            trackStyle={{ height: 5, backgroundColor: 'transparent' }}
            thumbStyle={{ height: 20, width: 20, backgroundColor: 'transparent' }}
            
            thumbProps={{
              children: (
                <Icon
                  name="circle"
                  type="font-awesome"
                  size={20}
                  reverse
                  containerStyle={{ bottom: 20, right: 20 }}
                  color={"#2089DC"}
                />
              ),
            }}
            
          />
          <Divider style={{ marginBottom: 20 }} color="#FFFFFF"></Divider>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1}}>
            <Text>{promptResponseInfo.minLabel}</Text>
            <Text>{promptResponseInfo.maxLabel}</Text>
          </View>
          <Divider style={{ marginLeft: 20, marginRight: 20 }} color="#FFFFFF"></Divider>
          
    </Fragment>;
}

export default MySliderWidget;