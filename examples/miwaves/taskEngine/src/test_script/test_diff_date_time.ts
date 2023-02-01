import GeneralUtility from "../utilities/generalutilities";

let date1 = new Date(1972, 2, 2, 18, 3, 40);
let date2 = new Date(1980, 3, 3, 19, 4, 30);


//console.log(`GeneralUtility.zeroAfterUnit: ${GeneralUtility.zeroAfterUnit(date1, "hour")}`);


//console.log(`GeneralUtility.syncDatesBeforeUnit: ${GeneralUtility.syncDatesBeforeUnit(date1, date2, "minute")}`);

//console.log(`GeneralUtility.syncDatesAfterUnit: ${GeneralUtility.syncDatesAfterUnit(date1, date2, "day")}`);


console.log(`GeneralUtility.initializeDateWithHourMinuteString: ${GeneralUtility.initializeDateWithHourMinuteString("05:00 PM", "America/New_York")}`);

//console.log(`GeneralUtility.areDatesMatchedUpByGranularity: ${GeneralUtility.areDatesMatchedUpByGranularity(date1, date2, "minute")}`);