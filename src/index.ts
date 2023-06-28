import {foo} from './script';
import http from 'http';

const a1: number = 1;
console.log(a1);
console.log(foo());

const server = http.createServer((request, resp) => {

})

server.listen(4000);