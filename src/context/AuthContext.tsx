import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  signin,
  signup,
  getProfile,
  signout as signoutUtil,
} from '../utils/auth';
import { navigationRef } from '../../App';
import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAuth = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          const profile = await getProfile();
          setUser(profile);
        }
      } catch (e: any) {
        console.error('Error loading auth:', e);
        setError(
          e.message?.includes('Network')
            ? 'Network error during startup. Please check your connection.'
            : 'Failed to load authentication data.',
        );
        await AsyncStorage.clear();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signin(email, password);
      if (data) {
        setToken(data.token);
        setUser(data.user);
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('token', data.token);
        navigationRef.current?.navigate('TABS'); // or your main screen
      }
    } catch (e: any) {
      Alert.alert('Login Failed', e.message, [
        { text: 'Ok' },
        { text: 'Retry', onPress: () => signIn(email, password) },
      ]);
      console.log('Sign in error:', e);
      setError(e.message || 'An unexpected error occurred during sign in.');
      // throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await signup(name, email, password);
      setToken(data.token);
      setUser(data.user);
      await AsyncStorage.setItem('token', data.token);
    } catch (e: any) {
      console.error('Sign up error:', e);
      setError(e.message || 'An unexpected error occurred during sign up.');
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUser(null);
      setToken(null);
      AsyncStorage.clear();
      navigationRef.current?.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'SIGN_IN' }],
        }),
      );
    } catch (e: any) {
      console.error('Sign out error:', e);
      setError(e.message || 'An unexpected error occurred during sign out.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isLoggedIn: !!token,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
