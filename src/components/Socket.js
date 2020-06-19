import socketIOClient from 'socket.io-client';
//const ENDPOINT = 'http://127.0.0.1:4001';
const ENDPOINT = 'https://shrouded-badlands-94962.herokuapp.com/';

export const socket = socketIOClient(ENDPOINT);
