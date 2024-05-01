import {serverHandler} from '../server';
import crypto from 'crypto';
import { Request, Response } from "./test-server";
import { addUser, deleteUser, getUsers, putUser} from "./api";

describe('scenario 1: basic API status', () => {
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
