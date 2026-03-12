// Real API service for Nova Mail backend integration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.vite_api_base_url || 'http://localhost:5000/api';

export interface MailtmMessage {
  id: string;
  from: {
    address: string;
    name: string;
  };
  to: {
    address: string;
    name: string;
  }[];
  subject: string;
  intro: string;
  text?: string;
  html?: string;
  seen: boolean;
  isDeleted: boolean;
  hasAttachments: boolean;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  downloadUrl?: string;
}

export interface EmailAccount {
  email: string;
  password: string;
  accountId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
}

class NovaMailAPI {
  private baseUrl = API_BASE_URL;

  private async request(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Get available domains
  async getDomains(): Promise<ApiResponse> {
    return this.request('/domains');
  }

  // Generate new temporary email account
  async generateEmail(): Promise<ApiResponse<EmailAccount>> {
    return this.request('/generate-email', {
      method: 'POST',
    });
  }

  // Get authentication token
  async getToken(email: string, password: string): Promise<ApiResponse<{ token: string; expiresAt: string }>> {
    return this.request('/token', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Get inbox messages
  async getMessages(email: string, password: string): Promise<ApiResponse<{ 'hydra:member': MailtmMessage[] }>> {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Get single message by ID
  async getMessage(email: string, password: string, messageId: string): Promise<ApiResponse<MailtmMessage>> {
    return this.request('/message', {
      method: 'POST',
      body: JSON.stringify({ email, password, messageId }),
    });
  }
}

export const api = new NovaMailAPI();
