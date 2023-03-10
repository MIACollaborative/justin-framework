import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";

export default  class FalseStep extends GenericStep {
    name: string = "false";

    async evaluate(user: User | null, event:GenericEvent, _metaObj?:Object):Promise<GenericRecord>{
        return await this.generateRecord({value: false}, event.providedTimestamp);
    }

}