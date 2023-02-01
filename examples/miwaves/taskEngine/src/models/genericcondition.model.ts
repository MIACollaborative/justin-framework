import { User } from "./user.model";
import { ITrigger } from './trigger.interface';
import { GenericRecord } from "./genericrecord.model";

import { GenericEvaluable } from "./genericevaluable.model";

export class GenericCondition extends GenericEvaluable {
    forValidity: boolean = false;
    resultType: string = "generic";

    generateRecord( recordObj:Object, curTime: Date):GenericRecord{
        let basis = {name: this.name, resultType: this.resultType, validity: this.forValidity? recordObj["value"]: true};
        return super.generateRecord({...basis, ...recordObj}, curTime);
        //return new GenericRecord({...basis, ...recordObj}, curTime);
    }

}