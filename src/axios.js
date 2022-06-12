import axios from 'axios';
export default axios.create({
    baseURL: 'https://api.keylock.finance/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});