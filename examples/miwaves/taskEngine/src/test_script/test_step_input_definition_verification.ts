import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generic-phase.model";
import { SimplePhase } from "../phases/simple.phase";
import { loadTestSteps } from "../tests/load-steps.tests";
import * as configService from '../db/studyconfig.service';
import { GenericStep } from "../models/generic-step.model";
import dotenv from 'dotenv';
import { TimeMatchPhase } from "../phases/time-match.phase";
//var db = require('./db');

dotenv.config();

let phase = new TimeMatchPhase();// new SimplePhase();// new GenericPhase();

async function verifyStepInputDefinition(){
    await loadTestSteps();

    let steps: GenericStep[] = await configService.getSteps(); 

    // now, construct the step id -> step map
    let stepMap:Object = {};

    steps.forEach((step) => {
        stepMap[step.getName()] = step;
    });

    let nodeResultList = phase.verifyNodeInputSpecification({stepMap:stepMap}); 

    nodeResultList.forEach((nodeResult) => {
        console.log(`Node [${nodeResult.nodeId}] input OK: ${nodeResult.result}`);
    });

    return nodeResultList.every((nodeResult) => {return nodeResult.result;});
}

verifyStepInputDefinition().then((result) => { 
    console.log(`verifyStepInputDefinition finished!: ${result}`);
})

// actual testing
/*
let aCondition = DaysInAWeekTriggerCondition.fromSpec({daysInWeekIndexList: [2,4]});

const what = async () => {
    let users = await userService.getAllUsers();
    let result = await aCondition.evaluate(users[0], new Date());
    console.log(`result: ${result}`);
};

what();
*/
