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

interface User {
  id: number;
  name: string;
  email: string;
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
        console.log({ storedToken });
        if (storedToken) {
          setToken(storedToken);
          const profile = await getProfile();
          console.log({ profile });
          setUser(profile);
        }
      } catch (e) {
        console.log('error in loadAuth', { e });
        // Only clear storage if it's a network error, not auth error
        if (e instanceof Error && e.message.includes('Network')) {
          setError(
            'Network error during startup. Please check your connection.',
          );
        }
        AsyncStorage.clear();
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
      setToken(data.token);
      setUser(data.user);
      await AsyncStorage.setItem('token', data.token);
    } catch (e) {
      console.error('Sign in error:', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred during sign in.');
      }
      throw e;
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
    } catch (e) {
      console.error('Sign up error:', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred during sign up.');
      }
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signoutUtil();
      setToken(null);
      setUser(null);
    } catch (e) {
      console.error('Sign out error:', e);
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unexpected error occurred during sign out.');
      }
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
