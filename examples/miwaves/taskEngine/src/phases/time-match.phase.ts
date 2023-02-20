import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";

import { GenericEvaluable } from "../models/genericevaluable.model";
import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generic-phase.model";


// comment
/*
[H: "Are all conditions true/satisfied?"] -> "END": "end"

[B: "Is this the clock event?", E: "Is it a user's wake up time?", G: "Are the stpes engouth?"] -> H: "Are all conditions true/satisfied?"

[F: "Get stpes for yesterday"] -> G: "Are the stpes engouth?"

[ C: "Get a user's prefernece (wakeup time)", D: "Get time" ]  -> E: "Is it a user's wake up time?"

[A: "Get event type"] -> B: "Is this the clock event?"
*/


export class TimeMatchPhase extends GenericPhase {

    // this should record how a collection of steps in this phase shoud be evaluated in sequence
    name: string = "TimeMatchPhase";

    definition: {nodeMap:Object, flow:{ parent: {nodeId:string}[], children: {nodeId:string}[], edge?: {parentId: string, childId: string, annotation: Object}[]}[]} = {
        nodeMap: {
            "START": {stepId: "start", label: "Start"},
            "END": {stepId: "end", label: "End"},
            "A": {stepId: "true", label: "True"},
            "B": {stepId: "false", label: "False"},
            "C": {stepId: "match-two-time", label: "Is the time correct?"},
        },
        flow: [
            {
                parent: [{nodeId: "START"}],
                children: [{nodeId: "A"},{nodeId: "B"}]
            },
            {
                parent: [{nodeId: "A"}, {nodeId: "B"}],
                children: [{nodeId: "C"}],
                // experimental which format makes sense. For now, have both the above and below
                
                edge: [
                    {parentId: "A", childId: "C", annotation: {label: 1}}, 
                    {parentId: "B", childId: "C", annotation: {label: 2}}
                ]
                
                
            },
            {
                parent: [{nodeId: "C"}],
                children: [{nodeId: "END"}]
            }
        ]
    };

    /*
    async evaluate(user: User | null, event:GenericEvent, _metaObj?:Object):Promise<GenericRecord>{
        // let's try to impelment the evlauation flow here for phase to get a feeling first
        let definition = this.definition;

        // should operate on nodeId first
        // after demonstrating the process, we can then invoke stepId, which is the acutal computational unit that will do real calucation


        let curNodeId = "END";

        let nodeVisitMap:Object = {};
        let nextToVisitIdList: string[] = [];

        let parentIdList: string[] = this.extractParentIdList(definition, curNodeId);
        console.log(`parentIdList: ${JSON.stringify(parentIdList)}`);

        nextToVisitIdList = ([] as string[]).concat(parentIdList);
        console.log(`nextToVisitIdList: ${nextToVisitIdList}`);

        while (nextToVisitIdList.length > 0){
            curNodeId = nextToVisitIdList.shift() as string;
            console.log(`Visit node[${curNodeId}]`);
            
            if(nodeVisitMap[curNodeId]){
                // visited before, just skipped;
                console.log(`Skip (visited): [${curNodeId}]`);
                continue;
            }
            nodeVisitMap[curNodeId] = true;

            parentIdList = this.extractParentIdList(definition, curNodeId);
            console.log(`parentIdList: ${JSON.stringify(parentIdList)}`);
            if(parentIdList.length > 0){
                nextToVisitIdList.unshift(...parentIdList);
            }
    
            console.log(`nextToVisitIdList: ${nextToVisitIdList}`);
        }

        console.log(`Phase [${this.name}] finish evaluattion.`);

        return await this.generateRecord({}, event.providedTimestamp);
    }

    extractParentIdList(definition, curNodeId:string): string[]{

        let edgeWithThatChildrenList: { parent: {nodeId:string}[], children: {nodeId:string}[] }[] = [];

        edgeWithThatChildrenList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.children.some((childInfo) => {return childInfo.nodeId == curNodeId;});
        });

        

        //console.log(`edgeWithThatChildrenList: ${JSON.stringify(edgeWithThatChildrenList)}`);


        let parentNodeIdList = edgeWithThatChildrenList.map((edgeInfo) => {return edgeInfo.parent;}).flat(2).map((nodeInfo) => {return nodeInfo.nodeId;});

        //console.log(`parentNodeIdList: ${JSON.stringify(parentNodeIdList)}`);

        return parentNodeIdList;
    }
    */
    

}