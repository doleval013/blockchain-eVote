import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config({});

const INFURA_API_KEY = "bgpJmzBM6si3sGKHPKRKk-CI71Raxjcc"
const SEPOLIA_PRIVATE_KEY ="8e65ae0712101fb5177271d566cefe148c4427acaffcff4e989fc3b2d6033947";
const config: HardhatUserConfig = {

  solidity: "0.8.20",
  
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/" || "",
    },
    sepolia: {
      chainId: 11155111,
      url: `https://eth-sepolia.g.alchemy.com/v2/${INFURA_API_KEY}`,
      accounts:
        [SEPOLIA_PRIVATE_KEY],
        gas: 2100000, // A more realistic gas limit
        gasPrice: 1000000000, // 1 Gwei
    },

  },
};

export default config;
