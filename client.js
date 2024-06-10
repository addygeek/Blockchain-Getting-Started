const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open',()=> {
    console.log('Connected to server');});

ws.on('message',(data)=> {
    console.log(`${data}`);});