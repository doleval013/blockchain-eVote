import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { keccak256, toBytes } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { useElectionContext } from "../context/electionContext";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { ELECTION_STAGES } from "../lib/constants";
import { shortenAddress } from "../lib/address";
import toast from "react-hot-toast";
import { ElectoinWinner } from "../components/electionWinner";

export const Election = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getElectionInfo, electionInfo, candidates } = useElectionContext();

  const { id } = useParams();

  useEffect(() => {
    id && getElectionInfo(id);
  }, [id, getElectionInfo]);

  const onRegisterCandidate = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const name = form.get("name");
    const party = form.get("party");
    const candidateId = form.get("candidateId");

    const action = new Promise(async (resolve, reject) => {
      try {
        const candidateIdHash = keccak256(toBytes(candidateId));
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "registerCandidatesToElection",
          args: [name, party, candidateIdHash, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Registered Candidates successfully",
      error: (err) => err,
    });
  };

  const onStartElection = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const duration = form.get("duration");

    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "startElection",
          args: [duration, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election Started successfully",
      error: (err) => err,
    });
  };

  const onEndElection = () => {
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "endElection",
          args: [id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });
        getElectionInfo(id);

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Election Ended successfully",
      error: (err) => err,
    });
  };
  return (
    <section className="p-6 bg-gray-300 min-h-screen">
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-5 rounded-lg shadow-lg mb-6">
        <div className="flex gap-10 flex-wrap text-gray-100">
          <span>
            <h2 className="text-2xl font-semibold">Election Name</h2>
            <p className="text-lg font-light">{electionInfo.electionName}</p>
          </span>
          <span>
            <h2 className="text-2xl font-semibold">Election Stage</h2>
            <p className="text-lg font-light">
              {ELECTION_STAGES[electionInfo.stage]}
            </p>
          </span>
          <span>
            <h2 className="text-2xl font-semibold">Candidates</h2>
            <p className="text-lg font-light">{candidates.length}</p>
          </span>
          <span>
            <h2 className="text-2xl font-semibold">Ends At</h2>
            <p className="text-lg font-light">
              {electionInfo.stage === 1 &&
                new Date(
                  parseInt(electionInfo.duration) * 1000
                ).toLocaleString()}
              {electionInfo.stage !== 1 && "N/A"}
            </p>
          </span>
        </div>

        <div className="mt-10 space-y-4">
          {electionInfo.stage === 1 && (
            <button
              onClick={onEndElection}
              className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white p-3 rounded-md shadow-lg hover:bg-red-800 transition-transform transform hover:scale-105"
            >
              End Election
            </button>
          )}
          {electionInfo.stage === 0 && (
            <form onSubmit={onStartElection} className="flex space-x-3">
              <input
                required
                name="duration"
                type="number"
                className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
                placeholder="Duration in seconds"
              />
              <button
                disabled={candidates.length === 0}
                type="submit"
                className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-3 rounded-md shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-transform transform hover:scale-105"
              >
                Start Election
              </button>
            </form>
          )}
        </div>
      </div>

      <ElectoinWinner electionId={id} isEnded={electionInfo.stage === 2} />

      {electionInfo.stage === 0 && (
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-5 rounded-lg shadow-lg mt-10">
          <form
            onSubmit={onRegisterCandidate}
            className="grid grid-cols-12 gap-5"
          >
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="name" className="text-gray-300">Candidate Name</label>
              <input
                id="name"
                required
                name="name"
                type="text"
                className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
                placeholder="Candidate Name"
              />
            </span>
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="party" className="text-gray-300">Party Name</label>
              <input
                id="party"
                required
                name="party"
                type="text"
                className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
                placeholder="Party Name"
              />
            </span>
            <span className="flex flex-col col-span-12 md:col-span-6">
              <label htmlFor="candidateId" className="text-gray-300">Candidate Id</label>
              <input
                id="candidateId"
                required
                name="candidateId"
                type="text"
                className="border border-gray-600 bg-gray-800 text-white p-3 rounded-md outline-none focus:border-yellow-500 transition-all"
                placeholder="Candidate Id"
              />
            </span>
            <div className="col-span-12">
              <button
                disabled={electionInfo.stage !== 0}
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white p-3 rounded-md shadow-lg disabled:bg-yellow-400 hover:from-yellow-500 hover:to-yellow-700 transition-transform transform hover:scale-105"
              >
                Register Candidate
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="pb-10 mt-10">
        <div className="flex p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-2">
          <h2 className="basis-1/5 text-xl font-semibold text-gray-300">Candidate Id</h2>
          <h2 className="basis-1/5 text-xl font-semibold text-gray-300">Registration Id</h2>
          <h2 className="basis-1/5 text-xl font-semibold text-gray-300">Name</h2>
          <h2 className="basis-1/5 text-xl font-semibold text-gray-300">Party</h2>
          <h2 className="basis-1/5 text-xl font-semibold text-gray-300">Votes</h2>
        </div>

        <div>
          {candidates.map((candidate, idx) => (
            <div
              className="flex py-4 px-6 even:bg-gray-800 bg-gray-700 rounded-md shadow-lg mb-2"
              key={idx}
            >
              <p className="basis-1/5 text-white">
                {shortenAddress(candidate.candidateIdHash)}
              </p>
              <p className="basis-1/5 text-white">{parseInt(candidate.regId)}</p>
              <p className="basis-1/5 text-white">{candidate.name}</p>
              <p className="basis-1/5 text-white">{candidate.party}</p>
              <p className="basis-1/5 text-white">{parseInt(candidate.votes)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
