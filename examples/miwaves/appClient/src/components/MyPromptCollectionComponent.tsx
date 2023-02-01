
import React, { Fragment, useEffect, useState } from 'react';
import { Text, Card, Button, Icon, ButtonGroup, CheckBox, Input, Slider, Divider, Dialog } from '@rneui/themed';
import { PromptCollectionInfo, PromptResponseInfo, ResponseInfo } from '../types/types';
import MySelectButtonWidget from './MySelectButtonWidget';
import MyInputWidget from './MyInputWidget';
import MySliderWidget from './MySliderWidget';
import { ScrollView, View } from 'react-native';
import MyPromptResponseBlock from './MyPromptResponseBlock';

type Props = {
    promptCollectionInfo: PromptCollectionInfo;
    onChange?: Function;
    onRespondingDone: Function;
    onFinish: Function;
};

const MyPromptCollectionComponent: React.FC<Props> = ({ promptCollectionInfo, onChange, onRespondingDone, onFinish }) => {
    const [promptIndex, setPromptIndex] = useState<number>(0);
    const [responseCollection, setResponseCollection] = useState<ResponseInfo[]>(promptCollectionInfo.promptList.map((promptInfo: PromptResponseInfo) => {
        return {
            name: promptInfo.name,
            responseList: [],
            isComplete: false
        };
    }));
    const [dialogVisible, setDialogVisible] = useState(false);

    console.log(`MyPromptCollectionComponent.responseCollection ${JSON.stringify(responseCollection)}`);

    const toggleDialog = () => {
        setDialogVisible(!dialogVisible);
    };

    useEffect(() => {
        function handleStatusChange(status: string) {
            console.log(`useEffect: handleStatusChange: ${status}`);
            //setIsOnline(status.isOnline);
        }

        handleStatusChange(`start: ${promptIndex}`);
        //ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
        // Specify how to clean up after this effect:
        return function cleanup() {
            console.log(`useEffect: cleanup`);
            handleStatusChange(`end: ${promptIndex}`);
            //ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
        };
    });


    const myOnChange = (data: ResponseInfo, index: number, metaInfo: { isComplete: boolean }) => {
        console.log(`name: ${data["name"]}, value: ${JSON.stringify(data["responseList"], null, 2)}`);

        // update surveyResponseList
        let newResponseCollection = [...responseCollection];

        newResponseCollection[index].responseList = data["responseList"];

        if (metaInfo.hasOwnProperty("isComplete")) {
            newResponseCollection[index].isComplete = metaInfo["isComplete"];
        }

        setResponseCollection(newResponseCollection);



        console.log(`Current response collection: ${JSON.stringify(newResponseCollection, null, 2)}`);
    }

    const isCurrentPrmoptComplete = (index: number) => {
        console.log(`isCurrentPrmoptComplete: ${index}`);
        return responseCollection[index].isComplete;
    }

    const onPromptNavigationPressed = (promptIndex: number, direction: number) => {
        console.log(`onPromptNavigationPressed: ${promptIndex} (direction: ${direction})`);
        console.log(`promptList.length: ${promptCollectionInfo.promptList.length}, promptIndex: ${promptIndex}`);

        // hmmm, it might acutally be different
        // I should only check required when moving forwrad
        // becuase, if a user simply want to go back, it shouldn't matter what he or her response for the current quetions is (complete or not)

        if (promptIndex > promptCollectionInfo.promptList.length || promptIndex + direction < 0) {
            // illegal, do nothing
            return;
        }

        if(direction < 0){
            // going back
            // I guess all I need to check is whether the index will not go overbound
            if (promptIndex + direction >= 0) {
                setPromptIndex(promptIndex + direction);
                return;
            }

        }

        // now, if direction is > 0 (going forward, Next)       
        if (promptIndex + direction > promptCollectionInfo.promptList.length) {
            // the ending page, time to close the survey when click
            console.log(`About to call onFinish`);
            onFinish();
            setPromptIndex(0);
        }
        else {
            // within the right range, the only difference is whether to signal the parent component about finishing (e.g., answer all)
            let prompt = promptCollectionInfo.promptList[promptIndex];

            if (prompt.requiredType != undefined) {
                console.log(`requiredType: ${prompt.requiredType}`);
                switch (prompt.requiredType) {
                    case "required":
                        // it is required
                        if (isCurrentPrmoptComplete(promptIndex)) {
                            if (promptIndex + direction == promptCollectionInfo.promptList.length){
                                console.log(`About to call onRespondingDone`);
                                onRespondingDone(responseCollection);
                            }
                            // only advance if completed
                            setPromptIndex(promptIndex + direction);
                        }
                        break;
                    case "confirmed-to-skip":
                        if (isCurrentPrmoptComplete(promptIndex)) {
                            if (promptIndex + direction == promptCollectionInfo.promptList.length){
                                console.log(`About to call onRespondingDone`);
                                onRespondingDone(responseCollection);
                            }
                            // only advance if completed
                            setPromptIndex(promptIndex + direction);
                        }
                        else{
                            // actuallly, look slike we can depend on the dialog outcome
                            toggleDialog();

                        }
                        break;
                    case "optional":
                        if (promptIndex + direction == promptCollectionInfo.promptList.length){
                            console.log(`About to call onRespondingDone`);
                            onRespondingDone(responseCollection);
                        }
                        setPromptIndex(promptIndex + direction);
                        break;
                    default:
                        break;

                }
            }
            else {
                // it is optional
                setPromptIndex(promptIndex + direction);
            }
        }
    }



    return <Fragment>
        <ScrollView>
            {
                promptIndex == 0 ? <Card>
                    <Text >{promptCollectionInfo.header}</Text>
                </Card> : null
            }
            {
                promptIndex + 1 <= promptCollectionInfo.promptList.length ? <Fragment>

                    <MyPromptResponseBlock 
                        key={promptIndex} 
                        promptResponseInfo={promptCollectionInfo.promptList[promptIndex]}
                        existingResponseInfo={responseCollection[promptIndex]}
                        onChange={(data: ResponseInfo, index: number, metaInfo: { isComplete: boolean }) => {
                            myOnChange(data, promptIndex, metaInfo);
                        }}></MyPromptResponseBlock>
                </Fragment> :
                    <Card>
                        <Text >{promptCollectionInfo.messageOnComplete}</Text>
                    </Card>

            }
            <Divider style={{ marginBottom: 20 }} color="#FFFFFF"></Divider>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1}}>
                <View>
                    {
                        promptIndex > 0 && promptIndex < promptCollectionInfo.promptList.length? 
                        <Button
                            title={"Previous"}
                            onPress={() => {
                                onPromptNavigationPressed(promptIndex, -1);
                            }}
                        />: null
                    }
                </View>
                <Divider style={{ marginLeft: 20, marginRight: 20 }} color="#FFFFFF"></Divider>
                <View>
                    <Button
                        title={promptIndex + 1 <= promptCollectionInfo.promptList.length ? "Next" : "OK"}
                        onPress={() => {
                            onPromptNavigationPressed(promptIndex, 1);
                        }}
                    />
                </View>
            </View>
            
            <Dialog
                isVisible={dialogVisible}
                onBackdropPress={toggleDialog}
            >
                <Dialog.Title title="Wait..." />
                <Text>Are you sure you want to skip this question?</Text>
                <Dialog.Actions>
                    <Dialog.Button title="Yes" onPress={() => {
                        console.log('Yes, skip!');
                        if (promptIndex + 1 == promptCollectionInfo.promptList.length){
                            console.log(`About to call onRespondingDone`);
                            onRespondingDone(responseCollection);
                        }
                        setPromptIndex(promptIndex + 1);
                        toggleDialog();
                    }} />
                    <Dialog.Button title="No" onPress={() => {
                        console.log(`No, don't skip!`);
                        toggleDialog();
                    }} />
                </Dialog.Actions>
            </Dialog>
        </ScrollView>
    </Fragment>
}

export default MyPromptCollectionComponent;


/*
{
    promptCollectionInfo.promptList.map((promptResponseInfo, index) => {
        return <MyPromptResponseBlock key={index} promptResponseInfo={promptResponseInfo} onChange={(data: ResponseInfo) => {
            myOnChange(data, index);
        }}></MyPromptResponseBlock>
    })
}
*/