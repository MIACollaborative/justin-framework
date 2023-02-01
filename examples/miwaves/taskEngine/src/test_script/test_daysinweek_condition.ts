import DaysInAWeekTriggerCondition from "../conditions/daysinweek.triggercondition";
import * as userService from '../db/users.service';

// setup




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
