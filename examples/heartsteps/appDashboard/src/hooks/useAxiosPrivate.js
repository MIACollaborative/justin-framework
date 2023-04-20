import { axiosPrivate } from '../api/axios';
import { useEffect } from 'react';
import useRefreshToken from './useRefreshToken';
import useAuth from './useAuth';

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        /* 
        if auth header doesn't exist, we know it's not a retry,
        therefore, this is the first attempt (no HTTP 403 yet) 
        */
        if (!config.headers['Authorization']) {
          // grab accessToken out of auth state
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      // if no HTTP 403, send response normally
      (response) => response,

      // if accessToken is expired
      async (err) => {
        const prevRequest = err?.config;
        /* 
        response will be 403 if accessToken is expired,
        !prevRequest?.sent indicates that we retry once 
        */
        // TODO: change res status to 401 on frontend and backend
        // If we validate vs 403, we can refresh the token unnecessarily if user doesn't have role for a specific request.
        // TODO: SECURITY - delete comment above for production
        if (err?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(err);
      }
    );

    // cleanup to remove interceptor
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
