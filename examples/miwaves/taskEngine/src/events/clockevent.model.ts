import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";

export class ClockEvent extends GenericEvent {
    // As a start, use genericevent 
    // assuming that the providedTimestamp is the intended clock value
    
    /*
    name: string;
    userName: string;
    providedTimestamp: Date;
    generatedTimestamp: Date;

    constructor(name: string, userName: string, timestamp: Date) {
        this.name = name;
        this.userName = userName;
        this.providedTimestamp = timestamp;
        this.generatedTimestamp = new Date();
    }
    */
}