import axios from 'axios';
export default axios.create({
    baseURL: 'http://crispchat.test/api',
    timeout: 1000000,
    headers: {
        'Content-Type': 'application/json',
    },
});