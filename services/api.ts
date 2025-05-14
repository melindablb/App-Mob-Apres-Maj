import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.102:5001/api', // Change ça selon ton URL
  timeout: 60000,
});

export default api;
