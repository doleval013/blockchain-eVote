import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { usePublicClient, useWriteContract } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { ELECTION_STAGES } from "../lib/constants";
import { keccak256, toBytes } from "viem";
import { shortenAddress } from "../lib/address";
import { useElectionsContext } from "../context/electionsContext";

export const ManageElections = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getElections, elections } = useElectionsContext();

  const onCreateElection = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const election = form.get("election");

    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "createElection",
          args: [election],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getElections();
        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election created successfully",
      error: (err) => err,
    });
  };

  useEffect(() => {
    getElections();
  }, [getElections]);
  return (
    <section className="p-6 bg-gray-300 min-h-screen">
      <div className="mb-10 flex justify-end">
        <form onSubmit={onCreateElection} className="flex items-center space-x-3">
          <input
            required
            name="election"
            className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
            placeholder="Election Name"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-3 rounded-md shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-transform transform hover:scale-105"
          >
            Create Election
          </button>
        </form>
      </div>

      <div className="flex p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-xl mb-4">
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Election Id</h2>
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Election Name</h2>
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Stage</h2>
      </div>

      <div>
        {elections.map((election, idx) => (
          <Link
            to={`/admin/election/${election.id}`}
            className="flex py-4 px-6 even:bg-gray-800 bg-gray-700 rounded-md shadow-lg mb-2 hover:bg-gray-600 transition-all"
            key={idx}
          >
            <p className="basis-1/3 text-white underline">
              {shortenAddress(keccak256(toBytes(parseInt(election.id))))}
            </p>
            <p className="basis-1/3 text-white">{election.electionName}</p>
            <p className="basis-1/3 text-white">{ELECTION_STAGES[election.stage]}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
