import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const BASE_URL = __ENV.BASE_URL || 'https://fakestoreapi.com';
const LOGIN_PATH = __ENV.LOGIN_PATH || '/auth/login';
const LOGIN_URL = `${BASE_URL}${LOGIN_PATH}`;

const credentials = new SharedArray('credentials', () => {
  const csv = papaparse.parse(open('../data/users.csv'), { header: true });
  return csv.data.filter((row) => row.user && row.passwd);
});

export const options = {
  scenarios: {
    login_load: {
      executor: 'ramping-vus',
      stages: [
        { duration: '30s', target: 5 },
        { duration: '1m', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '10s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
};

function pickCredential() {
  return credentials[Math.floor(Math.random() * credentials.length)];
}

export default function () {
  const credential = pickCredential();
  const payload = JSON.stringify({
    username: credential.user,
    password: credential.passwd,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = http.post(LOGIN_URL, payload, params);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
