import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { useElectionContext } from "../context/electionContext";
import { ELECTION_STAGES } from "../lib/constants";
import { shortenAddress } from "../lib/address";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import toast from "react-hot-toast";
import { ElectoinWinner } from "../components/electionWinner";

export const VoterElection = () => {
  const { id } = useParams();
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const { getElectionInfo, electionInfo, candidates } = useElectionContext();
  const [voteStatus, setVoteStatus] = useState(true);

  const getVoteStatus = useCallback(
    async (address, electionId) => {
      try {
        const status = await publicClient.readContract({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "getVoterVoteStatus",
          args: [electionId, address],
        });
        setVoteStatus(status);
      } catch (err) {}
    },
    [publicClient]
  );

  useEffect(() => {
    id && getElectionInfo(id);
    id && address && getVoteStatus(address, id);
  }, [id, address, getElectionInfo, getVoteStatus]);

  const onVote = (candidateId) => {
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "vote",
          args: [candidateId, id],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getElectionInfo(id);
        getVoteStatus(address, id);
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

  return (
    <section className="bg-gray-300 min-h-screen p-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8 text-gray-100">
        <div className="flex gap-12 flex-wrap">
          <span>
            <h2 className="text-xl font-semibold">Election Name</h2>
            <p className="text-lg">{electionInfo.electionName}</p>
          </span>
          <span>
            <h2 className="text-xl font-semibold">Election Stage</h2>
            <p className="text-lg">{ELECTION_STAGES[electionInfo.stage]}</p>
          </span>

          <span>
            <h2 className="text-xl font-semibold">Candidates</h2>
            <p className="text-lg">{candidates.length}</p>
          </span>
          <span>
            <h2 className="text-xl font-semibold">Ends At</h2>
            <p className="text-lg">
              {electionInfo.stage === 1 &&
                new Date(parseInt(electionInfo.duration) * 1000).toLocaleString()}
              {electionInfo.stage !== 1 && "N/A"}
            </p>
          </span>
        </div>
      </div>

      <ElectoinWinner electionId={id} isEnded={electionInfo.stage === 2} />

      <div className="my-8">
        <div className="flex p-6 bg-gray-800 rounded-lg text-gray-100 shadow-md mb-2">
          <h2 className="basis-1/5 text-lg font-semibold">Candidate Id</h2>
          <h2 className="basis-1/5 text-lg font-semibold">Registration Id</h2>
          <h2 className="basis-1/5 text-lg font-semibold">Name</h2>
          <h2 className="basis-1/5 text-lg font-semibold">Party</h2>
          <h2 className="basis-1/5 text-lg font-semibold">Votes</h2>
          <div className="basis-1/5" />
        </div>

        <div>
          {candidates.map((candidate, idx) => (
            <div
              className="flex py-4 px-6 mb-2 rounded-md bg-gray-800 text-gray-100 shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105"
              key={idx}
            >
              <p className="basis-1/5 truncate">{shortenAddress(candidate.candidateIdHash)}</p>
              <p className="basis-1/5">{parseInt(candidate.regId)}</p>
              <p className="basis-1/5">{candidate.name}</p>
              <p className="basis-1/5">{candidate.party}</p>
              <p className="basis-1/5">{parseInt(candidate.votes)}</p>
              <div className="basis-1/5">
                <button
                  onClick={onVote.bind(this, candidate.regId)}
                  disabled={voteStatus}
                  className="text-white border border-indigo-600 bg-indigo-600 px-6 py-1.5 rounded-md disabled:bg-indigo-400"
                >
                  Vote
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
