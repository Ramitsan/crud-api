import http from 'node:http';
import dotenv from 'dotenv';
import path from 'path';
import {serverHandler} from './server';
import fs from "fs";

const localEnv = path.resolve(__dirname, '.env');
const projectEnv = path.resolve(__dirname, '../src/.env')

const FgRed = "\x1b[31m";
const Reset = "\x1b[0m";

const runServer = (env?: string) => {
  if(env) {
    dotenv.config({path: env});
  } else {
    console.log(FgRed, "Not found .env file. Please, create .env file in dist directory!", Reset);
  }

  const server = http.createServer(serverHandler);
  const port = process.env.PORT || 4000;
  server.listen(port);
  console.log('server started on port:', port );
}

fs.access(localEnv, fs.constants.F_OK, (err) => {
  if (!err) {
    runServer(localEnv);
  } else {
    fs.access(projectEnv, fs.constants.F_OK, (err) => {
      if (!err) {
        runServer(projectEnv);
      } else {        
        runServer();
      }
    });    
  }
});

