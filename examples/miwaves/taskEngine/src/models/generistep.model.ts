import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericStep extends GenericEvaluable {
    
    /*
    async evaluate(user:User, curTime:Date, metaObject?:Object):Promise<GenericRecord>{
        return Promise.resolve(this.generateRecord({}, curTime));
    }
    */

}