## CRUD API
Simple CRUD API server with in-memory database underneath can work with GET, POST, PUT and DELETE requests.

Task implemented on Typescript and Node.js v.18.16.0

Assignment: 

https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md

## Preparing to work with the application:

**Clone this repository**

```
$ git clone git@github.com:Ramitsan/crud-api.git
```

**Go to project folder**

```
$ cd crud-api
```

**Switch to development branch**

```
$ git checkout develop
```

**Install dependencies**

```
$ npm install
```

## Basic commands:

**Start development mode**

```
npm run start` or `npm run start:dev
```

**Start production mode**

```
npm run build` or `npm run start:prod
```

**Start tests**

```
npm run test
```

## API description

Implemented endpoint api/users

- **GET** `api/users` is used to get all persons
  - Server answer with `status code` **200** and all users records
- **GET** `api/users/{userId}` 
  - Server answer with `status code` **200** and record with `id === userId` if it exists
  - Server answer with `status code` **400** and message `User Id is invalid` 
  - Server answer with `status code` **404** and message `user not found`
- **POST** `api/users` is used to create record about new user and store it in database
  - Server answer with `status code` **201** and newly created record
  - Server answer with `status code` **400** and message if request `Body does not contain required fields` 
- **PUT** `api/users/{userId}` is used to update existing user
  - Server answer with` status code` **200** and updated record
  - Server answer with` status code` **400** and message if `User Id is invalid` 
  - Server answer with` status code` **404** and message `user not found`
- **DELETE** `api/users/{userId}` is used to delete existing user from database
  - Server answer with `status code` **204** if the record is found and deleted
  - Server answer with `status code` **400** and corresponding message if `User Id is invalid` 
  - Server answer with `status code` **404** message `user not found`


