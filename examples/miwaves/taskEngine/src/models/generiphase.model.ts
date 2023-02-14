import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericPhase extends GenericEvaluable {

    // this should record how a collection of steps in this phase shoud be evaluated in sequence
    stepFlowObject: Object;

    /*
    async evaluate(user:User, curTime:Date, metaObject?:Object):Promise<GenericRecord>{
        return Promise.resolve(this.generateRecord({}, curTime));
    }
    */

}