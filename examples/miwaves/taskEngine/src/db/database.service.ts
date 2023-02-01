import * as mongo from 'mongodb';

let db: mongo.Db;

export async function getDB () {
    if (!db) {
        const client: mongo.MongoClient = new mongo.MongoClient(process.env.DB_CONN_STRING!);
        await client.connect();
        db = client.db(process.env.DB_NAME!);
    }
    return db;
}
