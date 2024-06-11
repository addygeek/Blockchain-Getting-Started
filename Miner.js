const WS =require("ws");

const PORT = 3000;

const MY_ADDRESS = "ws://localhost:" + PORT;

const server = new WS.Server({port:PORT});

let opened= [], connected=[];

console.log("Miners listening on Port " +PORT);

server.on("connection", (socket) => {
    socket.on("message", (message) => {
        const _message = JSON.parse(message);
        console.log(_message);
        switch (_message.type){
            case "TYPE_HANDSHAKE":
                const nodes = _message.data;
                nodes.forEach(node => connected(node));
        }
    });
})

function connected(address)
{
if(!connected.find(peerAddress => peerAddress=== address && address !== MY_ADDRESS))
{
    const socket = new WS(address);

    socket.on("open", () => {
      //  opened.push({address, socket});
      //peer to peer push 
        socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE",{MY_ADDRESS, ...connected})));
        opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE",{address}))));
       
        if(!opened.find(peer => peer.address === address) && address !== MY_ADDRESS)
        {
            opened.push({socket,address});
            connected.push(address);
        }
    
    });

    socket.on("close", () => {
        opened.splice(connected.indexOf(address),1);
        connected.splice(connected.indexOf(address),1);
    })

function produceMessage(type,data){
    return {type,data};
}

setTimeout(() =>{
sendMessage(produceMessage("MESSAGE", "I am Aditya the MINER!"));
},6000);

function sendMessage(message)
{
    opened.forEach(node =>{
        node.socket.send(JSON.stringify(message));
    })
}

    //i 
    socket.on("close", (message) => {
        const _message = JSON.parse(message);
        console.log(_message);
        switch (_message.type){
            case "TYPE_HANDSHAKE":
                const nodes = _message.data;
                nodes.forEach(node => connected(node));
        }
    });
}
}
