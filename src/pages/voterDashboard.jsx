import { Link } from "react-router-dom";
import { useElectionsContext } from "../context/electionsContext";
import { shortenAddress } from "../lib/address";
import { keccak256, toBytes } from "viem";
import { ELECTION_STAGES } from "../lib/constants";
import { useEffect } from "react";

export const VoterDashboard = () => {
  const { getElections, elections } = useElectionsContext();

  useEffect(() => {
    getElections();
  }, [getElections]);
  return (
    <section className="p-6 bg-gray-300 min-h-screen">
      <div className="flex p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-lg mb-6 text-gray-100">
        <h2 className="basis-1/3 text-xl font-semibold">Election Id</h2>
        <h2 className="basis-1/3 text-xl font-semibold">Election Name</h2>
        <h2 className="basis-1/3 text-xl font-semibold">Stage</h2>
      </div>

      <div>
        {elections.map((election, idx) => (
          <Link
            to={`/voter/election/${election.id}`}
            className="flex py-4 px-6 mb-2 rounded-md hover:bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 text-gray-100 bg-gray-800 transition-transform transform hover:scale-105 shadow-md"
            key={idx}
          >
            <p className="basis-1/3 truncate">
              {shortenAddress(keccak256(toBytes(parseInt(election.id))))}
            </p>
            <p className="basis-1/3">{election.electionName}</p>
            <p className="basis-1/3">{ELECTION_STAGES[election.stage]}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
