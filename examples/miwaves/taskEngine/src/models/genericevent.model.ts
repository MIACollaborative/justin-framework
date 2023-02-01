import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

export class GenericEvent {
    name: string;
    userName: string;
    status: string;
    providedTimestamp: Date;
    generatedTimestamp: Date;


    constructor(name: string, userName: string, timestamp: Date) {
        this.name = name;
        this.userName = userName;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
        this.status = "new";
    }
}