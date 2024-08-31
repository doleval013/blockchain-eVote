import { createWeb3Modal } from "@web3modal/wagmi/react";
import { localhost } from "viem/chains";
import { sepolia } from "viem/chains";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

//  Get projectId
const projectId = "3828bedc82f5ba0e923c413da3250b1a";

const env = process.env.environment;
console.log(env);
console.log(process.env);
console.log("condition: env === 'development' =", env === 'development');
//export const chains = [{ ...localhost, id: 31337 }];
export const chains = []; // Sepolia's Chain ID is 11155111
if (env === "development") {
  chains.push({ ...localhost, id: 31337 });
}else{
  chains.push({ ...sepolia, id: 11155111 });
}
const url = env === 'development' ? "" : "https://eth-sepolia.g.alchemy.com/v2/bgpJmzBM6si3sGKHPKRKk-CI71Raxjcc";
export const wagmiConfig = createConfig({
  chains: chains,
  transports: {
    [chains[0].id]:http (url),
  },
  connectors: [injected({ shimDisconnect: true })],
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: "light",
  themeVariables: {
    "--w3m-border-radius-master": "0.085rem",
  },
});
