
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';
import { UserResponseEvent } from '../events/userresponseevent.model';

export default class ResponseUserNameTriggerCondition extends GenericEventCondition {

    name: string = "ResponseUserNameTriggerCondition";
    eventName: string = "user-response";

    #responseUserName: string;
    
    constructor(responseUserName: string, forValidity: boolean = false) {
        super();
        this.#responseUserName = responseUserName;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        console.log(`[Condition] Spec`, this.getName(), `responseUserName`, this.#responseUserName);

        let result = false;

        let theEvent = event as UserResponseEvent;
        console.log(`[Condition] Event`, this.getName(), `userName`, theEvent.userName, `promptType`, theEvent.promptType, `promptId`, theEvent.promptId);
        

        result = theEvent.userName == this.#responseUserName;
        console.log(`${this.name}.evaluate: ${result}`);

        return this.generateRecord({value: result, responseUserName: this.#responseUserName}, curTime);
    }

    static fromSpec(spec: {responseUserName: string, forValidity: boolean}): GenericCondition {
     
     let newTCondition = new ResponseUserNameTriggerCondition(spec["responseUserName"], spec["forValidity"]);
     
     return newTCondition;

    }

}