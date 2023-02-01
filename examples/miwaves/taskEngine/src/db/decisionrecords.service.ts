import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { User } from '../models/user.model';
import { DecisionRecord } from '../models/decisionrecord.model';

let drCollection: Collection;

async function getDecisionRecordCollection() {
    if (!drCollection) {
        const db = await getDB();
        drCollection = db.collection(process.env.DECISIONRECORD_COLLECTION_NAME!);
    }
    return drCollection;
}

export async function addDecisionRecord(decisionRecord: DecisionRecord) {
    let uColl = await getDecisionRecordCollection();
    await uColl.insertOne(decisionRecord);
}