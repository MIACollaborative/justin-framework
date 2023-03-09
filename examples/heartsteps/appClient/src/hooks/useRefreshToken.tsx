import axios from '../api/axios';
import useAuth from './useAuth';
import jwtDecode from 'jwt-decode';

const useRefreshToken = () => {
  // FIXME: get rid of ts-ignore
  // @ts-ignore
  const { setAuth } = useAuth();
  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true
    });
    // TODO: set prev to IAuth type once defined
    setAuth((prev: any) => {
      console.log(JSON.stringify(prev));
      console.log(response.data.accessToken);

      // TODO: create decoded TS type, replace 'any'
      const decoded: any = response.data?.accessToken
        ? jwtDecode(response.data.accessToken)
        : undefined;
      const roles = decoded?.UserInfo?.roles || [];
      return {
        ...prev,
        roles: roles,
        accessToken: response.data.accessToken
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefreshToken;
