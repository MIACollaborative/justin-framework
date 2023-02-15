import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generiphase.model";
// setup

let phase = new GenericPhase();

async function evaluatePhase(){
    await phase.evaluate(null, new GenericEvent("test", "test", new Date()));

}

evaluatePhase();

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
