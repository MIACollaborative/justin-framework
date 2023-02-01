
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { TriggerRecord } from '../models/triggerrecord.model';
import { GenericRecord } from '../models/genericrecord.model';
import FixedTimeTriggerCondition from '../conditions/fixedtime.triggercondition';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';
import DesktopNotificationAction from '../actions/desktopnotification.action';
import DaysInAWeekTriggerCondition from '../conditions/daysinweek.triggercondition';
import { GenericCondition } from '../models/genericcondition.model';
import { AllConditionArbiter } from '../arbiters/allcondition.arbiter';
import EventNameTriggerCondition from '../conditions/eventname.triggercondition';
import { GenericEvent } from '../models/genericevent.model';
import { IEventTrigger } from '../models/eventtrigger.interface';

export default class EventNameTrigger implements IEventTrigger {

    name: string = "EventNameTrigger";
    type: string = "event";
    eventName: string = "MyRandomEvent1"
    
    // private members
    #shouldDecideRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;


    getName(): string {
        return this.name;
    }

    getEventName(): string{
        return this.eventName;
    }



    async shouldDecide(user: User, event:GenericEvent): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.shouldDecide()', user.getName()); 

        // version 4: use arbiter directly
        let conditionList:GenericCondition[] = [];

        this.eventName = "clock";// "MyRandomEvent1";

        let tCondition = EventNameTriggerCondition.fromSpec({eventName: this.eventName, forValidity: true});

        conditionList.push(tCondition);

        this.#shouldDecideRecord = await new AllConditionArbiter().evaluate(user, event, {evaluableList: conditionList});
        
        return this.#shouldDecideRecord;
    }



    async decide(user: User, event:GenericEvent): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, event.providedTimestamp);
    }

    async doAction(user: User, event:GenericEvent): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.doAction()', "this.#shouldDecideRecord", this.#shouldDecideRecord); 
        let curTime = event.providedTimestamp;

        
        let title = `[${this.getName()}]`;
        let message: string = `Hi ${user.getName()}. This event [${this.eventName}] just happened!`;
        
        let aAction = new DesktopNotificationAction({
            title: title,
            message: message
        });

        //let message: string = selectMessage(user, curTime).text;
        //let actionResult = await createDesktopNotification(`[${this.getName()}]`, message);
        

        let actionResultRecord = await aAction.evaluate(user, curTime);

        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);

        return actionResultRecord;
    }

    generateRecord(user: User, curTime: Date, shouldDecideRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldDecideRecord: shouldDecideRecord,
            probabilityRecord: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

    
}