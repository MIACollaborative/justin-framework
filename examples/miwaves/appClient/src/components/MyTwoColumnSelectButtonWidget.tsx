
import React, { Fragment, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider } from '@rneui/themed';
import { PromptResponseInfo, ResponseInfo, ResponseObject, ResponseWidgetProps } from '../types/types';
import { View } from 'react-native';
import MySelectButtonWidget from './MySelectButtonWidget';

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

const isColumnComplete = (responseObj:ResponseObject) => {
    if( responseObj == undefined){
        console.log(`responseObj == undefined`);
        return false;
    }
    if( responseObj.indexList == undefined){
        console.log(`responseObj.indexList == undefined`);
        return false;
    }
    return responseObj.indexList.length > 0;
}



const MyTwoColumnSelectButtonWidget: React.FC<ResponseWidgetProps> = ({promptResponseInfo, onChange, type="one", existingResponseInfo}) => {

    //const [value, setValue] = useState({});
    /*
    const [indexesL, setIndexesL] = useState<any>(GeneralUtility.isObjectEmpty(existingResponseInfo) || existingResponseInfo.responseList.length > 0 || existingResponseInfo.responseList[0].indexList.length == 0? []: existingResponseInfo.responseList[0].indexList);
    const [valuesL, setValuesL] = useState<any>(GeneralUtility.isObjectEmpty(existingResponseInfo) || existingResponseInfo.responseList.length > 0 || existingResponseInfo.responseList[0].valueList.length == 0? []: existingResponseInfo.responseList[0].valueList);

    const [indexesR, setIndexesR] = useState<any>(GeneralUtility.isObjectEmpty(existingResponseInfo) || existingResponseInfo.responseList.length > 1 || existingResponseInfo.responseList[1].indexList.length == 0? []: existingResponseInfo.responseList[1].indexList);
    const [valuesR, setValuesR] = useState<any>(GeneralUtility.isObjectEmpty(existingResponseInfo) || existingResponseInfo.responseList.length > 1 || existingResponseInfo.responseList[1].valueList.length == 0? []: existingResponseInfo.responseList[1].valueList);
    */


    //const [text, setText] = useState<string>("");

    

    let promptResponseInfoLeft = {...promptResponseInfo};
    delete promptResponseInfoLeft.response2;
    delete promptResponseInfoLeft.responseLabel2;

    let promptResponseInfoRight = {...promptResponseInfo};
    promptResponseInfoRight.response = promptResponseInfoRight.response2 != undefined? promptResponseInfoRight.response2: [];
    promptResponseInfoRight.responseLabel = promptResponseInfoRight.responseLabel2 != undefined? promptResponseInfoRight.responseLabel2: [];
    delete promptResponseInfoRight.response2;
    delete promptResponseInfoRight.responseLabel2;

    let existingResponseInfoLeft: ResponseInfo = {...existingResponseInfo};
    existingResponseInfoLeft.name = `${promptResponseInfo.name}-left`;
    existingResponseInfoLeft.responseList = existingResponseInfoLeft.responseList[0] != undefined? [existingResponseInfoLeft.responseList[0]]:[];
    existingResponseInfoLeft.isComplete = isColumnComplete(existingResponseInfoLeft.responseList[0]);


    let existingResponseInfoRight: ResponseInfo = {...existingResponseInfo};
    existingResponseInfoRight.name = `${promptResponseInfo.name}-right`;
    existingResponseInfoRight.responseList = existingResponseInfoRight.responseList[1] != undefined? [existingResponseInfoRight.responseList[1]]:[];
    existingResponseInfoRight.isComplete = isColumnComplete(existingResponseInfoRight.responseList[0]);

    
    const [responseObjL, setResponseObjL] = useState<any>(existingResponseInfoLeft.responseList[0]);
    const [responseObjR, setResponseObjR] = useState<any>(existingResponseInfoRight.responseList[0]);


    const myOnChange = (data: ResponseInfo, side:string) => {
        console.log(`myOnChange[${side}]: ${JSON.stringify(data, null, 2)}`);

        let dataObj:ResponseObject = data.responseList[0];

        let isComplete = false;

        let updateList = [responseObjL, responseObjR];

        if( side == "left"){
            setResponseObjL(dataObj);
            // updatedPair.left = data;
            updateList[0] = dataObj;

            if(responseObjR != undefined){
                isComplete = true;
            }            
        }
        else{
            setResponseObjR(dataObj);
            // updatedPair.right = data;
            updateList[1] = dataObj;
            if(responseObjL != undefined){
                isComplete = true;
            }
        }

        
        
        onChange({
            name: promptResponseInfo.name,
            responseList: updateList,
        }, 0, {isComplete: isComplete});


    };

    /*
    {
        name: "survey_window_am",
        prompt: "On Mondays, what time windows are best for you to complete a brief survey?",
        type: "two-column-multiple-choice",
        response: ["6 - 8 am", "7 - 9 am", "8 - 10 am", "9 - 11 am", "10 - 12 pm"],
        responseLabel: ["6 - 8 am", "7 - 9 am", "8 - 10 am", "9 - 11 am", "10 - 12 pm"],
        response2: ["6 - 8 pm", "7 - 9 pm", "8 - 10 pm", "9 - 11 pm", "10 - 12 am"],
        responseLabel2: ["6 - 8 pm", "7 - 9 pm", "8 - 10 pm", "9 - 11 pm", "10 - 12 am"]
    },
    */

    /*
    onChange({
        name: promptResponseInfo.name,
        response: responseObj
    }, index, {isComplete: true});
    */
    
    return <Fragment>
        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1}}>
            <View>
                <Text>AM</Text>
                <MySelectButtonWidget promptResponseInfo={promptResponseInfoLeft} existingResponseInfo={existingResponseInfoLeft} onChange={(data: ResponseInfo, index: number, metaInfo: {isComplete:boolean}) => {
                    myOnChange(data, "left");
                    //onChange();

                }} type="one"></MySelectButtonWidget>
            </View>
            <Divider style={{ marginLeft: 20, marginRight: 20 }} color="#FFFFFF"></Divider>
            <View>
                <Text>PM</Text>
                <MySelectButtonWidget promptResponseInfo={promptResponseInfoRight} existingResponseInfo={existingResponseInfoRight} onChange={(data: ResponseInfo, index: number, metaInfo: {isComplete:boolean}) => {

                    myOnChange(data, "right");

                    //onChange();
                    
                }} type="one"></MySelectButtonWidget>
            </View>
        </View>
    </Fragment>;
}

export default MyTwoColumnSelectButtonWidget;