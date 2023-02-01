
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { TimeZoneState } from '../dataModels/state/timezoneState.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';


// implements ITriggerCondition
/*
function staticImplements<T>() {
    return <U extends T>(constructor: U) => {constructor};
}
@staticImplements<ITriggerConditionStatic>()
*/

export default class FixedTimeTriggerCondition extends GenericEventCondition {

    name: string = "FixedTimeTriggerCondition";
    eventName: string = "clock";

    #targetTimeString: string = "12:04 PM";

    constructor(targetTimeString: string, forValidity: boolean) {
        super();
        this.#targetTimeString = targetTimeString;
        this.forValidity = forValidity;
    }

    async evaluate(user: User, event: GenericEvent): Promise<GenericRecord> {
        console.log(`[Condition]`, this.getName(), `targetTimeString`, this.#targetTimeString);

        let curTime = event.providedTimestamp;

        // assuming this is the user timezone
        // next step: retrieving it from the user state?

        
        //let userTimezoneString = "America/New_York";

        // version 2: use user state "timezone"
        
        let targetTime;
        if (user && user.getState() != undefined) {
            let userState = user.getState() as Object;
            console.log(`${this.name}.evaluate(). #targetTimeString: ${this.#targetTimeString}, userState: ${JSON.stringify(userState)}`);

            //console.log(`${this.name} something before general utilities`);
            
            //targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.#targetTimeString, userTimezoneString);
        

            let gmtOffset = userState["timezone"]["gmtOffsetInMinutes"]; // (userState["timezone"] as TimeZoneState).getGMTOffsetInMinutes();
            targetTime = GeneralUtility.initializeDateWithHourMinuteStringWithOffset(this.#targetTimeString, gmtOffset);
        }
        


        // version 1: assume a timezone Name
        
        /*
        let userTimezoneString = "America/New_York";
        let targetTime = GeneralUtility.initializeDateWithHourMinuteString(this.#targetTimeString, userTimezoneString);
        */

        targetTime = GeneralUtility.syncToFirstDateBeforeUnit(curTime, targetTime, "hour")[1];

        let result = GeneralUtility.areDatesMatchedUpByGranularity(curTime, targetTime, "minute");

        return this.generateRecord({ value: result, targetTimeString: this.#targetTimeString }, curTime);
    }

    static fromSpec(spec: { targetTimeString: string, forValidity: boolean }): GenericCondition {

        let newTCondition = new FixedTimeTriggerCondition(spec["targetTimeString"], spec["forValidity"]);

        return newTCondition;

    }

}