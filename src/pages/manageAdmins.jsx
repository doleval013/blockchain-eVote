import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { usePublicClient, useWriteContract } from "wagmi";
import { Evoting_ABI, Evoting_Address } from "../configs/contractConfigs";
import { shortenAddress } from "../lib/address";
import { ADMIN_ROLE } from "../lib/constants";
import { useAdminContext } from "../context/adminsContext";

const ROLES_TO_NAME = {
  "0x0000000000000000000000000000000000000000000000000000000000000000":
    "Admin 0",
  "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775": "Admin",
};

export const ManageAdmins = () => {
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const { getAdminLogs, roles } = useAdminContext();

  const onGrantRole = (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const account = form.get("account");
    const action = new Promise(async (resolve, reject) => {
      try {
        const txId = await writeContractAsync({
          abi: Evoting_ABI,
          address: Evoting_Address,
          functionName: "grantRole",
          args: [ADMIN_ROLE, account],
        });
        await publicClient.waitForTransactionReceipt({
          hash: txId,
        });

        getAdminLogs();

        resolve(null);
      } catch (err) {
        reject(err.shortMessage || err.message);
      }
    });

    toast.promise(action, {
      loading: "Please accept tx in wallet and wait",
      success: "Role granted successfully",
      error: (err) => err,
    });
  };

  useEffect(() => {
    getAdminLogs();
  }, [getAdminLogs]);

  return (
    <section className="p-6 bg-gray-300 min-h-screen">
      <div className="mb-10 flex justify-end">
        <form onSubmit={onGrantRole} className="flex items-center space-x-3">
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
            Grant Role
          </button>
        </form>
      </div>

      <div className="flex p-6 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 rounded-lg shadow-xl mb-4">
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Role</h2>
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Account</h2>
        <h2 className="basis-1/3 text-xl font-semibold text-yellow-300">Assigned By</h2>
      </div>

      <div>
        {roles.map((role, idx) => (
          <div className="flex py-4 px-6 even:bg-gray-800 bg-gray-700 rounded-md shadow-lg mb-2" key={idx}>
            <p className="basis-1/3 text-white">{ROLES_TO_NAME[role.role]}</p>
            <p className="basis-1/3 text-white">{shortenAddress(role.account)}</p>
            <p className="basis-1/3 text-white">{shortenAddress(role.sender)}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
