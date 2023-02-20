import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericStep } from "../models/generic-step.model";
import GeneralUtility from "../utilities/generalutilities";
import { DateTime, DateTimeUnit, Duration, DurationObjectUnits } from "luxon";
import PhasStepUtility from "../utilities/phase-step.utility";

export default  class MatchTwoTimeStep extends GenericStep {
    name: string = "match-two-time";

    async evaluate(user: User | null, event:GenericEvent, _metaObj:Object):Promise<GenericRecord>{
        // assume_metaObject contain inputs
        //let inputs = _metaObj["parentNodeIdList"];
        // we should have a list of parent step here.
        // I whould be able to request the execution of a set (could be one) parent step's input

        let inputMap = _metaObj["inputMap"];

        console.log(`inputMap: ${JSON.stringify(inputMap)}`);
        
        let result = true;

        let dateList:Date[] = Object.keys(inputMap).map((nodeId) => {return inputMap[nodeId];});


        // now figure out how to copare
        let unitsString:DateTimeUnit = "second";

        let diffDateTime:Duration = GeneralUtility.diffDateTime(DateTime.fromJSDate(dateList[0]), DateTime.fromJSDate(dateList[1]), ["second"]);

        console.log(`diffDateTime: ${JSON.stringify(diffDateTime.toObject())}`);

        
        if ( (diffDateTime.toObject())[unitsString as keyof DurationObjectUnits] != 0) {
            result = false;
        }
        else {
            result = true;
        }

        return await this.generateRecord({value: result}, event.providedTimestamp);
    }

    isInputProperlySpecified(definition:Object, curNodeId:string):boolean{
        // extract those node with this node as children
        let result = false;
        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = PhasStepUtility.extractEdgesWithASpecificChild(definition, curNodeId);
        
        // So, what now. for each Edge Object, ensure that 
        result = edgeWithThatChildrenList.every((flowInfo)=>{
            let eResult = false;

            let edgeList = flowInfo["edge"];

            // ok, so I need two edges that is annotated with label 1 and 2
            let firstInputExists = false;
            let secondInputExists = false;

            if( edgeList != undefined){
                firstInputExists = edgeList.some((edgeInfo) => {
                    return edgeInfo["childId"] == curNodeId && edgeInfo["annotation"]["label"] == 1;
                });

                console.log(`firstInputExists: ${firstInputExists}`);
    
                secondInputExists = edgeList.some((edgeInfo) => {
                    return edgeInfo["childId"] == curNodeId && edgeInfo["annotation"]["label"] == 2;
                });

                console.log(`secondInputExists: ${secondInputExists}`);
            }
            

            eResult = firstInputExists && secondInputExists; 

            return eResult;
        });

        let sampleEdgeDefinition = {
            parent: [{nodeId: "A"}, {nodeId: "B"}],
            children: [{nodeId: "C"}],
            edge: [
                {parentId: "A", childId: "C", annotation: {label: 1}}, 
                {parentId: "B", childId: "C", annotation: {label: 2}}
            ]
        };
        if(!result){
            console.warn(`${this.getName()} requires two edge objects in the definition annotated by label: 1 and label: 2. Example: ${JSON.stringify(sampleEdgeDefinition, null, 2)}`);
        }

        return result;
    }

}