import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";
import GeneralUtility from "../utilities/generalutilities";
import { DateTime, DateTimeUnit, Duration, DurationObjectUnits } from "luxon";
import PhasStepUtility from "../utilities/phase-step.utility";

export default  class IsEventNameStep extends GenericStep {
    name: string = "is-event-name";

    #eventName: string;

    /*
    constructor(eventName:string) {
        super();
        this.#eventName = eventName;
    }
    */

    async evaluate(user: User | null, event:GenericEvent, _metaObj:Object):Promise<GenericRecord>{
        // assume_metaObject contain inputs
        //let inputs = _metaObj["parentNodeIdList"];
        // we should have a list of parent step here.
        // I whould be able to request the execution of a set (could be one) parent step's input

        let inputMap = _metaObj["inputMap"];

        console.log(`inputMap: ${JSON.stringify(inputMap)}`);
        
        let result = true;

        let eventNameToCheck:string = Object.keys(inputMap).map((nodeId) => {return inputMap[nodeId];})[0];

        console.log(`Target event name: ${this.#eventName}`);

        result = eventNameToCheck == this.#eventName;

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

    setSpec(spec: {eventName: string}): void {
     
        this.#eventName = spec["eventName"];

        /*
        let newStep = new IsEventNameStep(spec["eventName"]);

        
        
        return newStep;
        */
   
    }

}