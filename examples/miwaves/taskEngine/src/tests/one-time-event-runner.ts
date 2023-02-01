import { loadTestUsers } from "./loadusers.tests";
import { loadTestTriggers } from "./loadtriggers.tests";
import { doEvent } from "../main";
import * as dotenv from 'dotenv';
import { GenericEventSubscriber } from "../models/genericeventsubscriber.model";
import { GenericEvent } from "../models/genericevent.model";
import nodeCron from "node-cron";
import { DateTime } from "luxon";
import { ClockEvent } from "../events/clockevent.model";
import { addEvent, archiveEvent} from '../db/events.service';
import { UserResponseEvent } from "../events/userresponseevent.model";


dotenv.config();


async function execute(){
    let cronTime = process.hrtime();
    console.log(`execute cron event generation task at ${cronTime}`);
    let t1 = process.hrtime();

    // for testing: 2022-09-19 08:00 PM
    let now = new Date(2022, 8, 19, 2, 55, 0); //EDT/EST

    let cEvent = new UserResponseEvent("user-response", "participant1", now, "survey", "testSurveyId1", "testReponseId1");

    console.log(`Event: ${JSON.stringify(cEvent)}`);

    await addEvent(cEvent);

    cEvent = new UserResponseEvent("user-response", "participant2", now, "survey", "testSurveyId2", "testReponseId2");

    console.log(`Event: ${JSON.stringify(cEvent)}`);

    await addEvent(cEvent);

    

    let t2 = process.hrtime();
    console.log('Generate an event in', (t2[1] - t1[1]) / 1000000, 'ms');

}


async function doTests() {
    console.log('running tests through event');

    await loadTestUsers();
    await loadTestTriggers();

    let filterList: Object[] =  [{ $match: { 
        "operationType": "insert",
        //"fullDocument.name": "MyRandomEvent1" 
    } 
    }];

    let eventSubscriber = new GenericEventSubscriber("justin", "events", filterList);

    async function myEventHandler(event:{fullDocument:GenericEvent}){
        //console.log(`Got an event: ${event}`);
        let cronTime = process.hrtime();


        let t1 = process.hrtime();
        //await doTick(new Date(2022, 7, 26, 17, 1, 0));
        //await doTick(new Date());

        console.log(`About to doEvent: ${event.fullDocument}`);
        await doEvent(new Date(), event.fullDocument);

        // now, mark the event as done
        let archiveResult = await archiveEvent(event.fullDocument, {status: "processed"});

        console.log(`archiveResult: ${JSON.stringify(archiveResult)}`);

        let t2 = process.hrtime();
        console.log('did tick in', (t2[1] - t1[1]) / 1000000, 'ms');
    }

    async function mySubscribe(){
        eventSubscriber.addListener(myEventHandler);
        return eventSubscriber.subscribe();
    }

    mySubscribe().then(async (response) => {
        return await execute();
    })
    

}

doTests();
