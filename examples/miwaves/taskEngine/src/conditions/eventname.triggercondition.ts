
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';

export default class EventNameTriggerCondition extends GenericEventCondition {

    name: string = "EventNameTriggerCondition";
    type: string = "event"; // standard, event
    
    
    #eventName: string = "";

    constructor(eventName: string, forValidity: boolean) {
        super();
        this.#eventName = eventName;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        console.log(`[Condition]`, this.getName(), `eventName`, this.#eventName, "event.name", event.name);
        let result = this.#eventName == event.name;

        return this.generateRecord({value: result, eventName: this.#eventName}, event.providedTimestamp);
    }

    static fromSpec(spec: {eventName: string, forValidity: boolean}): GenericCondition {
     
     let newTCondition = new EventNameTriggerCondition(spec["eventName"], spec["forValidity"]);
     
     return newTCondition;

    }

}