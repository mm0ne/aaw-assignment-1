import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 100,
    duration: '60s',
};

export default function () {
    const url = 'http://localhost:10000/api/v1/auth/login';
    const payload = JSON.stringify({
        username: 'asterrr',
        password: 'aA1aA1aA1',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
