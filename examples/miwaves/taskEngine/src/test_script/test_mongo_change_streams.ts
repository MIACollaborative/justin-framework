import * as dotenv from 'dotenv';
import { addEvent } from '../db/events.service';
import { GenericEventSubscriber } from "../models/genericeventsubscriber.model";

dotenv.config();

let filterList: Object[] =  [{ $match: { 
    "operationType": "insert",
    "fullDocument.name": "MyRandomEvent1" } 
}];

let eventSubscriber = new GenericEventSubscriber("justin", "events", filterList);

function myEventHandler(event:Object){
    console.log(`Got an event: ${event}`);
}

async function mySubscribe(){
    eventSubscriber.addListener(myEventHandler);
    return await eventSubscriber.subscribe();
}

mySubscribe();

function myAddEvent(): void{
    console.log(`myAddEvent(s)`);
    addEvent({
        name: "MyRandomEvent1",
        timestamp: new Date()
    });
    /*
    addEvent({
        name: "MyRandomEvent2",
        timestamp: new Date()
    });
    */
}

let myVar = setInterval(myAddEvent, 1000);
//clearTimeout(myVar);



