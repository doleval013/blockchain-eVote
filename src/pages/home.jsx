import { ConnectButton } from "@/src/components/connectButton";
import { FaLock, FaBolt, FaCheckCircle, FaEthereum } from "react-icons/fa";

export const Home = () => {
  return (
    <section className="h-full min-h-screen flex items-center bg-gradient-to-br from-gray-800 via-gray-600 to-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-5 py-10 w-full space-y-10 md:space-y-0">
        
        {/* Left Side: Main Content */}
        <div className="bg-white rounded-lg p-20 shadow-2xl flex flex-col justify-center items-center w-full md:w-1/2 max-w-lg md:max-w-none min-h-[630px] flex-grow">
          <div className="bg-gray-200 rounded-full p-4 mb-6">
            <FaEthereum className="text-4xl text-gray-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-5 tracking-wide">
            Welcome to VoteSmart
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-center">
            Please connect your wallet to continue
          </p>
          <ConnectButton className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-110" />
        </div>

        {/* Right Side: Features */}
        <div className="flex flex-col items-center w-full md:w-1/2 space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center w-full max-w-2xl">
            <div className="h-16 w-16 bg-yellow-500 text-black rounded-full flex items-center justify-center shadow-lg mb-4">
              <FaLock className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure</h3>
            <p className="text-gray-700">Our platform ensures security to protect your votes.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center w-full max-w-2xl">
            <div className="h-16 w-16 bg-red-500 text-black rounded-full flex items-center justify-center shadow-lg mb-4">
              <FaBolt className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Fast</h3>
            <p className="text-gray-700">Experience quick and efficient voting with our high-speed platform.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center flex flex-col items-center w-full max-w-2xl">
            <div className="h-16 w-16 bg-green-500 text-black rounded-full flex items-center justify-center shadow-lg mb-4">
              <FaCheckCircle className="text-2xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Reliable</h3>
            <p className="text-gray-700">Our system provides reliable and accurate results for every election.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
