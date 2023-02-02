import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';


export type StackParamList = {
    Login: undefined; // { itemId: number, otherParam:Object};
    TabNavigator: undefined;
    //Home: undefined;
    
    
};

export type StackTabNavigatorScreenProps = NativeStackScreenProps<StackParamList, 'TabNavigator', 'MyStack'>;
export type StackLoginScreenProps = NativeStackScreenProps<StackParamList, 'Login', 'MyStack'>;

export type TabParamList = {
    Home: undefined;
    Settings: undefined;
    Survey: undefined;
    RewardCard: undefined;
};

export type TabHomeScreenProps = BottomTabScreenProps<TabParamList, 'Home', 'MyTab'>;
export type TabSettingsScreenProps = BottomTabScreenProps<TabParamList, 'Settings', 'MyTab'>;
export type TabSurveyScreenProps = BottomTabScreenProps<TabParamList, 'Survey', 'MyTab'>;
export type TabRewardCardScreenProps = BottomTabScreenProps<TabParamList, 'RewardCard', 'MyTab'>;


export interface  ResponseWidgetProps{
    promptResponseInfo: PromptResponseInfo;
    onChange: Function;
    type: string;
    existingResponseInfo: ResponseInfo;
};

export interface PromptCollectionInfo {
    name: string;
    header: string;
    messageOnComplete: string;
    promptList: PromptResponseInfo[];
};


export interface  PromptResponseInfo{
    name: string;
    prompt: string;
    type: string;
    response: any[];
    responseLabel: string[];
    response2?: any[];
    responseLabel2?: string[];
    required?: boolean;
    requiredType?: string;
    withOther?: boolean;
    otherLabel?: string;
    min?: number;
    max?: number;
    minLabel?: string;
    maxLabel?: string;
    step?: number;
};


export interface  ResponseInfo{
    name: string;
    responseList: ResponseObject[];
    isComplete: boolean;
};

export interface ResponseObject{
    indexList: number[];
    valueList: any[];
    labelList: string[];
    extraList: any[];
};




