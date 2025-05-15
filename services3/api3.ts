import axios from 'axios';

const api3 = axios.create({
  baseURL: 'http://192.168.1.102:5002/api', // Change ça selon ton URL
  timeout: 60000,
});

export default api3;