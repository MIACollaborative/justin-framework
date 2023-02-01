import { User } from "../models/user.model";
import { clearTriggers, addTrigger } from '../db/studyconfig.service';

const testTriggers = [
    "userresponse.trigger"
    /* 'nonexistent.trigger', 'usertimepref.trigger',  'fixedtime.trigger', 'daysinweek.trigger', "daysinweekfixedtime.trigger", "eventname.trigger", "userresponse.trigger"*/
]

export async function loadTestTriggers() {
    await clearTriggers();

    for (let tt of testTriggers) {
        await addTrigger(tt);
    }
}