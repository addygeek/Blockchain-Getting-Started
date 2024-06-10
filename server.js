const WS = require('ws');
//websocket server connection
const server = new WS.Server({port: 3000});

server.on('connection',(ws)=>{
    console.log('Client connection is on');
    setInterval(()=>{
        ws.send('hello aditya');},1000);
    ws.on('close',()=>{
        console.log('Client disconnected');
    });
});