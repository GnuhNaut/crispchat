import axios from 'axios';
export default axios.create({
    baseURL: 'https://api.keylock.finance/api',
    timeout: 1000000,
    headers: {
        'Content-Type': 'application/json',
    },
});