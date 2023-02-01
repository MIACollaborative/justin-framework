import { UserResponse } from "../models/response.model";
import { clearResponses, addResponse, getResponseById, getResponseByParticipantId } from "../db/responses.service";
import { testUsers } from "./loadusers.tests";

export const testResponses = [
    new UserResponse("1", testUsers[0].getUsername(), "survey-am", "", [1,2,3], new Date(2022, 9, 4, 9, 0, 0)),
    new UserResponse("2", testUsers[0].getUsername(), "survey-pm", "", [1,2,3], new Date(2022, 9, 4, 15, 0, 0)),
    new UserResponse("3", testUsers[1].getUsername(), "survey-am", "", [1,2,3], new Date(2022, 9, 4, 11, 0, 0)),
    new UserResponse("4", testUsers[1].getUsername(), "survey-pm", "", [1,2,3], new Date(2022, 9, 4, 17, 0, 0))
]


export async function loadTestResponses() {
    console.log('in loadTestResponses, clearing')
    await clearResponses();

    for (let item of testResponses) {
        await addResponse(item);
    }
    return testResponses;
}

export async function findResponse(userId: string) {
    let u = await getResponseById(userId);
    return u;
}
