// API Service for communicating with Django Backend
// Base URL is configurable via environment variable

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

class APIService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Get authentication token
  getToken(): string | null {
    return this.token || localStorage.getItem('access_token');
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  // Generic fetch method
  async fetch<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Try to refresh token
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.fetch<T>(endpoint, options);
        }
        this.clearToken();
        window.location.href = '/login';
      }

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.detail || data.error || 'An error occurred',
        };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // PUT request
  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.fetch<T>(endpoint, { method: 'DELETE' });
  }

  // Refresh token
  private async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.setToken(data.access);
        return true;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
    }

    return false;
  }
}

export const apiService = new APIService();

// Authentication API
export const authAPI = {
  signup: (payload: any) => apiService.post('/accounts/auth/signup/', payload),
  login: (payload: any) => apiService.post('/accounts/auth/login/', payload),
  logout: () => apiService.post('/accounts/auth/logout/', {}),
  getCurrentUser: () => apiService.get('/accounts/users/me/'),
  updateProfile: (payload: any) => apiService.put('/accounts/users/update_profile/', payload),
  changePassword: (payload: any) => apiService.post('/accounts/users/change_password/', payload),
  requestPasswordReset: (email: string) =>
    apiService.post('/accounts/users/request_password_reset/', { email }),
  resetPassword: (payload: any) =>
    apiService.post('/accounts/users/reset_password/', payload),
};

// Consultations API
export const consultationsAPI = {
  list: () => apiService.get('/consultations/'),
  create: (payload: any) => apiService.post('/consultations/', payload),
  getDetail: (id: string) => apiService.get(`/consultations/${id}/`),
  submitFeedback: (id: string, payload: any) =>
    apiService.post(`/consultations/${id}/submit_feedback/`, payload),
  processPayment: (id: string, payload: any) =>
    apiService.post(`/consultations/${id}/process_payment/`, payload),
  getMyConsultations: () => apiService.get('/consultations/my_consultations/'),
};

// Blog API
export const blogAPI = {
  getPosts: (page: number = 1) => apiService.get(`/blog/posts/?page=${page}`),
  getPost: (id: string) => apiService.get(`/blog/posts/${id}/`),
  getFeatured: () => apiService.get('/blog/posts/featured/'),
  getLatest: () => apiService.get('/blog/posts/latest/'),
  getCategories: () => apiService.get('/blog/categories/'),
  addComment: (postId: string, payload: any) =>
    apiService.post(`/blog/posts/${postId}/add_comment/`, payload),
  searchPosts: (query: string) =>
    apiService.get(`/blog/posts/?search=${query}`),
};

// Horoscopes API
export const horoscopesAPI = {
  getZodiacSigns: () => apiService.get('/horoscopes/zodiac-signs/'),
  getTodayHoroscopes: () => apiService.get('/horoscopes/horoscopes/today/'),
  getHoroscopeBySign: (sign: string, type: string = 'daily') =>
    apiService.get(`/horoscopes/horoscopes/by_sign/?sign=${sign}&type=${type}`),
  getWeeklyHoroscopes: () => apiService.get('/horoscopes/horoscopes/weekly/'),
  getMonthlyHoroscopes: () => apiService.get('/horoscopes/horoscopes/monthly/'),
  getCosmicEvents: () => apiService.get('/horoscopes/cosmic-events/'),
  getUpcomingCosmicEvents: () =>
    apiService.get('/horoscopes/cosmic-events/upcoming/'),
  getCosmicEventsThisMonth: () =>
    apiService.get('/horoscopes/cosmic-events/this_month/'),
};

// Testimonials API
export const testimonialsAPI = {
  list: () => apiService.get('/testimonials/'),
  create: (payload: any) => apiService.post('/testimonials/', payload),
  getFeatured: () => apiService.get('/testimonials/featured/'),
  getTopRated: () => apiService.get('/testimonials/top_rated/'),
  getStats: () => apiService.get('/testimonials/stats/'),
};

export default apiService;
