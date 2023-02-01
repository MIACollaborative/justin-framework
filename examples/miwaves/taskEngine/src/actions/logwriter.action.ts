
import { promises as fsp } from 'fs';

const LOG_FILENAME = './output/justin.log'

export async function writeLogMessage(message: string) {
    try {
        await fsp.writeFile(LOG_FILENAME, message + '\n', { flag: 'a+' });
    } catch (err) {
        console.log(err);
    }
}
