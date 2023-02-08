import { createContext, useState } from 'react';

// export type IAuth = {
//   user?: string;
//   accessToken?: string;
// };

// export type AuthContextType = {
//   auth?: IAuth;
//   setAuth?: React.Dispatch<React.SetStateAction<IAuth>>;
// };

// const AuthContext = createContext<AuthContextType>({});
const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: any) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
