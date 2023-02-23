import axios from 'axios';
const BASE_URL = 'http://localhost:3500';
const SERVER_BASE_URL = 'https://cmcdlabserver.miserver.it.umich.edu/api';
import Constants from 'expo-constants';
const { manifest } = Constants;

const IPV4_API_URL = 'http://192.168.1.196:3500';
const TUNNELED_LOCAL_URL = 'https://sweet-mails-admire-35-128-21-85.loca.lt';
let API_URL: string | undefined = 'api.example.com';
if (
  manifest &&
  typeof manifest.packagerOpts === `object` &&
  manifest.packagerOpts.dev
) {
  API_URL = manifest.debuggerHost?.split(`:`).shift()?.concat(`:3500`);
}
console.log(API_URL);

export default axios.create({
  baseURL: IPV4_API_URL
});

export const axiosPrivate = axios.create({
  baseURL: IPV4_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
