import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const DEFAULT_CONFIG = {
  baseUrl: 'https://fakestoreapi.com',
  loginPath: '/auth/login',
  credentialsPath: '../data/users.csv',
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1000'],
  },
  sleepSeconds: 1,
};

const CONFIG_PATH = __ENV.CONFIG_PATH || '../config/config.json';
const fileConfig = JSON.parse(open(CONFIG_PATH));
const config = {
  ...DEFAULT_CONFIG,
  ...fileConfig,
  thresholds: { ...DEFAULT_CONFIG.thresholds, ...(fileConfig.thresholds || {}) },
};

const BASE_URL = __ENV.BASE_URL || config.baseUrl;
const LOGIN_PATH = __ENV.LOGIN_PATH || config.loginPath;
const LOGIN_URL = `${BASE_URL}${LOGIN_PATH}`;

const credentials = new SharedArray('credentials', () => {
  const csv = papaparse.parse(open(config.credentialsPath), { header: true });
  return csv.data.filter((row) => row.user && row.passwd);
});

export const options = {
  scenarios: {
    login_load: {
      executor: 'ramping-vus',
      stages: config.stages,
      gracefulRampDown: '10s',
    },
  },
  thresholds: config.thresholds,
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

  sleep(config.sleepSeconds);
}
