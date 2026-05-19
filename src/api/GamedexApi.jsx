import axios from 'axios';

const gamedexApi = axios.create({
    baseURL: 'https://gamedex-api.onrender.com',
});

export default gamedexApi;