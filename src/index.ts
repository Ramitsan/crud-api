import { foo } from './script';
import http from 'http';

const a1: number = 1;
console.log(a1);
console.log(foo());

const users = [
  {
    username: 'Ivan'
  },
  {
    username: 'Alex'
  }
];

const server = http.createServer((request, resp) => {
  console.log(request.url, request.method);
  resp.statusCode = 200;
  resp.end(JSON.stringify(users));
})

server.listen(4000);