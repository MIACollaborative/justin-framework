
import React, { Fragment, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider } from '@rneui/themed';
import { PromptResponseInfo, ResponseWidgetProps } from '../types/types';

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

const MySelectButtonWidget: React.FC<ResponseWidgetProps> = ({promptResponseInfo, onChange, type="one", existingResponseInfo}) => {

    console.log(`MySelectButtonWidget.existingResponseInfo: ${JSON.stringify(existingResponseInfo, null, 2)}`);
    //const [value, setValue] = useState({});
    const [indexes, setIndexes] = useState<any>( !existingResponseInfo.hasOwnProperty("responseList") || existingResponseInfo.responseList.length == 0 || existingResponseInfo.responseList[0].indexList.length == 0? []: existingResponseInfo.responseList[0].indexList);

    const [values, setValues] = useState<any>(!existingResponseInfo.hasOwnProperty("responseList") || existingResponseInfo.responseList.length == 0 || existingResponseInfo.responseList[0].valueList.length == 0? []: existingResponseInfo.responseList[0].valueList);

    const [text, setText] = useState<string>(
        
        promptResponseInfo["withOther"] == false || !existingResponseInfo.hasOwnProperty("responseList") || existingResponseInfo.responseList.length == 0 || existingResponseInfo.responseList[0].extraList.length == 0? "": existingResponseInfo.responseList[0].extraList[0]);

    let responses: any[] = [];
    for (let i = 0; i < promptResponseInfo.response.length; i++) {
        let value = promptResponseInfo.response[i];
        let label = promptResponseInfo.responseLabel[i];
        responses.push({
            value,
            label
        });
    }

    const myOnChange = (newIndexes: number[], index: number, newText: string) => {

        let responseObj = {
            indexList: newIndexes.sort(),
            valueList: newIndexes.map((myIndex) => {
                return responses[myIndex]["value"]; 
            }),
            labelList: newIndexes.map((myIndex) => {
                return responses[myIndex]["label"]; 
            }),
            extraList: promptResponseInfo["withOther"] && isValueInList(index, newIndexes)? [newText]: []
        };
        
        onChange({
            name: promptResponseInfo.name,
            responseList: [responseObj]
        }, index, {isComplete: true});
    };


    



    return <Fragment>
        {
            responses.map((responseInfo, index) => {
                return <Fragment key={index}>
                    <Button
                        onPress={(event) => { 
                            let newValues:any[] = [];
                            let newIndexes:number[] = [];

                            switch(type){
                                case "one":
                                    newValues = [responseInfo.value];
                                    setValues(newValues);
                                    newIndexes = [index];
                                    setIndexes(newIndexes);
                                    break;
                                case "multiple":
                                    if(!isValueInList(index, indexes)){
                                        newValues = [...values, responseInfo.value];
                                        setValues(newValues);
                                        newIndexes = [...indexes, index];
                                        setIndexes(newIndexes);
                                    }
                                    else{
                                        // well, then we are deselecting
                                        newValues = [...values];
                                        newValues = newValues.filter((value) => {return value != responseInfo.value;});
                                        newIndexes = [...indexes];
                                        newIndexes = newIndexes.filter((value) => {return value != index;});
                                        setValues(newValues);
                                        setIndexes(newIndexes);
                                    }
                                    break;
                                default:
                                    break;
                            }

                            if(!isValueInList(index, newIndexes)){
                                setText("");
                            }

                            myOnChange(newIndexes, index, text);
                    
                        }}
                        title={promptResponseInfo["withOther"] && index == responses.length - 1? promptResponseInfo.otherLabel:responseInfo.label}

                        // string | primary | secondary | success | warning | error
                        // "#841584"
                        color={isValueInList(responseInfo.value, values)? "success": "primary"}
                        accessibilityLabel="Learn more about this purple button"
                    />
                    {
                        promptResponseInfo["withOther"] && index == responses.length - 1 && isValueInList(index, indexes)?
                        <Input
                        defaultValue={text}
                        placeholder={promptResponseInfo.otherLabel}
                        onChangeText={(newText) => {
                            // this.setState({ comment: value })
                            setText(newText);
                            myOnChange(indexes, index, newText);
                        }}
                        //errorStyle={{ color: 'red' }}
                        //errorMessage='Enter a valid number'
                      />: null
                    }
                    <Card.Divider />
                </Fragment>;
            })
        }
    </Fragment>;
}

export default MySelectButtonWidget;