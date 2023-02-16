import { GenericEvent } from "../models/genericevent.model";
import { GenericPhase } from "../models/generiphase.model";
import { SimplePhase } from "../phases/simple.phase";
// setup

let phase = new SimplePhase();// new GenericPhase();

async function evaluatePhase(){
    await phase.evaluate(null, new GenericEvent("test", "test", new Date()));

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
