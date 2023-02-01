import { Collection, ObjectId } from 'mongodb';
import { getDB } from './database.service';
import { UserResponse } from '../models/response.model';

let responseCollection: Collection;

async function getResponseCollection() {
    if (!responseCollection) {
        const db = await getDB();
        responseCollection = db.collection(process.env.RESPONSES_COLLECTION_NAME!);
    }
    return responseCollection;
}

// get all users
export async function getAllResponses() {
    let uColl = await getResponseCollection();
    let allDocs = await uColl.find({}).toArray();
    let docs = allDocs.map(aDoc => UserResponse.fromMongoDoc(aDoc));
    return docs; // TODO: turn these into Justin users
}

export async function addResponse(doc: UserResponse) {
    let uColl = await getResponseCollection();
    await uColl.insertOne(doc);
}

export async function clearResponses() {
    let uColl = await getResponseCollection();
    await uColl.deleteMany({});    
}

export async function getResponseById(id: string) {
    let uColl = await getResponseCollection();
    let objId = new ObjectId(id);
    let aDoc = await uColl.findOne( {_id: objId});
    // TODO: turn userDoc into a Justin User
    return UserResponse.fromMongoDoc(aDoc);
}

export async function getResponseByParticipantId(id: string, limit: number = 0, orderBy:string="_id", order:string="asc" ) {
    let uColl = await getResponseCollection();
    let objId = new ObjectId(id);
    let allDocs = await uColl.find({participantId: id}).sort({[orderBy]: order == "asc"? 1: -1}).limit(limit).toArray();
    let docs = allDocs.map(aDoc => UserResponse.fromMongoDoc(aDoc));
    return docs;
}

