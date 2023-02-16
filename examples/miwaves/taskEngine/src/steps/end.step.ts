import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model"

export default class EndStep extends GenericStep {
    name: string = "end";

    async evaluate(user: User | null, event:GenericEvent, _metaObj:Object):Promise<GenericRecord>{

        let inputMap = _metaObj["inputMap"];

        console.log(`inputMap: ${JSON.stringify(inputMap)}`);
        
        let result = true;

        Object.keys(inputMap).forEach((nodeId) => {
            
            if(!inputMap[nodeId]){
                result = false;
            }
        });


        return await this.generateRecord({value: result}, event.providedTimestamp);
    }

}