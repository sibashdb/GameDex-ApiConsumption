import axios from 'axios';

const gamedexApi = axios.create({
    baseURL: 'https://gamedex-api.onrender.com',
    timeout: 15000,
});

export default gamedexApi;
