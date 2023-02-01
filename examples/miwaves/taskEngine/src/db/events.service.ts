import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { User } from '../models/user.model';
import { TriggerRecord } from '../models/triggerrecord.model';

let drCollection: Collection;

let archiveCollection: Collection;



export async function getEventCollection() {
    if (!drCollection) {
        const db = await getDB();
        drCollection = db.collection(process.env.EVENT_COLLECTION_NAME!);
    }
    return drCollection;
}

export async function getEventArchiveCollection() {
    if (!archiveCollection) {
        const db = await getDB();
        archiveCollection = db.collection(process.env.EVENT_ARCHIVE_COLLECTION_NAME!);
    }
    return archiveCollection;
}

export async function addEvent(record: Object) {
    let uColl = await getEventCollection();
    return await uColl.insertOne(record);
}

export async function updateEvent(record: Object, update: Object) {
    console.log(`updateEvent(): id: ${record["_id"]}`);
    let uColl = await getEventCollection();
    return await uColl.updateOne({_id: new ObjectId( record["_id"]) }, update);
}

export async function archiveEvent(record: Object, update: Object) {
    console.log(`archiveEvent(): id: ${record["_id"]}`);
    let uColl = await getEventCollection();

    let aColl = await getEventArchiveCollection();

    // first, insert to the new archive
    let archiveItem = {...record, ...update, _id: undefined};
    console.log(`About to insert into archive: ${JSON.stringify(archiveItem)}`);
    let archivedRecord = await aColl.insertOne(archiveItem);

    // second, remove it from the event queue
    console.log(`About to remove from the original event queue`);
    let deleteRecord = await uColl.deleteOne({_id: new ObjectId( record["_id"]) });
    console.log(`deleteRecord: ${JSON.stringify(deleteRecord)}`);

    return archivedRecord;
}