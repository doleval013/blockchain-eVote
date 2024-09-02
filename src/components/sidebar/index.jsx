import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAccount } from "wagmi";
import { useNavContext } from "@/src/context/navProvider";
import { shortenAddress } from "@/src/lib/address";
import { cn } from "@/src/lib/utils";

export const Sidebar = ({ paths = [] }) => {
  const { isOpen, isMobile, onClose } = useNavContext();
  const { address } = useAccount();
  const { pathname } = useLocation();

  const modalRef = useRef(null);

  useEffect(() => {
    const onDocumentClick = (event) => {
      if (!isMobile) return;
      const buttonEle = document.getElementById("modal-button");

      if (buttonEle?.contains(event.target)) return;
      if (modalRef.current?.contains(event.target)) return;
      onClose();
    };

    document.addEventListener("click", onDocumentClick);

    return () => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [isMobile, onClose]);

  return (
    <aside
      ref={modalRef}
      className={cn(
        "w-72 lg:w-80 min-w-[300px] flex flex-col h-screen bg-gray-900 text-gray-100 fixed lg:sticky top-0 bottom-0 overflow-y-auto p-6 shadow-lg z-50 transition-transform duration-300",
        {
          "translate-x-0": isOpen,
          "-translate-x-full": !isOpen,
        }
      )}
    >
      <h2 className="text-3xl font-bold mb-8 text-yellow-300">VoteSmart</h2>

      <div className="border-b border-gray-700 py-4 mb-6">
        <h2 className="text-lg font-semibold">Your Wallet Address:</h2>
        <p className="text-gray-400">
          {shortenAddress(address) || "NOT CONNECTED"}
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {paths.map(({ href, path, icon }, idx) => (
          <Link
            to={href}
            key={idx}
            className={cn(
              "group flex items-center gap-4 p-4 rounded-lg transition-colors duration-300",
              {
                "bg-gray-700 text-gray-100": pathname.endsWith(href),
                "hover:bg-gray-600 hover:text-gray-100": !pathname.endsWith(href),
              }
            )}
          >
            <span className="p-3 rounded-full transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white">
              {icon}
            </span>
            <p className="text-lg font-medium">
              {path}
            </p>
          </Link>
        ))}
      </div>
    </aside>
  );
};
