import { loadTestUsers } from "./loadusers.tests";
import { loadTestTriggers } from "./loadtriggers.tests";
import { doTick } from "../main";

import nodeCron from "node-cron";


// '*/2 * * * * *' -> every 2 seconds
// '*/10 * * * * *' -> every 10 seconds
// '* * * * *' -> every 1 minute

let expressionLabelDict = {
    "1 minute": {
        label: 'every 1 minute',
        expression: '* * * * *'
    },
    "10 seconds": {
        label: 'every 10 seconds',
        expression: '*/10 * * * * *'
    }

};

async function doTests() {
    console.log('running tests through cron');

    await loadTestUsers();
    await loadTestTriggers();


    let theExpression = expressionLabelDict["10 seconds"];


    nodeCron.schedule(theExpression.expression, async () => {
        let cronTime = process.hrtime();
        console.log(`execute cron task ${theExpression.label} at ${cronTime}`);

        let t1 = process.hrtime();
        await doTick(new Date(2022, 8, 19, 20, 0, 0));
        //await doTick(new Date());
        let t2 = process.hrtime();
        console.log('did tick in', (t2[1] - t1[1]) / 1000000, 'ms');
    });

}

doTests();
