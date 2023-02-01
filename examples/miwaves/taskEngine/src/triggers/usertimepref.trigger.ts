
import { DecisionRecord } from '../models/decisionrecord.model';
import { User } from '../models/user.model';
import { ITrigger } from '../models/trigger.interface';
import { writeLogMessage } from '../actions/logwriter.action';
import { MessageTimePrefs } from '../dataModels/prefs/messageTimePrefs.model';
import { selectMessage } from '../actions/selectmessage.action';
import { GenericRecord } from '../models/genericrecord.model';
import { TriggerRecord } from '../models/triggerrecord.model';
import { NoActionDecisionRecord } from '../models/noaction.decisionrecord';
import { GenericEvent } from '../models/genericevent.model';

export default class UserTimePrefTrigger implements ITrigger {

    name: string = "UserTimePrefTrigger";
    type: string = "standard";

    // private members
    #shouldDecideRecord: GenericRecord;
    #probabilityRecord: GenericRecord;
    #actionRecord: GenericRecord;

    getName(): string {
        return this.name;
    }

    async shouldDecide(user: User, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        
        let prefs: MessageTimePrefs | undefined = 
            user.getPrefs(MessageTimePrefs.KEY) as MessageTimePrefs;
        let messageTimePrefs: MessageTimePrefs = 
            prefs as MessageTimePrefs;
        if (!messageTimePrefs) {
            console.log('no', MessageTimePrefs.KEY, 'found for', user.getName());
            return new GenericRecord({value: false}, curTime);
        }
        console.log(messageTimePrefs);
        // TODO: deal with timezones?
        for (let mt of messageTimePrefs.namedTimes) {
            let t = mt.time;
            console.log(mt.name, ':', mt.time, 'type:', typeof(mt.time))
            t.setFullYear(curTime.getFullYear());
            t.setMonth(curTime.getMonth());
            t.setDate(curTime.getDate());
            let diff = t.getTime() - curTime.getTime();
            if (Math.abs(diff) < 1000 * 60) { // within a minute
                return new GenericRecord({value: true}, curTime);
            }
        }
        return new GenericRecord({value: false}, curTime);
    }

    async decide(user: User, event:GenericEvent): Promise<GenericRecord> {
        return new GenericRecord({ value: 1.0 }, event.providedTimestamp);
    }

    async doAction(user: User, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        let message: string = selectMessage(user, curTime).text;
        writeLogMessage(message).then(() => {
            // not sure what to do here.
            // the action should log it's own errors, not the trigger.
            // the trigger is "fire and forget" perhaps.
        }); 
        console.log('did action, message:', message);
        return new DecisionRecord(user, this.name, { message: message }, curTime);
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