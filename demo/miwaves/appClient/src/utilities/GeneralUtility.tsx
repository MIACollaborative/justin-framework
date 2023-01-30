
export default class GeneralUtility {

    // just an example
    static FITBIT_INTRADAY_DATA_TYPE_ACTIVITY_SUMMARY = "activity-summary";
    

    static isObjectEmpty(obj: Object) {
        
        if(obj == undefined){
            return false;
        }

        let keys = Object.keys(obj);

        return keys.length == 0;
    }

}