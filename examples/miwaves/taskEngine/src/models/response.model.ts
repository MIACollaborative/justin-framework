import { DateTime } from 'luxon';
import { ObjectId } from 'mongodb';
import { isNull } from 'util';

export class UserResponse {
    private id: string | undefined;
    private participantId: string;
    private surveyId: string;
    private surveyParamsString: string | undefined;
    private content: Object;
    private createdAt: Date;

    constructor(
        id: string | undefined, 
        participantId: string,
        surveyId: string,
        surveyParamsString: string, 
        content: Object,
        createdAt: Date) {
            this.id = id;
            this.participantId = participantId;
            this.surveyId = surveyId;
            this.surveyParamsString = surveyParamsString;
            this.content = content;
            this.createdAt = createdAt;
    }

    public static fromMongoDoc(mongoDoc: Object | null) {
        
        if (mongoDoc === null) return null;

        let id = mongoDoc['_id'].toString();
        return new UserResponse(
            id, 
            mongoDoc['participantId'], 
            mongoDoc['surveyId'], 
            mongoDoc['surveyParamsString'],
            mongoDoc['content'], 
            mongoDoc['createdAt']);

    }

    public getParticipantId() {
        return this.participantId;
    }

    public getSurveyId() {
        return this.surveyId;
    }

    public getSurveyParamsString(): string|undefined {
        return this.surveyParamsString;
    }

    public getContent(): Object {
        return this.content;
    }

    public getCreatedAt(): Date{
        return this.createdAt;
    }
}
