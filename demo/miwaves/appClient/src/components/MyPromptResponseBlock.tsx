
import React, { Fragment, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider } from '@rneui/themed';
import { PromptResponseInfo, ResponseInfo } from '../types/types';
import MySelectButtonWidget from './MySelectButtonWidget';
import MyInputWidget from './MyInputWidget';
import MySliderWidget from './MySliderWidget';
import MyTwoColumnSelectButtonWidget from './MyTwoColumnSelectButtonWidget';


type Props = {
    promptResponseInfo: PromptResponseInfo;
    onChange: Function;
    existingResponseInfo: ResponseInfo;
};

const MyPromptResponseBlock: React.FC<Props> = ({promptResponseInfo, onChange, existingResponseInfo}) => {

    //const [value, setValue] = useState({});
    console.log(`MyPromptResponseBlock: existingResponseInfo: ${JSON.stringify(existingResponseInfo)}`);


    let responseWidget = undefined;

    switch(promptResponseInfo.type){
        case "likert5":
            responseWidget = <MySelectButtonWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="one"></MySelectButtonWidget>;
            break;
        case "multiple-choice":
            responseWidget = <MySelectButtonWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="one"></MySelectButtonWidget>;
            break;
        case "hour-input":
            responseWidget = <MySelectButtonWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="multiple"></MySelectButtonWidget>;
            break;
        case "select-all":
            responseWidget = <MySelectButtonWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="multiple"></MySelectButtonWidget>;
            break;
        // number-input
        case "number-input":
            responseWidget = <MyInputWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="number"></MyInputWidget>;
            break;
        case "text-input":
            responseWidget = <MyInputWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="text"></MyInputWidget>;
            break;
        case "ruler":
            responseWidget = <MySliderWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="number"></MySliderWidget>;
            break;
        case "two-column-multiple-choice":
            responseWidget = <MyTwoColumnSelectButtonWidget promptResponseInfo={promptResponseInfo} existingResponseInfo={existingResponseInfo} onChange={onChange} type="number"></MyTwoColumnSelectButtonWidget>;
            break;
        default:
            break;
    }

    return <Card>
        <Card.Title>{promptResponseInfo.type}</Card.Title>
        <Text h4={true}
        //h1Style={{}}
        //h2Style={{}}
        //h3Style={{}}
        //h4Style={{fontWeight: "800"}}
        //style={{fontWeight: "normal"}}
        >{promptResponseInfo.prompt}</Text>
        <Divider style={{ marginBottom: 20 }} color="#FFFFFF"></Divider>
        <Card.Divider />
        {
            responseWidget
        }
        <Divider style={{ marginBottom: 20 }} color="#FFFFFF"></Divider>
        {
            promptResponseInfo.requiredType == "required" ? <Text>*This requires a response.</Text>: null
        }
        

    </Card>;
}

export default MyPromptResponseBlock;