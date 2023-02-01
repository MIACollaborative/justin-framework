
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
import ResponseTypeAndIdTriggerCondition from '../conditions/responseidtype.triggercondition';
import ResponseUserNameTriggerCondition from '../conditions/response-user-name.triggercondition';
import { SomeConditionArbiter } from '../arbiters/somecondition.arbiter';

export default class UserResponseTrigger implements IEventTrigger {

    name: string = "UserResponseTrigger";
    type: string = "event";
    eventName: string = "user-response"
    
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

        let tCondition = ResponseTypeAndIdTriggerCondition.fromSpec({promptType: "survey", promptId: "testSurveyId1", forValidity: true});
        conditionList.push(tCondition);
        tCondition = ResponseTypeAndIdTriggerCondition.fromSpec({promptType: "survey", promptId: "testSurveyId2", forValidity: true});
        conditionList.push(tCondition);
        let arbiterA = new SomeConditionArbiter();
        arbiterA.setMetaObject({evaluableList: conditionList});

        //this.#shouldDecideRecord = await arbiterA.evaluate(user, event);

        // version 2: try the condition directly?
        
        
        
        //conditionList = [];
        tCondition = ResponseUserNameTriggerCondition.fromSpec({responseUserName: user.getUsername(), forValidity: true});
        //conditionList.push(tCondition);
        

        // version 1: use Arbiter
        //let arbiterB = new AllConditionArbiter();
        //arbiterB.setMetaObject({evaluableList: conditionList});


        let arbiterC = new AllConditionArbiter();
        //arbiterC.setMetaObject({evaluableList: [arbiterA, arbiterB]});
        arbiterC.setMetaObject({evaluableList: [arbiterA, tCondition]});
        
        this.#shouldDecideRecord = await arbiterC.evaluate(user, event);
        
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
        

        let actionResultRecord = await aAction.evaluate(user, event);

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