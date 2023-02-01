import { User } from "../models/user.model";
import { ITrigger } from '../models/trigger.interface';
import { GenericRecord } from "../models/genericrecord.model";
import { GenericEvent } from "../models/genericevent.model";

export class UserResponseEvent extends GenericEvent {
    // As a start, use genericevent 
    // assuming that the providedTimestamp is the intended clock value

    
    
    name: string = "user-response";
    /*
    name: string;
    userName: string;
    providedTimestamp: Date;
    generatedTimestamp: Date;
    */
    
    promptType: string;
    promptId: string;
    responseId: string;


    
    constructor(name: string, userName: string, timestamp: Date, promptType: string, promptId: string, responseId: string) {
        super(name, userName, timestamp);
        this.promptType = promptType;
        this.promptId = promptId;
        this.responseId = responseId;
    }
}