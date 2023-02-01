import { DateTime, Interval, Duration, DurationUnit, DurationLikeObject, DurationObjectUnits, DateTimeUnit, ToRelativeUnit } from "luxon";

export default class GeneralUtility {

    static unitList = ["year", "month", "day", "hour", "minute", "second", "millisecond"];

    static getLocalTime(date: Date, timezone:string) {
        return DateTime.fromJSDate(date).setZone(timezone);
    }

    static getLocalTimeWithOffset(date: Date, offset: number) {
        let zoneName = DateTime.now().toUTC(offset).zoneName;
        return DateTime.fromJSDate(date).setZone(zoneName);
    }

    static timezoneNameToOffset(zoneName: string): number{
        return DateTime.now().setZone(zoneName).offset;
    }

    static initializeDateWithHourMinuteString(hourMinuteString:string, timeszoneString: string):Date {
        console.log(`initializeDateWithHourMinuteString: ${hourMinuteString}, ${timeszoneString}`);
        let datetime = DateTime.fromFormat(hourMinuteString, "t", { zone: timeszoneString });

        return datetime.toJSDate();
    }

    static initializeDateWithHourMinuteStringWithOffset(hourMinuteString:string, offset: number):Date {
        console.log(`initializeDateWithHourMinuteStringWithOffset: ${hourMinuteString}, ${offset}`);

        let zoneName = DateTime.now().toUTC(offset).zoneName;

        let datetime = DateTime.fromFormat(hourMinuteString, "t", { zone: zoneName });

        console.log(`initializeDateWithHourMinuteStringWithOffset: result: ${datetime}`);

        return datetime.toJSDate();
    }
;
    static areDatesMatchedUpByGranularity(date1:Date, date2:Date, unitString:DateTimeUnit):boolean {
        let result = false;

        let datetime1 = DateTime.fromJSDate(GeneralUtility.zeroAfterUnit(date1, unitString));
        let datetime2 = DateTime.fromJSDate(GeneralUtility.zeroAfterUnit(date2, unitString));

        console.log(`${this.name}.areDatesMatchedUpByGranularity before comparison date1: ${datetime1}`);
        console.log(`${this.name}.areDatesMatchedUpByGranularity before comparison date2: ${datetime2}`);

        let unitsString = `${unitString}s`;
        let diffDateTime:Duration = GeneralUtility.diffDateTime(datetime1, datetime2, [unitsString as keyof DurationObjectUnits]);

        console.log(`diffDateTime: ${JSON.stringify(diffDateTime.toObject())}`);

        
        if ( (diffDateTime.toObject())[unitsString as keyof DurationObjectUnits] != 0) {
            result = false;
        }
        else {
            result = true;
        }

        return result;
    }  
    
    static zeroAfterUnit(dateA:Date, unitString:string): Date {
        //console.log(`${this.name}.zeroAfterUnit before zeroing: ${dateA}`);
        let newDateTime = DateTime.fromJSDate(dateA);


        let unitIndex = GeneralUtility.unitList.indexOf(unitString);

        for(let i = 0; i < this.unitList.length; i++){
            let curUnit = this.unitList[i];

            //console.log(`curUnit: ${curUnit}`);

            if(i > unitIndex){
                let option = {[curUnit as keyof DurationObjectUnits]: 0};
                //console.log(`curUnit set 0: ${JSON.stringify(option)}`);
                newDateTime = newDateTime.set(option);
            }
        }
        
        //console.log(`${this.name}.zeroAfterUnit before return: ${newDateTime}`);

        return newDateTime.toJSDate();
    }

    static syncToFirstDateBeforeUnit(date1:Date, date2:Date, unitString:DateTimeUnit): Date[] {

        let unitIndex = GeneralUtility.unitList.indexOf(unitString);

        let datetime1 = DateTime.fromJSDate(date1);
        let datetime2 = DateTime.fromJSDate(date2);

        

        for(let i = 0; i < this.unitList.length; i++){
            let curUnit = this.unitList[i];

            if(i < unitIndex){

                let unitsString = `${unitString}s`;

                let option = {[curUnit as keyof DurationObjectUnits]: datetime1.get(curUnit as keyof DateTime)};
                console.log(`curUnit set : ${JSON.stringify(option)}`);
                datetime2 = datetime2.set(option);
            }
        }
        
        //console.log(`${this.name}.zeroAfterUnit before return: ${newDateTime}`);

        return [date1, datetime2.toJSDate()];
    }

    static syncDatesAfterUnit(date1:Date, date2:Date, unitString:DateTimeUnit): Date[] {

        let unitIndex = GeneralUtility.unitList.indexOf(unitString);

        let datetime1 = DateTime.fromJSDate(date1);
        let datetime2 = DateTime.fromJSDate(date2);

        

        for(let i = 0; i < this.unitList.length; i++){
            let curUnit = this.unitList[i];

            if(i > unitIndex){

                let unitsString = `${unitString}s`;

                let option = {[curUnit as keyof DurationObjectUnits]: datetime1.get(curUnit as keyof DateTime)};
                console.log(`curUnit set : ${JSON.stringify(option)}`);
                datetime2 = datetime2.set(option);
            }
        }
        
        //console.log(`${this.name}.zeroAfterUnit before return: ${newDateTime}`);

        return [date1, datetime2.toJSDate()];
    }

    static diffDateTime(datetimeA:DateTime, datetimeB:DateTime, unitsList: DurationUnit[]): Duration {

        return datetimeB.diff(datetimeA, unitsList);
    }

    static reduceBooleanArray(bArray, operator){
        let result = true;

        let initialValue = bArray.length > 0? bArray[0]: false;

        switch(operator){
            case "and":
                result = bArray.reduce((previousValue, currentValue) => previousValue && currentValue,initialValue);
                break;
            case "or":
                result = bArray.reduce((previousValue, currentValue) => previousValue || currentValue,initialValue);
                break;
            case "not any":
                result = !bArray.reduce((previousValue, currentValue) => previousValue || currentValue,initialValue);
                break;
            default:
                break;
        }
        
        return result;
      }
}