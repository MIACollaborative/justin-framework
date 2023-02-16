import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generic-phase.model";
import { SimplePhase } from "../phases/simple.phase";
import { loadTestSteps } from "../tests/loadsteps.tests";
import * as configService from '../db/studyconfig.service';
import { GenericStep } from "../models/generic-step.model";
import dotenv from 'dotenv';
//var db = require('./db');

dotenv.config();

let phase = new SimplePhase();// new GenericPhase();

async function evaluatePhase(){
    await loadTestSteps();

    let steps: GenericStep[] = await configService.getSteps(); 

    // now, construct the step id -> step map
    let stepMap:Object = {};

    steps.forEach((step) => {
        stepMap[step.getName()] = step;
    });

    await phase.evaluate(null, new GenericEvent("test", "test", new Date()), {stepMap:stepMap});

}

evaluatePhase().then((result) => { 
    console.log(`evaluatePhase finished!`);
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
