import axios from 'axios';

export const getCredits = async () => {
  const response = await axios.get('/api/credits');
  return response.data;
};

export const createCredit = async (data: any) => {
  const response = await axios.post('/api/credits', data);
  return response.data;
};

export const postCredit = async (data: any) => {
  const response = await axios.post('/api/credits', data);
  return response.data;
};

