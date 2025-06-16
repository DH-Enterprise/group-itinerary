import axios from 'axios';

export interface Agent {
  id: string;
  name: string;
  email: string;
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
