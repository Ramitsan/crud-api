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
  '/api/users/{userId}': {
    'POST': (request: http.IncomingMessage, resp: http.ServerResponse) => {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        const user = JSON.parse(body);
        users.push(user);
      });
    },
    'GET': (request: http.IncomingMessage, resp: http.ServerResponse, params: {userId?: string}) => {
      if(params.userId) {
        const user = users.find(it => it.username == params.userId);
        if(user) {
          resp.statusCode = 200;
          resp.end(JSON.stringify(user));
        } else {
          resp.statusCode = 404;
          resp.end(JSON.stringify('user not found'));
        }
       
      } else {
        resp.statusCode = 200;
        resp.end(JSON.stringify(users));
      }
      
    },
    'PUT': (request: http.IncomingMessage, resp: http.ServerResponse) => {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        const user = JSON.parse(body);
      });
    },
    'DELETE': () => {}
  }
}
const checkEndpoint = (url: string, endpoint: string) => {
  const _url = url.split('/');
  const _endpoint = endpoint.split('/');
  const params: Record<string, string> = {};
  const notFound = _endpoint.find((it, index) => {
    if(!it.startsWith('{') || !it.endsWith('}')) {
      if(_url[index] == it) {
        return false;
      } else {
        return true;
      }      
    } else {
      params[it.slice(1, it.length - 1)] = _url[index];
    }
  })
  if (notFound) {
    return null;
  } else {
    return params;
  }
}

const server = http.createServer((request, resp) => {
  console.log(request.url, request.method);
  let params;
  const endpointName = Object.keys(endpoints).find(it => {
    const _params = checkEndpoint(request.url, it);
    params = _params;
    return !!params;
  });
  const endpoint = endpoints[endpointName as keyof typeof endpoints];
  if(endpoint) {
    console.log(endpoint);
    const method = (endpoint as any)[request.method as any];
    if(typeof method == 'function') {
      method(request, resp, params);
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

server.listen(4000);
