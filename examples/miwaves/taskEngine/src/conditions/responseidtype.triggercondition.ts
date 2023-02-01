
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';
import { UserResponseEvent } from '../events/userresponseevent.model';

export default class ResponseTypeAndIdTriggerCondition extends GenericEventCondition {

    name: string = "ResponseTypeAndIdTriggerCondition";
    eventName: string = "user-response";

    #promptType: string;
    #promptId: string;

    constructor(responseType: string, responseId: string, forValidity: boolean = false) {
        super();
        this.#promptType = responseType;
        this.#promptId = responseId;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        console.log(`[Condition] Spec`, this.getName(), `promptType`, this.#promptType , `promptId`, this.#promptId);

        let result = false;
        let weekIndex = -1;

        let theEvent = event as UserResponseEvent;
        console.log(`[Condition] Event`, this.getName(), `promptType`, theEvent.promptType, `promptId`, theEvent.promptId);
        

        result = theEvent.promptType == this.#promptType && theEvent.promptId == this.#promptId;

        console.log(`${this.name}.evaluate: ${result}`);

        return this.generateRecord({value: result, promptType: this.#promptType, promptId: this.#promptId}, curTime);
    }

    static fromSpec(spec: {promptType: string, promptId: string, forValidity: boolean}): GenericCondition {
     
     let newTCondition = new ResponseTypeAndIdTriggerCondition(spec["promptType"], spec["promptId"], spec["forValidity"]);
     
     return newTCondition;

    }

}