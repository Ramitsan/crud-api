import {serverHandler} from '../server';
import { Readable} from 'stream';
import crypto from 'crypto';

interface IRequestOptions {
  url: string;
  body?: any;
  method?: string;
}

class Request extends Readable {
  url: string;
  method: string;
  constructor(options: IRequestOptions) {
    super();
    this.url = options.url;
    this.method = options.method || 'GET';
    if(options.body) {
      this.push(JSON.stringify(options.body));
    }   
    this.push(null);
  }
}

class Response {
  statusCode: number;
  _data: string;
  onEnd?: () => void;

  end(data: string) {
    this._data = data;
    this.onEnd?.();
  }
}

describe('test server', () => {
  test('should return status 404 if endpoint is not /api/users', (done) => {
    const response = new Response();
    response.onEnd = () => {
      expect(response.statusCode).toBe(404);
      done();
    }
    const request = new Request({
      url: '/api/1',
    })
    serverHandler(request as any, response as any);    
  });

  test('should return status 201 if user added succesfully', (done) => {
    const response = new Response();
    response.onEnd = () => {
      expect(response.statusCode).toBe(201);
      done();
    }
    const request = new Request({
      url: '/api/users',
      method: 'POST',
      body: {
        username: 'Ivan',
        age: 25,
        hobbies: ['sport']
      }
    })
    serverHandler(request as any, response as any);   
  });

  test('should add and delete users', async () => {
    const addUser = () => {
      return new Promise<Response>((res) => {
        const response = new Response();
        response.onEnd = () => {
          res(response);
        }

        const request = new Request({
          url: '/api/users',
          method: 'POST',
          body: {
            username: 'Ivan',
            age: 25,
            hobbies: ['sport']
          }
        })
        serverHandler(request as any, response as any);  
      })
    }

    const deleteUser = (id: string) => {
      return new Promise<Response>((res) => {
        const response = new Response();
        response.onEnd = () => {
          res(response);
        }        
        const request = new Request({
          url: `/api/users/${id}`,
          method: 'DELETE',
          
        })
        serverHandler(request as any, response as any);  
      })
    }

    const getUsers = () => {
      return new Promise<Response>((res) => {
        const response = new Response();
        response.onEnd = () => {
          res(response);
        }        
        const request = new Request({
          url: '/api/users',
          method: 'GET',
          
        })
        serverHandler(request as any, response as any);  
      })
    }
    const initialUsersResponse = await getUsers();
    const initialUsers = JSON.parse(initialUsersResponse._data);
    const addedUserResponse = await addUser();
    const addedUser = JSON.parse(addedUserResponse._data);

    const afterAddUsersResponse = await getUsers();
    const afterAddUsers = JSON.parse(afterAddUsersResponse._data);
    expect(initialUsers.length + 1).toBe(afterAddUsers.length);

    const deletedUserResponse = await deleteUser(addedUser.id);
    const deletedUser = JSON.parse(deletedUserResponse._data);
    expect(deletedUser.username).toBe(addedUser.username);

    const usersResponse = await getUsers();
    const users = JSON.parse(usersResponse._data);
    expect(initialUsers.length).toBe(users.length);
    expect(deletedUserResponse.statusCode).toBe(204);
    expect(initialUsersResponse.statusCode).toBe(200);    
  });

  test('should get user correct response', async () => {    
   const getUsers = (id: string) => {
      return new Promise<Response>((res) => {
        const response = new Response();
        response.onEnd = () => {
          res(response);
        }        
        const request = new Request({
          url: `/api/users/${id}`,
          method: 'GET',          
        })
        serverHandler(request as any, response as any);  
      })
    }  

    const usersResponse = await getUsers('5456');
    expect(usersResponse.statusCode).toBe(400);    
    
    const usersResponse1 = await getUsers(crypto.randomUUID());
    expect(usersResponse1.statusCode).toBe(404);    
  });


  test('should put user correct response', async () => { 
    const addUser = () => {
      return new Promise<Response>((res) => {
        const response = new Response();
        response.onEnd = () => {
          res(response);
        }

        const request = new Request({
          url: '/api/users',
          method: 'POST',
          body: {
            username: 'Ivan',
            age: 25,
            hobbies: ['sport']
          }
        })
        serverHandler(request as any, response as any);  
      })
    }

    const putUser = (id: string) => {
       return new Promise<Response>((res) => {
         const response = new Response();
         response.onEnd = () => {
           res(response);
         }        
         const request = new Request({
           url: `/api/users/${id}`,
           method: 'PUT', 
           body: {
            username: 'Ivan',
            age: 25,
            hobbies: ['sport']
          }         
         })
         serverHandler(request as any, response as any);  
       })
     } 
     
     const addedUserResponse = await addUser();
     const addedUser = JSON.parse(addedUserResponse._data);
 
     const usersResponse = await putUser(addedUser.id);
     expect(usersResponse.statusCode).toBe(200);    
     
     const usersResponse1 = await putUser(crypto.randomUUID());
     expect(usersResponse1.statusCode).toBe(404);   
     
     const usersResponse2 = await putUser('5646');
     expect(usersResponse2.statusCode).toBe(400); 
   });
})
