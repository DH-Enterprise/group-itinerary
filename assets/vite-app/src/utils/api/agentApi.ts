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
    const response = await axios.get(`http://gvv-api.test/admin/json/agent?search=${encodeURIComponent(query)}`);
    return response.data || [];
  } catch (error) {
    console.error('Error searching agents:', error);
    return [];
  }
};
