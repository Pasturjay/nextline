import axios, { AxiosInstance } from 'axios';
import { COUNTRIES } from '../constants/countries';

interface AvoxiConfig {
  apiKey: string;
  baseUrl?: string;
}

interface SearchParams {
  country_code: string;
  type?: 'local' | 'tollfree' | 'mobile';
  area_code?: string;
  limit?: number;
  offset?: number;
}

interface ProvisionParams {
  phoneNumber: string; // The E.164 number to buy
  countryCode: string; // ISO country code
}

interface UpdateConfigParams {
  numberId: string; // or phoneNumber depending on API
  forwardTo?: string; // SIP or E.164
  recordingEnabled?: boolean;
}

interface SendSmsParams {
  from: string;
  to: string;
  text: string;
}

export class AVOXIClient {
  private client: AxiosInstance;

  constructor(config: AvoxiConfig = { apiKey: process.env.AVOXI_API_KEY || '' }) {
    this.client = axios.create({
      baseURL: config.baseUrl || process.env.AVOXI_API_URL || 'https://api.avoxi.com/v2',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private isMock(): boolean {
    return !process.env.AVOXI_API_KEY || process.env.AVOXI_API_KEY === 'mock';
  }

  /**
   * Search for available virtual numbers
   */
  async searchNumbers(params: SearchParams) {
    if (this.isMock()) {
      console.log("AVOXI Mock Search:", params);
      const country = COUNTRIES.find(c => c.value === params.country_code);
      const callingCode = country ? country.callingCode : '1';

      return {
        numbers: Array.from({ length: 5 }).map((_, i) => ({
          phoneNumber: `+${callingCode}${Math.floor(Math.random() * 900000000) + 100000000}`,
          country: country ? country.label : params.country_code,
          countryCode: params.country_code,
          region: "Capital Region",
          city: "Capital City",
          type: params.type || 'local',
          setupCost: 0,
          monthlyCost: 5.00
        }))
      };
    }
    try {
      const response = await this.client.get('/numbers/search', { params });
      return response.data;
    } catch (error) {
      console.error('AVOXI Search Error:', error);
      throw new Error('Failed to search numbers');
    }
  }

  /**
   * Provision a virtual number
   */
  async provisionNumber(params: ProvisionParams) {
    if (this.isMock()) {
      console.log("AVOXI Mock Provision:", params);
      return {
        id: `mock_num_${Date.now()}`,
        phoneNumber: params.phoneNumber,
        status: 'active'
      };
    }
    try {
      const response = await this.client.post('/numbers/buy', {
        number: params.phoneNumber,
        country: params.countryCode,
      });
      return response.data;
    } catch (error) {
      console.error('AVOXI Provision Error:', error);
      throw new Error('Failed to provision number');
    }
  }

  /**
   * Update configuration for a number (forwarding, recording, etc.)
   */
  async updateNumberConfig(params: UpdateConfigParams) {
    if (this.isMock()) {
      console.log("AVOXI Mock Update Config:", params);
      return { success: true };
    }
    try {
      const { numberId, ...data } = params;
      const response = await this.client.patch(`/numbers/${numberId}`, data);
      return response.data;
    } catch (error) {
      console.error('AVOXI Update Config Error:', error);
      throw new Error('Failed to update number configuration');
    }
  }

  /**
   * Send an SMS
   */
  async sendSMS(params: SendSmsParams) {
    if (this.isMock()) {
      console.log("AVOXI Mock Send SMS:", params);
      return { message_id: `mock_msg_${Date.now()}`, status: 'queued' };
    }
    try {
      const response = await this.client.post('/sms/messages', {
        from: params.from,
        to: params.to,
        text: params.text,
      });
      return response.data;
    } catch (error) {
      const err = error as any;
      console.error('AVOXI Send SMS Error:', err.response?.data || err.message);
      // Construct a minimal object to allow identifying errors upstream
      throw new Error('Failed to send SMS');
    }
  }
}

export const avoxiClient = new AVOXIClient();
