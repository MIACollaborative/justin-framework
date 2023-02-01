import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";
import { GenericCondition } from "./genericcondition.model";

export class GenericEventCondition extends GenericCondition {
    forValidity: boolean = false;
    type: string = "event";
    eventName: string = "clock";
    
    
    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return super.generateRecord({...recordObj, eventName: this.eventName}, curTime);
        //return new GenericRecord({...recordObj, validity: this.forValidity? recordObj["value"]: true}, curTime);
    }
    
}