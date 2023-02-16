import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { promises as fs } from 'fs';
import { ITrigger } from '../models/trigger.interface';
import {GenericStep} from "../models/generic-step.model";
import path from 'path';

let configCollection: Collection;

async function getConfigCollection() {
    if (!configCollection) {
        const db = await getDB();
        configCollection = db.collection(process.env.CONFIG_COLLECTION_NAME!);
    }
    return configCollection;
}

async function fileExists(path: string) {
    try {
        await fs.access(path); 
        return true;
    } catch {
        return false;
    }
}


// Trigger

async function importTrigger(triggerPath: string) {
    let trigger = await import(triggerPath);
    return new trigger.default();
}

export async function getTriggers() {
    let cfgColl = await getConfigCollection();
    let triggerDoc = await cfgColl.find({_id: 'triggers'}).next();
    let triggerNames = triggerDoc!.triggers;

    console.log(`triggerNames: ${triggerNames}`);

    let triggerPaths = [
        process.env.JUSTIN_CORE_PATH,
        process.env.JUSTIN_APP_PATH
    ];

    let triggerObjects: ITrigger[] = [];

    // instantiate Triggers
    for (let tName of triggerNames) {
        // look for each trigger in JUSTIN_CORE_PATH, etc.
        for (let tPath of triggerPaths) {
            let tFullPath = tPath + '/src/triggers/' + tName + ".ts";
            if (await fileExists(tFullPath)) {
                console.log("will try to load trigger", tFullPath);
                triggerObjects.push(await importTrigger(tFullPath));
            } else {
                console.log("couldn't find trigger:", tFullPath);
            }
        }        
    }
    return triggerObjects;
}

export async function clearTriggers() {
    let cfgColl = await getConfigCollection();
    let triggerDoc = await cfgColl.find({_id: 'triggers'}).next();
    if (triggerDoc) {
        triggerDoc!.triggers = [];
        await cfgColl.replaceOne({_id: 'triggers'}, triggerDoc!);
    } else {
        let triggerDocX = {
            _id: 'triggers',
            triggers: []
        }
        // @ts-ignore
        await cfgColl.insertOne(triggerDocX); // this actually works, but makes TS mad
    }
}

export async function addTrigger(trigger: string) {
    let cfgColl = await getConfigCollection();
    let triggerDoc = await cfgColl.find({_id: 'triggers'}).next();
    triggerDoc!.triggers.push(trigger);
    await cfgColl.replaceOne({_id: 'triggers'}, triggerDoc!);
}

// Step

async function importStep(stepPath: string) {
    let step = await import(stepPath);
    return new step.default();
}

export async function getSteps() {
    let cfgColl = await getConfigCollection();
    console.log(`cfgColl: ${cfgColl}`);
    let stepDoc = await cfgColl.find({_id: 'steps'}).next();
    console.log(`stepDoc: ${JSON.stringify(stepDoc)}`);
    let stepNames = stepDoc!.steps;

    console.log(`stepNames: ${stepNames}`); 

    let stepPaths = [
        process.env.JUSTIN_CORE_PATH,
        process.env.JUSTIN_APP_PATH
    ];

    let stepObjects: GenericStep[] = [];

    // instantiate Triggers
    for (let tName of stepNames) {
        // look for each trigger in JUSTIN_CORE_PATH, etc.
        for (let tPath  of stepPaths) {
            let tFullPath = path.join(tPath as string, '/src/steps/', tName + ".ts");
            if (await fileExists(tFullPath)) {
                console.log("will try to load step", tFullPath);
                stepObjects.push(await importStep(tFullPath));
            } else {
                console.log("couldn't find step:", tFullPath);
            }
        }        
    }
    return stepObjects;
}

export async function clearSteps() {
    let cfgColl = await getConfigCollection();
    let stepDoc = await cfgColl.find({_id: 'steps'}).next();
    if (stepDoc) {
        stepDoc!.steps = [];
        await cfgColl.replaceOne({_id: 'steps'}, stepDoc!);
    } else {
        let stepDocX = {
            _id: 'steps',
            steps: []
        }
        // @ts-ignore
        await cfgColl.insertOne(stepDocX); // this actually works, but makes TS mad
    }
}

export async function addStep(step: string) {
    let cfgColl = await getConfigCollection();
    let stepDoc = await cfgColl.find({_id: 'steps'}).next();
    stepDoc!.steps.push(step);
    await cfgColl.replaceOne({_id: 'steps'}, stepDoc!);
}