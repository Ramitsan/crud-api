import { foo } from './script';
import http from 'node:http';

console.log(http);
// const h = require('http');
// console.log(h);

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

const endpoints = {
  '/api/users': {
    'POST': () => {},
    'GET': () => {},
    'PUT': () => {},
    'DELETE': () => {}
  }
}

// const server = http.createServer((request, resp) => {
//   console.log(request.url, request.method);
//   // const endpoint = 
//   resp.statusCode = 200;
//   resp.end(JSON.stringify(users));
// })

// server.listen(4000);