
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { TriggerRecord } from '../models/triggerrecord.model';
import { GenericRecord } from '../models/genericrecord.model';
import FixedTimeTriggerCondition from '../conditions/fixedtime.triggercondition';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';
import DesktopNotificationAction from '../actions/desktopnotification.action';
import { GenericCondition } from '../models/genericcondition.model';
import { AllConditionArbiter } from '../arbiters/allcondition.arbiter';
import { GenericEvent } from '../models/genericevent.model';
import { IEventTrigger } from '../models/eventtrigger.interface';

export default class FixedTimeTrigger implements IEventTrigger {

    name: string = "FixedTimeTrigger";
    type: string = "event";
    eventName: string = "clock";
    
    // private members
    #shouldDecideRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;


    getName(): string {
        return this.name;
    }

    getEventName(): string {
        return this.eventName;
    }

    /*
    isCorrectEventName(event:GenericEvent): boolean{
        let result = false;

        if( event.name !== this.getName()){
            // now the right event to deal with
            result = true;
        }

        return result;
    }
    */

    async shouldDecide(user: User, event:GenericEvent): Promise<GenericRecord> {
        console.log('[Trigger] ', this.getName(), '.shouldDecide()', user.getName()); 
        let curTime = event.providedTimestamp;

        // version 4: use arbiter directly
        let conditionList:GenericCondition[] = [];

        let tCondition = FixedTimeTriggerCondition.fromSpec({targetTimeString: "11:55 PM", forValidity: true});

        conditionList.push(tCondition);
        
        this.#shouldDecideRecord =  await new AllConditionArbiter().evaluate(user, event, {evaluableList: conditionList});

        return this.#shouldDecideRecord;
        // version 3: use TriggerCondition
        /*
        let tCondition = FixedTimeTriggerCondition.fromSpec({targetTimeString: "12:12 PM", forValidity: true});
        let resultRecord = await tCondition.evaluate(user, curTime);

        return resultRecord;
        */

        // Without Condition
        /*
        // assuming this is the user timezone
        
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.targetTimeString, userTimezoneString);

        // see if I need to sync the rest

        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");
        return result;
        */
    }

    async decide(user: User, event:GenericEvent): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, event.providedTimestamp);
    }

    async doAction(user: User, event:GenericEvent): Promise<GenericRecord> {
        console.log(`[Trigger] ', ${this.getName()}, '.doAction() - event: ${JSON.stringify(event)}`);
        let curTime = event.providedTimestamp;
        console.log(`[curTime]: ${curTime}, target: ${JSON.stringify(this.#shouldDecideRecord)}`);
        
        let title = `[${this.getName()}]`;
        let message: string = `Hi ${user.getName()}. It's ${this.#shouldDecideRecord["record"]["recordList"][0]["record"]["targetTimeString"]}`;
        console.log(`[Action]: ${message}`);
        
        
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

    generateRecord(user: User, curTime: Date, shouldRunRecord:GenericRecord, probabilityRecord?:GenericRecord, actionRecord?:GenericRecord):TriggerRecord{
        let recordObj = {
            shouldRunRecord: shouldRunRecord,
            probabilityRecord: probabilityRecord,
            actionReord: actionRecord
        };
        return new TriggerRecord(user, this.getName(), recordObj, curTime);
    }

    /*
    async execute(user: User, curTime: Date): Promise<TriggerRecord>{
        console.log('[Trigger] ', this.getName(), '.execute()', curTime);

        this.#shouldRunRecord = await this.shouldRun(user, curTime);

        console.log('[Trigger] ', this.getName(), '.shouldRun()', JSON.stringify(this.#shouldRunRecord.record));

        if (!this.#shouldRunRecord["record"]["value"]){
            return this.generateRecord(user, curTime, this.#shouldRunRecord);
        }

        let diceRoll = Math.random();
        console.log('dice role:', diceRoll);

        let probabilityGot = await this.getProbability(user, curTime);

        console.log('probabilityGot:', JSON.stringify(probabilityGot, null, 2));

        let probability = probabilityGot["record"]["value"];

        this.#probabilityRecord = new GenericRecord({value: diceRoll, probability: probability}, curTime);

        if (diceRoll < probability) {
            this.#actionRecord = await this.doAction(user, curTime);
        } else {
            this.#actionRecord = new NoActionDecisionRecord(user, this.getName(), curTime);
            console.log('no action, record:', this.#actionRecord);
        }

        return this.generateRecord(user, curTime, this.#shouldRunRecord, this.#probabilityRecord, this.#actionRecord);

    }
    */
}