import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
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

// const fetchAIGuidance = async (exerciseName: string) => {
//   const res = await fetch(`${API_URL}/api/ai`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ exerciseName }),
//   });
// };
export const signout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
};
