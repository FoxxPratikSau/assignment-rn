// api/fetchData.ts

import axios from 'axios';
import { ApiResponse } from '../models/userModel';

const API_URL = 'https://api.jsonbin.io/v3/b/6300e8a6a1610e6386073b96';

export const fetchUserData = async (): Promise<ApiResponse | null> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL, {
      headers: {
        'X-Master-Key': '$2b$10$ixUuVKAlvUV/lrUCstKtNO.4sahtvMbsWx8Lu.Svkdk.tv/QcK1sO', 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
