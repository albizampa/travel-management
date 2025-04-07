import axios from 'axios';
import { supabase } from '../lib/supabase';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add Supabase auth token to all requests
api.interceptors.request.use(
  async (config) => {
    // Get the session from Supabase
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    
    // If we have a session, add the access token to the Authorization header
    if (session) {
      config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      // Sign out from Supabase
      await supabase.auth.signOut();
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls - now using Supabase
export const authAPI = {
  login: async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password });
  },
  signUp: async (email: string, password: string) => {
    return supabase.auth.signUp({ email, password });
  },
  logout: async () => {
    return supabase.auth.signOut();
  },
  resetPassword: async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email);
  },
  updatePassword: async (password: string) => {
    return supabase.auth.updateUser({ password });
  }
};

// Travels API calls
export const travelsAPI = {
  getAll: async () => {
    return supabase.from('travels').select('*');
  },
  getById: async (id: string) => {
    return supabase.from('travels').select('*').eq('id', id).single();
  },
  create: async (travelData: any) => {
    return supabase.from('travels').insert(travelData);
  },
  update: async (id: string, travelData: any) => {
    return supabase.from('travels').update(travelData).eq('id', id);
  },
  delete: async (id: string) => {
    return supabase.from('travels').delete().eq('id', id);
  },
};

// Participants API calls
export const participantsAPI = {
  getAll: async () => {
    return supabase.from('participants').select('*');
  },
  getById: async (id: string) => {
    return supabase.from('participants').select('*').eq('id', id).single();
  },
  getByTravelId: async (travelId: string) => {
    return supabase.from('participants').select('*').eq('travel_id', travelId);
  },
  create: async (participantData: any) => {
    return supabase.from('participants').insert(participantData);
  },
  update: async (id: string, participantData: any) => {
    return supabase.from('participants').update(participantData).eq('id', id);
  },
  delete: async (id: string) => {
    return supabase.from('participants').delete().eq('id', id);
  },
};

// Finances API calls
export const financesAPI = {
  getAll: async () => {
    return supabase.from('finances').select('*');
  },
  getById: async (id: string) => {
    return supabase.from('finances').select('*').eq('id', id).single();
  },
  getByTravelId: async (travelId: string) => {
    return supabase.from('finances').select('*').eq('travel_id', travelId);
  },
  create: async (financeData: any) => {
    return supabase.from('finances').insert(financeData);
  },
  update: async (id: string, financeData: any) => {
    return supabase.from('finances').update(financeData).eq('id', id);
  },
  delete: async (id: string) => {
    return supabase.from('finances').delete().eq('id', id);
  },
};

// Contacts API calls
export const contactsAPI = {
  getAll: async () => {
    return supabase.from('contacts').select('*');
  },
  getById: async (id: string) => {
    return supabase.from('contacts').select('*').eq('id', id).single();
  },
  create: async (contactData: any) => {
    return supabase.from('contacts').insert(contactData);
  },
  update: async (id: string, contactData: any) => {
    return supabase.from('contacts').update(contactData).eq('id', id);
  },
  delete: async (id: string) => {
    return supabase.from('contacts').delete().eq('id', id);
  },
};

export default api; 