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

export const searchAgents = async (query: string): Promise<Agent[]> => {
  try {
    const response = await axios.get<Agent[]>('/api/agents/search', {
      params: { search: query },
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
