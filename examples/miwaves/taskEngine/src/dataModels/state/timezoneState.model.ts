import {DateTime} from "luxon";
import GeneralUtility from "../../utilities/generalutilities";
export class TimeZoneState {
    public static KEY = 'timeZoneState';

    private gmtOffsetInMinutes: number;

    private zoneName?: string;

    private upateAt: Date;

    constructor(gmtOffset:number){
        this.setGMTOffset(gmtOffset);
    }

    setGMTOffset(gmtOffset:number){
        this.gmtOffsetInMinutes = gmtOffset;
        this.setUpdateAt(new Date());
    }

    getGMTOffsetInMinutes(){
        return this.gmtOffsetInMinutes;
    }

    getZoneName(){
        return this.zoneName;
    }

    getUpdateAt(){
        return this.upateAt;
    }

    setUpdateAt(date: Date){
        this.upateAt = date;
    }


    static fromZoneName(zoneName:string){
        let newState = new TimeZoneState(GeneralUtility.timezoneNameToOffset(zoneName));
        newState.zoneName = zoneName;
        return newState;
    }
}
