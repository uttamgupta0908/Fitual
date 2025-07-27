import { API_URL } from '@env';

// API Configuration
export const API_CONFIG = {
  // Base URL for API requests
  BASE_URL: API_URL,

  // Network timeout settings
  TIMEOUT: 10, // 10 seconds

  // Endpoints
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/signup',
      SIGNIN: '/auth/signin',
      PROFILE: '/profile',
    },
    EXERCISES: {
      LIST: '/exercises',
      AI_GUIDANCE: '/api/ai',
    },
  },
} as const;

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Network status check
export const checkNetworkStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(API_CONFIG.BASE_URL, {
      method: 'HEAD',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.error('Network status check failed:', error);
    return false;
  }
};
