
import { User } from './user.model';
import { TriggerRecord } from './triggerrecord.model';
import { DecisionRecord } from './decisionrecord.model';
import { GenericRecord } from './genericrecord.model';
import { GenericEvent } from './genericevent.model';
import { ITrigger } from './trigger.interface';

export interface IEventTrigger extends ITrigger {
    /*
    name: string;
    type: string; //standard, event
    */
    eventName: string; // "clock"
    
    // public, expected to be called
    
    //getName(): string;
    getEventName(): string;

    // public, but only get called if further customization is needed
    /*
    shouldDecide(user: User, event:GenericEvent): Promise<GenericRecord>; //: boolean; 
    decide(user: User, event:GenericEvent): Promise<GenericRecord>; //: number
    doAction(user: User, event:GenericEvent): Promise<GenericRecord>; // for now
    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord;
    */

    // no need, done at the loop level
    //isCorrectEventName(event:GenericEvent): boolean;

    // public? but do not expect to be called in usual cases. Will be called 
    //generateRecord():TriggerRecord;
}