import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import axios from 'axios';

// Configurar URL base para Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const app = createApp(App);
app.mount('#app');
