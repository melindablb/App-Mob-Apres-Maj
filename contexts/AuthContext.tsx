import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
  uid: string;
  token: string;
  name: string;
  lastname: string;
  email: string;
  height: string;
  weight: string;
  phonenumber: string;
  postalcode: string;
  address: string;
  birthdate:string;
  pdp: string;
  car: boolean;
  watch: boolean;
  cgm:boolean;
  state:number; //0vert 1orange 2rouge
};

type AuthContextType = {
  user: User | null;
  signInD: (data: User) => Promise<void>;
  signOutD: () => Promise<void>;
  UpdateData: (data: User) => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const signInD = async (data: User) => {
    await AsyncStorage.setItem('@user', JSON.stringify(data));
    setUser(data);
  };

  const signOutD = async () => {
    await AsyncStorage.removeItem('@user');
    setUser(null);
  };

  const UpdateData = async (data : User) =>{
    await AsyncStorage.removeItem('@user');
    setUser(null);
    await AsyncStorage.setItem('@user', JSON.stringify(data));
    setUser(data);
  }

  return (
    <AuthContext.Provider value={{ user, signInD, signOutD, isLoading, UpdateData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
