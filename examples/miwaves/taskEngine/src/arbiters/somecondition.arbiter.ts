import { User } from "../models/user.model";
import { GenericRecord } from "../models/genericrecord.model";
import { GenericCondition } from "../models/genericcondition.model";
import GeneralUtility from "../utilities/generalutilities";
import { GenericEvent } from "../models/genericevent.model";
import { GenericConditionArbiter } from "../models/generic-condition-arbiter.model";

export class SomeConditionArbiter extends GenericConditionArbiter {

    name: string = "SomeConditionArbiter";

    #metaObject:{evaluableList: GenericCondition[]};

    async evaluate(user:User, event:GenericEvent, metaObject?:{evaluableList: GenericCondition[]}):Promise<GenericRecord>{

        let eList = metaObject != undefined? metaObject.evaluableList: this.#metaObject.evaluableList;


        let conditionEvaluationResultList:GenericRecord[] = [];
        for(let i = 0 ; i < eList.length; i++){
            let condition:GenericCondition = eList[i];
            let resultRecord:GenericRecord = await condition.evaluate(user, event);
            conditionEvaluationResultList.push(resultRecord);

            console.log(`${this.name}.evaluate(${condition.getName()}): record: ${JSON.stringify(resultRecord, null, 2)}`);

            // if we want to speed thing up by enforcing validity to be true
            console.log(`${this.name}.evaluate(${condition.getName()}): validity: ${resultRecord['record']['validity']}`);

            // it shoudl jsut be about value, since it is an "and" operation
            if(resultRecord['record']['value']){
                // stop as soon as we find one condition to be invalid
                // (meaning, the triiger was not even worth of considering)
                console.log(`${this.name}.evaluate: ${condition.getName()}.value == true, skipping the rest of the conditions.`);
                break;
            }

            // because it is or, we will go through all
            /*
            if(!resultRecord['record']['validity']){
                // stop as soon as we find one condition to be invalid
                // (meaning, the triiger was not even worth of considering)
                console.log(`${this.name}.evaluate: ${condition.getName()}.validity == false, skipping the rest of the conditions.`);
                break;
            }
            */
        }

        let result = true;

        let valueList = conditionEvaluationResultList.map((record) => {
            return record['record']['value'];
        });

        console.log(`${this.name}: valueList: ${valueList}`);

        result = GeneralUtility.reduceBooleanArray(valueList, "or");

        // validity: most likely use "and", but people can customize
        let validity = true;

        let validityList = conditionEvaluationResultList.map((record) => {
            return record['record']['validity'];
        });

        console.log(`${this.name}: validityList: ${validityList}`);

        validity = GeneralUtility.reduceBooleanArray(validityList, "or");

        return this.generateRecord({value: result, validity: validity,  recordList: conditionEvaluationResultList}, event.providedTimestamp);

        //return new GenericRecord({value: result, validity: validity,  recordList: conditionEvaluationResultList}, event.providedTimestamp);
    }

    setMetaObject(metaObject:{evaluableList: GenericCondition[]}){
        this.#metaObject = metaObject;
    }



    /*
    static compose(user:User, curTime:Date, metaObject:{evaluableList: GenericEvaluable[]}): GenericArbiter{
        return new GenericArbiter();
    }
    */

}