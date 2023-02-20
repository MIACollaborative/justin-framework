import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";
import PhasStepUtility from "../utilities/phase-step.utility";

export default  class CheckAllTrueStep extends GenericStep {
    name: string = "check-all-true";

    async evaluate(user: User | null, event:GenericEvent, _metaObj:Object):Promise<GenericRecord>{
        // assume_metaObject contain inputs
        //let inputs = _metaObj["parentNodeIdList"];
        // we should have a list of parent step here.
        // I whould be able to request the execution of a set (could be one) parent step's input

        let inputMap = _metaObj["inputMap"];

        // A: true
        // B: false

        console.log(`inputMap: ${JSON.stringify(inputMap)}`);
        
        let result = true;

        Object.keys(inputMap).forEach((nodeId) => {
            
            if(!inputMap[nodeId]){
                result = false;
            }
        });


        return await this.generateRecord({value: result}, event.providedTimestamp);
    }

    isInputProperlySpecified(definition:Object, curNodeId:string):boolean{
        // extract those node with this node as children
        let result = false;
        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = PhasStepUtility.extractEdgesWithASpecificChild(definition, curNodeId);
        
        // So, what now. for each Edge Object, ensure that 
        result = edgeWithThatChildrenList.length > 0;

        return result;
    }

}