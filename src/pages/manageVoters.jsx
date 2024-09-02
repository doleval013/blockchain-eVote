import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { usePublicClient, useWriteContract } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { shortenAddress } from "../lib/address";
import { useVotersContext } from "../context/votersContext";

export const ManageVoters = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getVoters, voters } = useVotersContext();

  const onRegisterVoter = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const account = form.get("account");
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "registerVoter",
          args: [account],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getVoters();

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Registered voter successfully",
      error: (err) => err,
    });
  };

  useEffect(() => {
    getVoters();
  }, [getVoters]);

  return (
    <section className="p-6 bg-gray-300 min-h-screen">
      <div className="mb-10 flex justify-end">
        <form onSubmit={onRegisterVoter} className="flex items-center space-x-3">
          <input
            required
            name="account"
            className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
            placeholder="Wallet address"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-3 rounded-md shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-transform transform hover:scale-105"
          >
            Add Voter
          </button>
        </form>
      </div>

      <div className="flex p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-xl mb-4">
        <h2 className="basis-1/4 text-xl font-semibold text-yellow-300">ID</h2>
        <h2 className="basis-3/4 text-xl font-semibold text-yellow-300">Account</h2>
      </div>

      <div>
        {voters.map((voter, idx) => (
          <div
            className="flex py-4 px-6 even:bg-gray-800 bg-gray-700 rounded-md shadow-lg mb-2 hover:bg-gray-600 transition-all"
            key={idx}
          >
            <p className="basis-1/4 text-white">{idx + 1}</p>
            <p className="basis-3/4 text-white">{shortenAddress(voter.account)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
