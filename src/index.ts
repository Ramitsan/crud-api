import http from 'node:http';
import dotenv from 'dotenv';
import path from 'path';
import {serverHandler} from './server';

dotenv.config({path: path.resolve(__dirname, '.env')});

const server = http.createServer(serverHandler);
server.listen(process.env.PORT);
console.log('server started on port:', process.env.PORT );