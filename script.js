import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 10,
  duration: '1s',
};

export default function () {
  http.get('http://localhost:3000/questions/1');
  sleep(1);
}
