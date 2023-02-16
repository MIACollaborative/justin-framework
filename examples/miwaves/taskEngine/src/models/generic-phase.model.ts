import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";
import { GenericEvent } from "./genericevent.model";
import { GenericStep } from "./generic-step.model";


// comment
/*
[H: "Are all conditions true/satisfied?"] -> "END": "end"

[B: "Is this the clock event?", E: "Is it a user's wake up time?", G: "Are the stpes engouth?"] -> H: "Are all conditions true/satisfied?"

[F: "Get stpes for yesterday"] -> G: "Are the stpes engouth?"

[ C: "Get a user's prefernece (wakeup time)", D: "Get time" ]  -> E: "Is it a user's wake up time?"

[A: "Get event type"] -> B: "Is this the clock event?"
*/


export class GenericPhase extends GenericEvaluable {

    // this should record how a collection of steps in this phase shoud be evaluated in sequence
    name: string = "GenericPhase";

    definition: {nodeMap:Object, flow:{ parent: {nodeId:string}[], children: {nodeId:string}[] }[]} = {
        nodeMap: {
            "START": {stepId: "start", label: "Start"}, 
            "END": {stepId: "end", label: "End"},
            "A": {stepId: "true", label: "True"},
        },
        flow: [
            {
                parent: [{nodeId: "START"}],
                children: [{nodeId: "A"}]
            },
            {
                parent: [{nodeId: "A"}],
                children: [{nodeId: "END"}]
            }
        ]
    };

    async evaluate(user: User | null, event:GenericEvent, _metaObj:{stepMap:Object}):Promise<GenericRecord>{
        // let's try to impelment the evlauation flow here for phase to get a feeling first
        await this.forwardEvaluation(user, event, _metaObj);
        return await this.generateRecord({}, event.providedTimestamp);
    }

    async forwardEvaluation(user: User | null, event:GenericEvent, _metaObj:{stepMap:Object}){

        let definition = this.definition;

        let nodeResultMap:Object = {};

        let stepMap = _metaObj.stepMap;

        // should operate on nodeId first
        // after demonstrating the process, we can then invoke stepId, which is the acutal computational unit that will do real calucation


        let curNodeId = "START"; 
        //console.log(`Visit node[${curNodeId}]`);

        //let nodeVisitMap:Object = {};
        let nextToVisitIdList: string[] = [curNodeId];

        let childrenIdList: string[] = [];
        /*
        let childrenIdList: string[] = this.extractChildrenIdList(definition, curNodeId);
        console.log(`childrenIdList: ${JSON.stringify(childrenIdList)}`);

        nextToVisitIdList = ([] as string[]).concat(childrenIdList);
        console.log(`nextToVisitIdList: ${nextToVisitIdList}`);
        */

        while (nextToVisitIdList.length > 0){
            curNodeId = nextToVisitIdList.shift() as string;
            console.log(`Visit node[${curNodeId}]`); 

            
            if(nodeResultMap[curNodeId] == undefined){
                // we have not execute
                let stepId = this.definition.nodeMap[curNodeId].stepId;
                let nodeStep:GenericStep = stepMap[stepId];
                console.log(`node[${curNodeId}] - step [${stepId}]: ${nodeStep}`);
                // step 1: check if all the parent has result already
                let parentIdList = this.extractParentIdList(this.definition, curNodeId);
                let allParentReady = this.areResultsFromNodesReady(nodeResultMap, parentIdList);

                // Step 2: only execute if results from all parents are ready
                if(allParentReady){
                    console.log(`Result from all parent ${parentIdList} is ready for ${curNodeId}`);
                    // execute, and add the children to the next to visit

                    // extract result from parent

                    let parentResultMap = this.extractResultsFromNodes(nodeResultMap, parentIdList);

                    let stepResult = await nodeStep.evaluate(user, event, {inputMap: parentResultMap});
                    console.log(`stepResult[${curNodeId}][${stepId}]: ${JSON.stringify(stepResult)}`);

                    nodeResultMap[curNodeId] = stepResult["record"]["value"];

                    console.log(`nodeResultMap[${curNodeId}]: ${ nodeResultMap[curNodeId]}`);

                    // add children to the list
                    childrenIdList = this.extractChildrenIdList(definition, curNodeId);
                    console.log(`childrenIdList: ${JSON.stringify(childrenIdList)}`);
                    if(childrenIdList.length > 0){
                        childrenIdList.forEach((nodeId) => {
                            if( !nextToVisitIdList.includes(nodeId)){
                                nextToVisitIdList.unshift(nodeId);
                            }
                        });
                        
                    }
                }
                else{
                    console.log(`Result from all parent ${parentIdList}  is NOT ready for ${curNodeId}`);

                    // push it to the end
                    nextToVisitIdList.push(curNodeId);

                    // not execute, add the node to the 2nd?
                    //nextToVisitIdList.splice(1, 0, curNodeId);
                    
                }
            }
            else{
                // visited before, just skipped;
                console.log(`Skip (result ready): [${curNodeId}]`);
                continue;
            }

            console.log(`nextToVisitIdList: ${nextToVisitIdList}`);
        }

        console.log(`Phase [${this.name}] finish evaluattion: result -> ${nodeResultMap["END"]}.`);

    }

    async backwardEvaluation(){

        let definition = this.definition;

        // should operate on nodeId first
        // after demonstrating the process, we can then invoke stepId, which is the acutal computational unit that will do real calucation


        let curNodeId = "END"; 
        console.log(`Visit node[${curNodeId}]`);

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

    }

    areResultsFromNodesReady(nodeResultMap, nodeIdList: string[]):boolean{
        if(nodeIdList.length == 0){
            return true;
        }
        return nodeIdList.every((nodeId)=> {
            return nodeResultMap[nodeId] != undefined;
        })
    }

    extractResultsFromNodes(nodeResultMap, nodeIdList: string[]):Object{
        let resultMap = {};

        nodeIdList.forEach((nodeId) => {
            resultMap[nodeId] = nodeResultMap[nodeId];
        });


        return resultMap;
    }

    extractChildrenIdList(definition, curNodeId:string): string[]{

        let edgeWithThatParentList: { parent: {nodeId:string}[], children: {nodeId:string}[] }[] = [];

        edgeWithThatParentList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.parent.some((parentInfo) => {return parentInfo.nodeId == curNodeId;});
        });

        let childrenNodeIdList = edgeWithThatParentList.map((edgeInfo) => {return edgeInfo.children;}).flat(2).map((nodeInfo) => {return nodeInfo.nodeId;});

        //console.log(`parentNodeIdList: ${JSON.stringify(parentNodeIdList)}`);

        return childrenNodeIdList;
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
    

}