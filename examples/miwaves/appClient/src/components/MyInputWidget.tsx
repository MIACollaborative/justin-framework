
import React, { Fragment, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider } from '@rneui/themed';
import { PromptResponseInfo, ResponseInfo, ResponseWidgetProps } from '../types/types';
import voca from 'voca';
import GeneralUtility from '../utilities/GeneralUtility';

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

const MyInputWidget: React.FC<ResponseWidgetProps> = ({promptResponseInfo, onChange, type="text", existingResponseInfo}) => {

    //const [value, setValue] = useState({});
    //const [indexes, setIndexes] = useState<any>([]);
    //const [values, setValues] = useState<any>([]);
    console.log(`MyInputWidget: existingResponseInfo: ${JSON.stringify(existingResponseInfo)}`);

    const [text, setText] = useState<string>(existingResponseInfo == undefined || GeneralUtility.isObjectEmpty(existingResponseInfo) || existingResponseInfo.responseList.length <= 0 || existingResponseInfo.responseList[0].valueList.length == 0? "": `${existingResponseInfo.responseList[0].valueList[0]}`);


    const myOnChange = (newIndexes: number[], index: number, newText: string) => {

        let responseObj = {
            indexList: newIndexes,
            valueList: [type=="number"? Number(newText): newText],
            labelList: [""],
            extraList: []
        };

        let isComplete = false;

        switch(type){
            case "text":
                isComplete = newText.length > 0;
                break;
            case "number":
                isComplete = voca.isNumeric(newText);
                break;
            default:
                break;
        }

        onChange({
            name: promptResponseInfo.name,
            responseList: [responseObj]
        }, index, {isComplete: isComplete});
    };

    return <Fragment>
        <Input
        defaultValue={text}
        //placeholder={promptResponseInfo.otherLabel}
        onChangeText={(newText) => {
            // this.setState({ comment: value })
            setText(newText);
            console.log(`type: ${type}`);
            console.log(`voca.isNumeric(newText): ${voca.isNumeric(newText)}`);
            
            myOnChange([0], 0, newText);
        }}
        renderErrorMessage={true}
        errorStyle={{ color: 'red' }}
        errorMessage={type == "number" && !voca.isNumeric(text)? 'Enter a valid number': ""}
        />
    </Fragment>;
}

export default MyInputWidget;