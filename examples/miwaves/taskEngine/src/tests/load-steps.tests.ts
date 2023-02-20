import { User } from "../models/user.model";
import { clearSteps, addStep } from '../db/studyconfig.service';

const testSteps = [
    "start.step", "end.step","true.step", "false.step", "check-all-true.step", "get-time.step", "match-two-time.step", "get-user-prefer-time.step", "get-event-name.step", "is-event-name.step"
]

export async function loadTestSteps() { 
    await clearSteps();

    for (let tt of testSteps) {
        await addStep(tt);
    }
}