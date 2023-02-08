import React, { createContext, useState } from 'react';

export type IAuth = {
  user?: string;
  accessToken?: string;
};

export type AuthContextType = {
  auth: IAuth;
  setAuth: React.Dispatch<React.SetStateAction<IAuth>>;
};

const AuthContext = createContext<IAuth | null>(null);

export const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [auth, setAuth] = useState<IAuth>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
