import { useEffect, useState } from "react";
import { useAccount, useWalletClient } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { toHex } from "viem";

// Components
import { FaWallet } from "react-icons/fa";

import { shortenAddress } from "@/src/lib/address";
import { switchNetwork } from "@/src/lib/switchNetwork";
import { chains } from "@/src/configs/web3Modal";

export const ConnectButton = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected, chain } = useAccount();
  const { data: walletProvider } = useWalletClient();

  const [{ isCorrectChain }, setState] = useState({
    isCorrectChain: true,
  });

  useEffect(() => {
    if (isConnected) {
      setState({
        isCorrectChain: chain?.id === parseInt(chains[0].id),
      });
    }
  }, [chain, isConnected]);

  const onChainChanged = async () => {
    try {
      await switchNetwork(walletProvider, {
        ...chains[0],
        chainId: toHex(chains[0].id),
      });
    } catch (err) {
      console.error("Error switching network:", err);
    }
  };

  return (
    <>
      {isCorrectChain && (
        <button
          onClick={() => open()}
          className="w-full py-3 px-8 text-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          {shortenAddress(address) || (
            <span className="text-base font-semibold inline-flex justify-center items-center gap-3">
              Connect Wallet <FaWallet className="text-lg" />
            </span>
          )}
        </button>
      )}

      {!isCorrectChain && (
        <button
          type="button"
          onClick={onChainChanged}
          className="w-full py-3 px-8 text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-full shadow-lg transition-transform transform hover:scale-110"
        >
          <span className="capitalize text-base font-semibold">Wrong Network</span>
        </button>
      )}
    </>
  );
};
