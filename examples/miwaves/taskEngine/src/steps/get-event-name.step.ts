import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";

export default class GetEventNameStep extends GenericStep {
    name: string = "get-event-name";

    async evaluate(user: User | null, event:GenericEvent, _metaObj?:Object):Promise<GenericRecord>{
        console.log(`${this.getName()}.evaluate: ${event.name}`);
        return await this.generateRecord({value: event.name}, event.providedTimestamp);
    }

}