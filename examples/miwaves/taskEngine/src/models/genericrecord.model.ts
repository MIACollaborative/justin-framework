import { User } from "./user.model";
import { ITrigger } from './trigger.interface';

export class GenericRecord {
    record: Object;
    providedTimestamp: Date;
    generatedTimestamp: Date;

    constructor(record: Object, timestamp: Date) {
        this.record = record;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
    }
}