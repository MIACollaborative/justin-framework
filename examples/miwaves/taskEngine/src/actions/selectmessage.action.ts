import { User } from "../models/user.model";

let messageBank: Message [] = [
    {id: 'm1', text: 'message 1'},
    {id: 'm2', text: 'message 2'},
    {id: 'm3', text: 'message 3'},
    {id: 'm4', text: 'message 4'},
]

export function selectMessage(user: User, curTime: Date): Message {
    let index: number = Math.floor(Math.random() * messageBank.length);
    return messageBank[index];
}

class Message {
    id: string;
    text: string;
}