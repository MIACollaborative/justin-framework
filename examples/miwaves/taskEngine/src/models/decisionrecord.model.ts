import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

export class DecisionRecord extends GenericRecord {
    user: User;
    triggerId: string;
    /*
    record: Object;
    providedTimestamp: Date;
    generatedTimestamp: Date;
    */


    constructor(user: User, triggerId: string, record: Object, timestamp: Date) {
        super(record, timestamp);

        this.user = user;
        this.triggerId = triggerId;

        /*
        this.record = record;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
        */
    }
}