import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";
import { GenericEvent } from "./genericevent.model";

export class GenericEvaluable {
    name:string = "GenericEvaluable";

    async evaluate(user: User | null, event:GenericEvent, metaObj?:Object):Promise<GenericRecord>{
        return await this.generateRecord({}, event.providedTimestamp);
    }

    getName():string{
        return this.name;
    }

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        return new GenericRecord(recordObj, curTime);
    }
}