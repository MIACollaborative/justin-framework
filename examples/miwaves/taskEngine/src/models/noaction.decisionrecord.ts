import { DecisionRecord } from "./decisionrecord.model";
import { User } from "./user.model";
import { ITrigger } from "./trigger.interface";

export class NoActionDecisionRecord extends DecisionRecord {
    user: User;
    triggerId: string;
    record: Object;
    timestamp: Date;

    constructor (user: User, triggerId: string, timestamp: Date) {
        super(user, triggerId, {action: "No Action"}, timestamp);
    }
}