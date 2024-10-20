import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type AuthState = {
  isLoggedIn: boolean;
  seisLoggedIn: Dispatch<SetStateAction<boolean>>;
};

const initialState: AuthState = {
  isLoggedIn: false,
  seisLoggedIn: () => {},
};

const AuthContext = createContext<AuthState>(initialState);

const AuthContextProvider = ({children}: {children: ReactNode}) => {
  const [isLoggedIn, seisLoggedIn] = useState(false);

  return (
    <AuthContext.Provider value={{isLoggedIn, seisLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('Auth context not avaialble.');

  return context;
};

export {AuthContextProvider, useAuth};
