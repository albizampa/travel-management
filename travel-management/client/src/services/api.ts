import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
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
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    return api.post('/auth/login', { username, password });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Travels API calls
export const travelsAPI = {
  getAll: async () => {
    return api.get('/travels');
  },
  getById: async (id: number) => {
    return api.get(`/travels/${id}`);
  },
  create: async (travelData: any) => {
    return api.post('/travels', travelData);
  },
  update: async (id: number, travelData: any) => {
    return api.put(`/travels/${id}`, travelData);
  },
  delete: async (id: number) => {
    return api.delete(`/travels/${id}`);
  },
};

// Participants API calls
export const participantsAPI = {
  getAll: async () => {
    return api.get('/participants');
  },
  getById: async (id: number) => {
    return api.get(`/participants/${id}`);
  },
  create: async (participantData: any) => {
    return api.post('/participants', participantData);
  },
  update: async (id: number, participantData: any) => {
    return api.put(`/participants/${id}`, participantData);
  },
  delete: async (id: number) => {
    return api.delete(`/participants/${id}`);
  },
};

// Finances API calls
export const financesAPI = {
  getAll: async () => {
    return api.get('/finances');
  },
  getById: async (id: number) => {
    return api.get(`/finances/${id}`);
  },
  create: async (financeData: any) => {
    return api.post('/finances', financeData);
  },
  update: async (id: number, financeData: any) => {
    return api.put(`/finances/${id}`, financeData);
  },
  delete: async (id: number) => {
    return api.delete(`/finances/${id}`);
  },
};

// Contacts API calls
export const contactsAPI = {
  getAll: async () => {
    return api.get('/contacts');
  },
  getById: async (id: number) => {
    return api.get(`/contacts/${id}`);
  },
  create: async (contactData: any) => {
    return api.post('/contacts', contactData);
  },
  update: async (id: number, contactData: any) => {
    return api.put(`/contacts/${id}`, contactData);
  },
  delete: async (id: number) => {
    return api.delete(`/contacts/${id}`);
  },
};

export default api; 