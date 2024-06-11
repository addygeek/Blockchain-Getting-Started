# Blockchain Getting Started

This repository contains a basic implementation of a blockchain network with modules for mining and peer-to-peer communication.

## Overview

The project consists of several JavaScript files:

- **MINER.js**: Implements the core functionality of mining blocks and connecting to different full nodes in the blockchain network.
- **Aditya_node.js** and **Anurag_node.js**: Implement miners with 2 nodes named Aditya and Anurag respectively, demonstrating successful peer-to-peer broadcasting.
- **Blockchain.js**: Contains the main blockchain logic.
- **client.js** and **server.js**: Establish WebSocket connections for client-server communication.
- **keys.js**: Handles keys for connecting to different full nodes.
- **Blackchain-Backup.js**: Contains a backup of the blockchain data.
- **package.json** and **package-lock.json**: Define project dependencies and metadata.

## Features

- Modularity: The MINER.js file is designed to connect with different full nodes, allowing for flexibility in network configuration.
- Peer-to-Peer Broadcasting: Demonstrated by the Aditya_node.js and Anurag_node.js files, showcasing successful broadcasting between nodes.
- WebSocket Communication: Implemented by client.js and server.js to establish communication channels between clients and servers.
- Backup Functionality: The Blackchain-Backup.js file provides a mechanism for backing up blockchain data.

## Getting Started

1. Clone this repository to your local machine.
2. Ensure you have Node.js installed.
3. Install dependencies by running `npm install`.
4. Explore the different JavaScript files to understand their functionalities.
5. Execute the desired JavaScript file using Node.js to run the corresponding functionality.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
