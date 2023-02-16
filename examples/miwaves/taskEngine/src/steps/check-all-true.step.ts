import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";

export default  class GetTimeStep extends GenericStep {
    name: string = "check-all-true";

    async evaluate(user: User | null, event:GenericEvent, _metaObj:Object):Promise<GenericRecord>{
        // assume_metaObject contain inputs
        //let inputs = _metaObj["parentNodeIdList"];
        // we should have a list of parent step here.
        // I whould be able to request the execution of a set (could be one) parent step's input

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

    isInputEnough(paramsObj:Object):boolean{
        // Let's see, how do I specify that all incoming edge has to provide an value
        // well, for now, just assume that all input need to be ready to be evaluate
        return true;
    }

}