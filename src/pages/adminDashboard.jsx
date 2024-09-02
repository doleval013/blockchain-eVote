import { useEffect } from "react";
import { useAdminContext } from "../context/adminsContext";
import { useVotersContext } from "../context/votersContext";
import { useElectionsContext } from "../context/electionsContext";
import { RiAdminFill } from "react-icons/ri";
import { GiVote } from "react-icons/gi";
import { MdHowToVote } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

export const AdminDashboard = () => {
  const { getAdminLogs, roles } = useAdminContext();
  const { getElections, elections } = useElectionsContext();
  const { getVoters, voters } = useVotersContext();

  useEffect(() => {
    getAdminLogs();
    getVoters();
    getElections();
  }, [getAdminLogs, getElections, getVoters]);

  return (
    <section>
      <div className="bg-gray-300 min-h-screen flex flex-col gap-5 p-5">
        
        {/* Admins Card */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-6 rounded-lg shadow-2xl flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-yellow-300 flex gap-2 items-center mb-4">
            <RiAdminFill className="text-yellow-400" />
            Admins
          </h2>
          <div className="flex justify-between items-center w-full">
            <p className="text-3xl font-semibold text-white">{roles.length}</p>
            <Link to="/admin/manage-admins">
              <FaEye className="text-yellow-400 hover:text-yellow-500 transition-all text-2xl" />
            </Link>
          </div>
        </div>

        {/* Elections Card */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-6 rounded-lg shadow-2xl flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-red-300 flex gap-2 items-center mb-4">
            <GiVote className="text-red-400" />
            Elections
          </h2>
          <div className="flex justify-between items-center w-full">
            <p className="text-3xl font-semibold text-white">{elections.length}</p>
            <Link to="/admin/manage-elections">
              <FaEye className="text-red-400 hover:text-red-500 transition-all text-2xl" />
            </Link>
          </div>
        </div>

        {/* Voters Card */}
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-6 rounded-lg shadow-2xl flex flex-col items-center w-full">
          <h2 className="text-2xl font-bold text-green-300 flex gap-2 items-center mb-4">
            <MdHowToVote className="text-green-400" />
            Voters
          </h2>
          <div className="flex justify-between items-center w-full">
            <p className="text-3xl font-semibold text-white">{voters.length}</p>
            <Link to="/admin/manage-voters">
              <FaEye className="text-green-400 hover:text-green-500 transition-all text-2xl" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
