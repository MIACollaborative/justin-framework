import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generic-phase.model";
import { SimplePhase } from "../phases/simple.phase";
import { loadTestSteps } from "../tests/load-steps.tests";
import * as configService from '../db/studyconfig.service';
import { GenericStep } from "../models/generic-step.model";
import dotenv from 'dotenv';
import { TimeMatchPhase } from "../phases/time-match.phase";
import { ClockEvent } from "../events/clockevent.model";
import { loadTestUsers } from "../tests/load-users.tests";
import * as userService from '../db/users.service';
//var db = require('./db');

dotenv.config();

let phase = new TimeMatchPhase();// new SimplePhase();// new GenericPhase();

async function evaluatePhase(){
    await loadTestUsers();
    await loadTestSteps();

    let steps: GenericStep[] = await configService.getSteps(); 
    let users = await userService.getAllUsers();

    // now, construct the step id -> step map
    let stepMap:Object = {};

    steps.forEach((step) => {
        stepMap[step.getName()] = step;
    });

    let now = new Date(2022, 8, 19, 8, 0, 0); // new Date(2022, 8, 19, 2, 55, 0); //EDT/EST
    let cEvent = new ClockEvent("clock", "system-user", now);

    await phase.evaluate(users[0], cEvent, {stepMap:stepMap});

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
