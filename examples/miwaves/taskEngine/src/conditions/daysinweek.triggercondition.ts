
import { User } from '../models/user.model';
import { GenericRecord } from '../models/genericrecord.model';
import GeneralUtility from '../utilities/generalutilities';
import { DateTime } from 'luxon';
import { GenericCondition } from '../models/genericcondition.model';
import { GenericEvent } from '../models/genericevent.model';
import { GenericEventCondition } from '../models/genericeventcondition.model';

export default class DaysInAWeekTriggerCondition extends GenericEventCondition {

    name: string = "DaysInAWeekTriggerCondition";
    eventName: string = "clock";

    #daysInWeekIndexList: number[];


    constructor(daysInWeekIndexList: number[], forValidity: boolean = false) {
        super();
        this.#daysInWeekIndexList = daysInWeekIndexList;
        this.forValidity = forValidity;
    }

    async evaluate(user: User | null, event:GenericEvent): Promise<GenericRecord> {
        let curTime = event.providedTimestamp;
        console.log(`[Condition]`, this.getName(), `daysInWeekIndexList`, this.#daysInWeekIndexList);

        let result = false;
        let weekIndex = -1;

        // version 2: use user state "timezone"
        let targetTime;
        if (user && user.getState() != undefined) {
            let userState = user.getState() as Object;
            let gmtOffset = userState["timezone"]["gmtOffsetInMinutes"]; // (userState["timezone"] as TimeZoneState).getGMTOffsetInMinutes();

            targetTime = GeneralUtility.getLocalTimeWithOffset(curTime, gmtOffset);
            weekIndex = targetTime.weekday;
        }
        

        console.log(`[Condition]`, this.getName(), `weekIndex`, weekIndex);
        

        result =  this.#daysInWeekIndexList.includes(weekIndex);

        return this.generateRecord({value: result, daysInWeekIndexList: this.#daysInWeekIndexList}, curTime);
    }

    static fromSpec(spec: {daysInWeekIndexList: number[], forValidity: boolean}): GenericCondition {
     
     let newTCondition = new DaysInAWeekTriggerCondition(spec["daysInWeekIndexList"], spec["forValidity"]);
     
     return newTCondition;

    }

}