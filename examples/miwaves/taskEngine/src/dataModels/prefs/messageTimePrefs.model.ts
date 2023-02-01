
export class MessageTimePrefs {
    // unfortunately no way to enforce static properties
    // on classes in TS -- needs to be a convention I guess
    public static KEY: string = "messageTimePrefs";
    public namedTimes: NamedTime[]; 
}

export class NamedTime {
    public name: string;
    public time: Date;
}