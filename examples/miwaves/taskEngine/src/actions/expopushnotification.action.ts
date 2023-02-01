import notifier from "node-notifier";
import { GenericAction } from "../models/genericaction.model";
import { GenericRecord } from "../models/genericrecord.model";
import { User } from "../models/user.model";
import { Expo } from 'expo-server-sdk';
import { GenericEvent } from "../models/genericevent.model";


//let expo = new Expo();

// let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

export default class ExpoPushNotificationAction extends GenericAction {

  name: string = "ExpoPushNotificationAction";

  // wait.... let me make a script work first
  #expo:Expo = new Expo();

  #message:string;
  #title: string;

  constructor(metaObj: {title:string, message:string}) {
    super();
    this.#title = metaObj["title"];
    this.#message = metaObj["message"];
  }
  
  async evaluate(user: User, event: GenericEvent): Promise<GenericRecord> {
    let curTime = event.providedTimestamp;
      console.log(`[Action]`, this.getName(), `curTime`, curTime);

      let result = await notifier.notify(
        {
          title: this.#title,
          message: this.#message,
          //icon: path.join(__dirname, 'coulson.jpg'), // Absolute path (doesn't work on balloons)
          sound: false, // Only Notification Center or Windows Toasters
          wait: true // Wait with callback, until user action is taken against notification
        },
        (err, response, metadata) => {
          // Response is response from notification
          return {err, response, metadata};
        }
      );


      return this.generateRecord({value: result, metaObj:{title: this.#title, message: this.#message}}, curTime);
  }

}
