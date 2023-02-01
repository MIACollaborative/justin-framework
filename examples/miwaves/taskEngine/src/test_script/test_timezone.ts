// [Note] nvm use 18.10.0
import {DateTime} from "luxon";

let dt = DateTime.now();

console.log(dt.zoneName); //=> 'America/New_York'
console.log(zoneNameToOffset('America/New_York')); //=> -240
console.log(dt.offset); //=> -4 (GMT - 4)
console.log(dt.offset/60); //=> -4 (GMT - 4)
console.log(dt.offsetNameShort); //=> 'EDT'
console.log(dt.offsetNameLong); //=> 'Eastern Daylight Time'
console.log(dt.isOffsetFixed); //=> false
console.log(dt.isInDST); //=> true

function offsetToZoneName(){
    // ok, this is hard, because it can represent a lot of different zones
}

function zoneNameToOffset(zoneName: string): number{
    return DateTime.now().setZone(zoneName).offset;
}

let zoneName = DateTime.now().toUTC(-240).zoneName;

let datetime = DateTime.fromFormat("05:00 PM", "t", { zone: zoneName });
console.log(`initializeDateWithHourMinuteStringWithOffset: result: ${datetime}, zoneName: ${datetime.zoneName}`);

zoneName = DateTime.now().toUTC(-420).zoneName;

datetime = DateTime.fromFormat("05:00 PM", "t", { zone: zoneName });
console.log(`initializeDateWithHourMinuteStringWithOffset: result: ${datetime}, zoneName: ${datetime.zoneName}`);


