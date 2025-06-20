import axios from 'axios';

export interface Agency {
  id: number;
  name: string;
  shortName: string;
  commissionScheme: {
    id: number;
    name: string;
  };
}

export interface Agent {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  agency: Agency;
}

// API base URL from Vite environment variables
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Helper function to ensure the URL is properly constructed
const getApiUrl = (endpoint: string): string => {
  // If no base URL is provided, use a relative URL
  if (!API_BASE_URL) {
    console.warn('VITE_API_URL is not set, using relative URL');
    return endpoint;
  }
  
  // Ensure the endpoint starts with a slash
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  // Return the full URL
  return `${API_BASE_URL.replace(/\/$/, '')}${normalizedEndpoint}`;
};

export const searchAgents = async (query: string): Promise<Agent[]> => {
  try {
    const endpoint = `/admin/json/agent?search=${encodeURIComponent(query)}`;
    const url = getApiUrl(endpoint);
    
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    console.log('Fetching agents from:', url);
    
    const response = await axios.get(url, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    
    return response.data || [];
  } catch (error) {
    console.error('Error searching agents:', error);
    console.error('Error details:', {
      message: error.message,
      config: error.config,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      } : 'No response'
    });
    return [];
  }
};
