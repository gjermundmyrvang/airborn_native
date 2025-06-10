import axios from 'axios';


const MET_URL = 'https://api.met.no/weatherapi'; 

const axiosInstance = axios.create({
  baseURL: MET_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


// Optional: Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling
    console.error('[Axios Error]', error?.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
