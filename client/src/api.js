import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://rehanfazal-portfolio-api-fzeeeygmg9cdembb.eastasia-01.azurewebsites.net'
});

export default API;