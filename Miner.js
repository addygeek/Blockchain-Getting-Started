// Import the WebSocket module
const WebSocket = require("ws");
const readline = require("readline");
const {Block,  SathoshiCoin} = require("./Blockchain");
const key = require('./keys');


// Define the port number
const PORT = 3000;

// Array of peer addresses
const PEERS = ["ws://localhost:3001", "ws://localhost:3002"];

// Define the current node's address
const MY_ADDRESS = `ws://localhost:${PORT}`;

// Create a WebSocket server instance listening on the specified port
const server = new WebSocket.Server({ port: PORT });

// Arrays to keep track of opened connections and connected peers
const opened = [];
const connected = [];

// Log that the miners are listening on the specified port
console.log("Miners listening on Port " + PORT);

// Event listener for new connections
server.on("connection", (socket) => {
    // Event listener for incoming messages
    socket.on("message", (message) => {
        try {
            // Parse the incoming message as JSON
            const _message = JSON.parse(message);
            // Log the received message
            console.log(_message);
            // Handle different message types
            switch (_message.type) {
                case "TYPE_REPLACE_CHAIN":
                    const [newBlock, newDiff] = _message.data;
                    if (newBlock.prevHash !== SathoshiCoin.getLastBlock.prevHash &&
                        SathoshiCoin.getLastBlock().hash === newBlock.prevHash &&
                        Block.hasValidTransactions(newBlock,SathoshiCoin))
                        {
                           SathoshiCoin.chain.push(newBlock); 
                           SathoshiCoin.difficulty= newDiff;
                        }
                    break; //change for more miners

                case "TYPE_CREATE_TRANSACTION":
                    const transaction = _message.data;
                    SathoshiCoin.addTransaction(transaction);
                    break;
                    
                    // If it's a handshake message
                case "TYPE_HANDSHAKE":
                    // Extract connected nodes from the message and connect to them
                    const nodes = _message.data;
                    nodes.forEach(node => connect(node));
                    break;
                
                
                default:
                    console.log("Unknown message type:", _message.type);
            }
        } catch (error) {
            // Log and handle any errors that occur during message parsing
            console.error("Error parsing message:", error);
        }
    });
});

// Function to establish connections with peers
function connect(address) {
    // Check if the address is not already connected and is not the node's own address
    if (!connected.includes(address) && address !== MY_ADDRESS) {
        // Create a new WebSocket connection to the address
        const socket = new WebSocket(address);

        // Event listener for successful connection
        socket.on("open", () => {
            // Send a handshake message to the connected peer
            socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [...connected, MY_ADDRESS])));
            // Store the opened connection and update the list of connected peers
            opened.push({ socket, address });
            connected.push(address);
        });

        // Event listener for closing connection
        socket.on("close", () => {
            // Remove the closed connection from the list of opened connections
            const index = opened.findIndex(peer => peer.address === address);
            if (index !== -1) {
                opened.splice(index, 1);
            }
            // Remove the disconnected peer from the list of connected peers
            connected.splice(connected.indexOf(address), 1);
        });

        // Event listener for connection errors
        socket.on("error", (error) => {
            console.error("Connection error:", error);
            // You might want to handle error cases appropriately
        });
    }
}

// Function to create message objects
function produceMessage(type, data) {
    return { type, data };
}

// Function to send a message to all connected peers
function sendMessage(message) {
    opened.forEach(node => {
        node.socket.send(JSON.stringify(message));
    });
}

// Establish connections to initial peers
PEERS.forEach(peer => connect(peer));

// Send a test message to all connected peers after a delay
// setTimeout(() => {
//     sendMessage(produceMessage("MESSAGE", "Hello, this is MINER!"));
// }, 5000);

const rl = readline.createInterface(
    {
        input: process.stdin,
        output: process.stdout,
        prompt: "Enter command\n"
    }
);

rl.on('line', (command)=>
{
    switch(command.toLowerCase()) {
        case "mine":
            if(SathoshiCoin.transaction.length !==0){
                SathoshiCoin.mineTransaction(key.MINER_KEY.getPublic("hex"));
                sendMessage(produceMessage("TYPE_CREATE_TRANSACTION", [SathoshiCoin.getLastBlock(), SathoshiCoin.difficulty]));
            }
            break;
        case "balance":
            console.log("Miner Balance",SathoshiCoin.getBalance(key.MINER_KEY.getPublic("hex")));
            break;
        case "blockchain":
            console.log(SathoshiCoin);
            break;
        case "clear":
            console.clear();
            break;
}
rl.prompt();
}).on("close",()=>{
    console.log("Exiting");
    process.exit(0);
});




process.on("uncaughtException", (error) => console.log(error));