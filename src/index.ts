import { foo } from './script';
import http from 'node:http';
import crypto from 'crypto';

interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: Array<string>;
}

class User {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;

  constructor(data: IUser) {
    if (!data.username || typeof data.username !== 'string') {
      throw new Error();
    }
    this.username = data.username;
    if (!data.age || typeof data.age !== 'number') {
      throw new Error();
    }
    this.age = data.age;
    if (!Array.isArray(data.hobbies) || data.hobbies.find(it => typeof it !== 'string')) {
      throw new Error();
    }
    this.hobbies = data.hobbies;
    this.id = crypto.randomUUID();
  }

  update(data: IUser) {
    if (!data.username || typeof data.username !== 'string') {
      throw new Error();
    }
    this.username = data.username;
    if (!data.age || typeof data.age !== 'number') {
      throw new Error();
    }
    this.age = data.age;
    if (!Array.isArray(data.hobbies) || data.hobbies.find(it => typeof it !== 'string')) {
      throw new Error();
    }
    this.hobbies = data.hobbies;
  }
}

const users: Array<User> = [
  new User({
    username: 'Ivan',
    age: 25,
    hobbies: ['sport']
  }),
  new User({
    username: 'Alex',
    age: 28,
    hobbies: []
  })
];

const endpoints = {
  '/api/users/{userId}': {
    'POST': (request: http.IncomingMessage, resp: http.ServerResponse) => {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString();
      });
      request.on('end', () => {
        try {
          const userData: IUser = JSON.parse(body);
          const user = new User(userData);
          users.push(user);
          resp.statusCode = 201;
          resp.end(JSON.stringify(user));
        }
        catch (err) {
          resp.statusCode = 400;
          resp.end(JSON.stringify(err));
        }
      });
    },

    'GET': (request: http.IncomingMessage, resp: http.ServerResponse, params: { userId?: string }) => {
      if (params.userId) {
        const user = users.find(it => it.username == params.userId);
        if (user) {
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

    'PUT': (request: http.IncomingMessage, resp: http.ServerResponse, params: { userId: string }) => {
      if (params.userId) {
        const user = users.find(it => it.username == params.userId);
        if (user) {
          let body = '';
          request.on('data', (chunk) => {
            body += chunk.toString();
          });
          request.on('end', () => {
            try {
              const userData: IUser = JSON.parse(body);
              user.update(userData);
              resp.statusCode = 201;
              resp.end(JSON.stringify(user));
            }
            catch (err) {
              resp.statusCode = 400;
              resp.end(JSON.stringify(err));
            }
          });
        } else {
          resp.statusCode = 404;
          resp.end(JSON.stringify('user not found'));
        }
      } else {
        resp.statusCode = 400;
        resp.end(JSON.stringify(users));
      }
    },

    'DELETE': () => { }
  }
}
const checkEndpoint = (url: string, endpoint: string) => {
  const _url = url.split('/');
  const _endpoint = endpoint.split('/');
  const params: Record<string, string> = {};
  const notFound = _endpoint.find((it, index) => {
    if (!it.startsWith('{') || !it.endsWith('}')) {
      if (_url[index] == it) {
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
  if (endpoint) {
    console.log(endpoint);
    const method = (endpoint as any)[request.method as any];
    if (typeof method == 'function') {
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
