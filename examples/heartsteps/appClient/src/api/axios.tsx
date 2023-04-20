import axios from 'axios';
const BASE_URL = 'http://localhost:3500';
const SERVER_BASE_URL = 'https://cmcdlabserver.miserver.it.umich.edu/api';
import Constants from 'expo-constants';
const { manifest } = Constants;

const TUNNELED_LOCAL_URL = 'https://old-rules-cover-35-128-21-85.loca.lt';

export default axios.create({
  baseURL: TUNNELED_LOCAL_URL
});

export const axiosPrivate = axios.create({
  baseURL: TUNNELED_LOCAL_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});
