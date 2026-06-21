import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          // Redirect to login will be handled by useAuth hook
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private clearToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    const { token, user } = response.data;
    this.setToken(token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return response.data;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.client.post('/auth/register', {
      name,
      email,
      password,
    });
    const { token, user } = response.data;
    this.setToken(token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return response.data;
  }

  async logout() {
    this.clearToken();
  }

  // Complaints endpoints
  async getComplaints(status?: string) {
    const params = status ? { status } : {};
    return this.client.get('/complaints', { params });
  }

  async getComplaint(id: string) {
    return this.client.get(`/complaints/${id}`);
  }

  async createComplaint(data: any) {
    return this.client.post('/complaints', data);
  }

  async updateComplaint(id: string, data: any) {
    return this.client.put(`/complaints/${id}`, data);
  }

  async deleteComplaint(id: string) {
    return this.client.delete(`/complaints/${id}`);
  }

  // Gallery endpoints
  async getGalleryImages(category?: string) {
    const params = category ? { category } : {};
    return this.client.get('/gallery', { params });
  }

  async getGalleryImage(id: string) {
    return this.client.get(`/gallery/${id}`);
  }

  async createGalleryImage(data: FormData) {
    return this.client.post('/gallery', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async updateGalleryImage(id: string, data: FormData) {
    return this.client.put(`/gallery/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteGalleryImage(id: string) {
    return this.client.delete(`/gallery/${id}`);
  }

  // Feedback endpoints
  async getFeedback(status?: string) {
    const params = status ? { status } : {};
    return this.client.get('/feedback', { params });
  }

  async createFeedback(data: any) {
    return this.client.post('/feedback', data);
  }

  async updateFeedbackStatus(id: string, status: string) {
    return this.client.put(`/feedback/${id}`, { status });
  }

  async deleteFeedback(id: string) {
    return this.client.delete(`/feedback/${id}`);
  }

  // Settings endpoints
  async getSettings() {
    return this.client.get('/settings');
  }

  async updateSettings(data: any) {
    return this.client.put('/settings', data);
  }

  // Statistics endpoints
  async getDashboardStats() {
    return this.client.get('/admin/stats');
  }
}

export const apiClient = new ApiClient();
