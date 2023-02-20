export default class PhasStepUtility {


    static areResultsFromNodesReady(nodeResultMap, nodeIdList: string[]): boolean {
        if (nodeIdList.length == 0) {
            return true;
        }
        return nodeIdList.every((nodeId) => {
            return nodeResultMap[nodeId] != undefined;
        })
    }

    static extractResultsFromNodes(nodeResultMap, nodeIdList: string[]): Object {
        let resultMap = {};

        nodeIdList.forEach((nodeId) => {
            resultMap[nodeId] = nodeResultMap[nodeId];
        });


        return resultMap;
    }

    static isNodeInputProperlySpecified(definition, curNodeId: string):boolean{

        let result = true;

        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = PhasStepUtility.extractEdgesWithASpecificChild(definition, curNodeId);

        edgeWithThatChildrenList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.children.some((childInfo) => { return childInfo.nodeId == curNodeId; });
        });


        return result;
    }

    static extractEdgesWithASpecificChild(definition, curNodeId: string): { parent: { nodeId: string }[], children: { nodeId: string }[] }[] {

        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = [];

        edgeWithThatChildrenList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.children.some((childInfo) => { return childInfo.nodeId == curNodeId; });
        });


        return edgeWithThatChildrenList;
    }

    static extractChildrenIdList(definition, curNodeId: string): string[] {

        let edgeWithThatParentList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = [];

        edgeWithThatParentList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.parent.some((parentInfo) => { return parentInfo.nodeId == curNodeId; });
        });

        let childrenNodeIdList = edgeWithThatParentList.map((edgeInfo) => { return edgeInfo.children; }).flat(2).map((nodeInfo) => { return nodeInfo.nodeId; });

        //console.log(`parentNodeIdList: ${JSON.stringify(parentNodeIdList)}`);

        return childrenNodeIdList;
    }

    static extractParentIdList(definition, curNodeId: string): string[] {

        let edgeWithThatChildrenList: { parent: { nodeId: string }[], children: { nodeId: string }[] }[] = PhasStepUtility.extractEdgesWithASpecificChild(definition, curNodeId);

        /*
        edgeWithThatChildrenList = definition["flow"].filter((edgeInfo) => {
            return edgeInfo.children.some((childInfo) => { return childInfo.nodeId == curNodeId; });
        });
        */



        //console.log(`edgeWithThatChildrenList: ${JSON.stringify(edgeWithThatChildrenList)}`);


        let parentNodeIdList = edgeWithThatChildrenList.map((edgeInfo) => { return edgeInfo.parent; }).flat(2).map((nodeInfo) => { return nodeInfo.nodeId; });

        //console.log(`parentNodeIdList: ${JSON.stringify(parentNodeIdList)}`);

        return parentNodeIdList;
    }
}