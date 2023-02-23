import axios from 'axios';
const BASE_URL = 'http://localhost:3500';
const SERVER_BASE_URL = 'https://cmcdlabserver.miserver.it.umich.edu/api';
import Constants from 'expo-constants';
const { manifest } = Constants;

const IPV4_API_URL = 'http://192.168.1.196:3500';
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
  baseURL: SERVER_BASE_URL
});

export const axiosPrivate = axios.create({
  baseURL: SERVER_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
