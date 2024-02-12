import {serverHandler} from '../server';
import { Request, Response } from "./test-server";

export const addUser = (username?: string, age?: number, hobbies?: Array<string> ) => {
  return new Promise<Response>((res) => {
    const response = new Response();
    response.onEnd = () => {
      res(response);
    }

    const request = new Request({
      url: '/api/users',
      method: 'POST',
      body: {
        username: username || 'Ivan',
        age: age || 25,
        hobbies: hobbies || ['sport']
      }
    })
    serverHandler(request as any, response as any);  
  })
}

export const deleteUser = (id: string) => {
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

export const getUsers = (id?: string) => {
  return new Promise<Response>((res) => {
    const response = new Response();
    response.onEnd = () => {
      res(response);
    }        
    const request = new Request({
      url: `/api/users${id?'/' + id: ''}`,
      method: 'GET',
      
    })
    serverHandler(request as any, response as any);  
  })
}

export const putUser = (id: string, username?: string, age?: number, hobbies?: Array<string>) => {
  return new Promise<Response>((res) => {
    const response = new Response();
    response.onEnd = () => {
      res(response);
    }        
    const request = new Request({
      url: `/api/users/${id}`,
      method: 'PUT', 
      body: {
       username: username || 'Ivan',
       age: age || 25,
       hobbies: hobbies || ['sport']
     }         
    })
    serverHandler(request as any, response as any);  
  })
} 

