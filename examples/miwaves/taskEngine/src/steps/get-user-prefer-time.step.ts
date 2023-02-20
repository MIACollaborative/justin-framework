import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";

export default class GetUserPreferTimeStep extends GenericStep {
    name: string = "get-user-prefer-time";

    async evaluate(user:User, event:GenericEvent, _metaObj?:Object):Promise<GenericRecord>{

        /*
        messageTimePrefs.namedTimes

        filter by name=morning, and get value time
        */

        let morningTime:Date = user["prefs"]["messageTimePrefs"]["namedTimes"].filter((timeObj) => {return timeObj.name=="morning";})[0]["time"];

        console.log(`${this.getName()}.evaluate: ${morningTime}`);
        return await this.generateRecord({value: morningTime}, event.providedTimestamp);
    }

}