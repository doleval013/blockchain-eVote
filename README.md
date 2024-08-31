# web

choose by testnet you prefer

[localHost](https://blockchain-e-vote.vercel.app/)

for local host you have to geenerate blocks and deploy contract

[sepolia](https://blockchain-e-vote-sepolia.vercel.app/)

for sepolia you gave to have premissions 

# Getting Started

can use scripts in scripts folder or do it manually

# Setup Contracts

## install node_modules in contracts folder

```bash

cd contracts
npm install

```

## start hardhat node

```bash

npm run node
```

## deploy contract

remove `deployments` folder from `contracts/ignition` and run following command. before running this command make sure to start hardhat node

```bash

npm run deploy:dev
```

## Setup frontend

## install node_modules in root folder

```bash

npm install

```

### Config contract address in ui

copy the contract address provided in deployment step and replace it with the existing address in `/src/configs/contractConfigs.js`

```javascript
import Evoting_ABI from "@/src/assets/abis/Evoting.json";

// change this address to newly created contract's
const Evoting_Address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export { Evoting_ABI, Evoting_Address };
```

# start fontend server

```bash
npm start

```

# common issues
## issue
 The contract function "createElection" reverted with the following reason:
 Internal JSON-RPC error.
 
solution:

with metamask 

click on 3 dots on the right

click on settings

click on advance

click on clear activity tab data

# e-voting

# debug
 validate contracts via https://remix.ethereum.org/
