import axios from '../api/axios';
import useAuth from './useAuth';

const useLogout = () => {
  // FIXME: get rid of ts-ignore
  // @ts-ignore
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios('/logout', {
        withCredentials: true
      });
      console.log('LOGOUT API RES: ', response);
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
