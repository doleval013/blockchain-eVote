import { useCallback, useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { FaTrophy } from "react-icons/fa"; // Adding a trophy icon for uniqueness

export const ElectoinWinner = ({ electionId, isEnded }) => {
  const publicClient = usePublicClient();
  const [winner, setWinner] = useState({});

  const getWinnerInfo = useCallback(
    async (electionId) => {
      try {
        const results = await publicClient.readContract({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "electionWinner",
          args: [electionId],
        });

        setWinner({
          name: results[0],
          party: results[1],
          candidateIdHash: results[2],
          votes: results[3],
          regId: results[4],
        });
        console.log(results);
      } catch (err) {}
    },
    [publicClient]
  );

  useEffect(() => {
    isEnded && getWinnerInfo(electionId);
  }, [getWinnerInfo, electionId, isEnded]);
  if (!isEnded) return null;
  return (
    <div className="bg-gray-800 text-gray-100 rounded-lg p-6 mt-10 shadow-md">
      <div className="flex items-center mb-4">
        <FaTrophy className="text-yellow-500 text-3xl mr-3" />
        <h2 className="text-2xl font-semibold">Election Winner</h2>
      </div>
      <hr className="border-gray-700 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-1">Name</p>
          <p className="text-xl">{winner.name}</p>
        </div>
        <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-1">Party</p>
          <p className="text-xl">{winner.party}</p>
        </div>
        <div className="flex flex-col items-center bg-gray-900 p-4 rounded-lg shadow-md">
          <p className="text-lg font-semibold mb-1">Votes</p>
          <p className="text-xl">{parseInt(winner.votes)}</p>
        </div>
      </div>
    </div>
  );
};
