// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development';

export const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  
  // Features
  FEATURES: {
    PAYMENT: true,
    EMAIL_VERIFICATION: true,
    SOCIAL_LOGIN: false,
  },

  // API Timeouts
  API_TIMEOUT: 30000,

  // Storage Keys
  STORAGE_KEYS: {
    USER: 'astro_user',
    TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    CONSULTATIONS: 'consultations',
  },
};

export default config;
