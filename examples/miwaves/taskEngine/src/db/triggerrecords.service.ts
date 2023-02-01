import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { User } from '../models/user.model';
import { TriggerRecord } from '../models/triggerrecord.model';

let drCollection: Collection;

async function getTriggerRecordCollection() {
    if (!drCollection) {
        const db = await getDB();
        drCollection = db.collection(process.env.TRIGGERRECORD_COLLECTION_NAME!);
    }
    return drCollection;
}

export async function addTriggerRecord(record: TriggerRecord) {
    let uColl = await getTriggerRecordCollection();
    await uColl.insertOne(record);
}