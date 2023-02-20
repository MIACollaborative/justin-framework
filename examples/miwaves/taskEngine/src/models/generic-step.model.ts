import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";
import { GenericEvent } from "./genericevent.model";
import PhasStepUtility from "../utilities/phase-step.utility";

export class GenericStep extends GenericEvaluable {
    name: string = "GenericStep";

    async evaluate(user: User | null, event:GenericEvent, _metaObj?:Object):Promise<GenericRecord>{

        return await this.generateRecord({}, event.providedTimestamp);
    }

    isInputProperlySpecified(definition:Object, curNodeId:string):boolean{
        // extract those node with this node as children
        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = PhasStepUtility.extractEdgesWithASpecificChild(definition, curNodeId);
        
        return true;
    }

}