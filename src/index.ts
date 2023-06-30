import { foo } from './script';
import http from 'node:http';

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
    'GET': (request: http.IncomingMessage, resp: http.ServerResponse) => {
      resp.statusCode = 200;
      resp.end(JSON.stringify(users));
    },
    'PUT': () => {},
    'DELETE': () => {}
  }
}

const server = http.createServer((request, resp) => {
  console.log(request.url, request.method);
  const endpointName = Object.keys(endpoints).find(it => request.url.startsWith(it));
  const endpoint = endpoints[endpointName as keyof typeof endpoints];
  if(endpoint) {
    console.log(endpoint);
    const method = (endpoint as any)[request.method as any];
    if(typeof method == 'function') {
      method(request, resp);
    } else {
      resp.statusCode = 200;
      resp.end(JSON.stringify('unknown method'));
    }
  } else {
    console.log('404');
    resp.statusCode = 404;
    resp.end(JSON.stringify('404'));
  }
  
})
