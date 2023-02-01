import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { GenericEvent } from "./genericevent.model";
import { GenericCondition } from "./genericcondition.model";
import { GenericArbiter } from "./genericarbiter.model";

export class GenericConditionArbiter extends GenericCondition {
    resultType: string = "composite";

    async evaluate(user:User, event:GenericEvent, metaObject:{evaluableList: GenericCondition[]}):Promise<GenericRecord>{
        // origianl generic version
        return Promise.resolve(this.generateRecord({}, event.providedTimestamp));
    }

    /*
    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        // To Do: need to handle validity?
        return new GenericRecord(recordObj, curTime);
    }
    */
    
    // the idea of generating an evaluable (that is callable) .... not implemented yet
    static compose(user:User, event:GenericEvent, metaObject:{evaluableList: GenericCondition[]}): GenericConditionArbiter{
        return new GenericConditionArbiter();
    }

}