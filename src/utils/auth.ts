import AsyncStorage from '@react-native-async-storage/async-storage';

// const API_URL = 'http://YOUR_BACKEND_IP:5000';
// const API_URL = 'http://localhost:5000';
const API_URL = 'http://192.168.1.12:5000';

console.log({ API_URL: process.env.API_URL });

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const signup = async (
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Signup failed');
  }

  return res.json();
};

export const signin = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Signin failed');
  }

  return res.json();
};

export const getProfile = async (): Promise<User> => {
  const token = await AsyncStorage.getItem('token');

  const res = await fetch(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch profile');
  }

  const data = await res.json();
  return data.user;
};

export const signout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};
