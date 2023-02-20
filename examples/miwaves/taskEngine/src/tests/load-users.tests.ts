import { User } from "../models/user.model";
import { clearUsers, addUser, getUserById } from '../db/users.service';
import { TimeZoneState } from "../dataModels/state/timezoneState.model";

const studyParams = {
    studyId: 'justin-example-1',
    cohorts: ['intervention'],
    triggers: ['usertimepref.trigger'],
    enrollmentDate: new Date(),
    phase: 'active'
}

const userPrefs = {};

userPrefs['address'] = {
    postalCode: '48104'
};

userPrefs['messageTimePrefs'] = {
    // let now = new Date(2022, 8, 19, 2, 55, 0); //EDT/EST
    namedTimes: [
        {
            name: 'morning',
            time: new Date(2022, 8, 19, 8, 0, 0)
        },
        {
            name: 'midday',
            time: new Date(2022, 8, 19, 12, 0, 0)
        },
        {
            name: 'afternoon',
            time: new Date(2022, 8, 19, 15, 0, 0)
        }, 
        {
            name: 'evening', 
            time: new Date(2022, 8, 19, 22, 0, 0)
        }
    ]
}

const userState = {};
/*
userState['weatherForecast'] = {
    value: 'OUTDOOR',
    updated: new Date()
};

userState['geoLocation'] = {
    value: {
        latitude: 42.279594,
        longitude: -83.732124
    },
    updated: new Date()
}

userState['semanticLocation'] = {
    value: 'Home', 
    updated: new Date()
}
*/

userState['timezone'] = new TimeZoneState(-240);

export const testUsers = [
    new User('123', 'participant1','Pei-Yao Hung', 'peiyaoh@umich.edu', "abcdefghi", {}, userPrefs, userState),
    new User('456', 'participant2','Mark Newman', 'mwnewman@umich.edu', "123456789", {}, userPrefs, {'timezone': TimeZoneState.fromZoneName("America/Los_Angeles")}),
    /*
    new User('456', 'participant2','Mark Newman', 'mwnewman@umich.edu', "123456789", studyParams, userPrefs, userState),
    new User('Mark Newman', 'mwnewman@umich.edu', '123', studyParams, userPrefs, userState),
    new User('Pedja Klasnja', 'klasnja@umich.edu', '234'),
    new User('Patrick Neggie', 'patmn@umich.edu', '345'),
    */
]

export async function loadTestUsers() {
    console.log('in loadTestUsers, clearing')
    await clearUsers();

    for (let tu of testUsers) {
        await addUser(tu);
    }
    return testUsers;
}

export async function findUser(userId: string) {
    let u = await getUserById(userId);
    return u;
}
