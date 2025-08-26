import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { accessToken, setAccessToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const logout = () => {
    setIsLoading(true);

    // Simulate async (e.g. API call, cleanup)
    setTimeout(() => {
      accessToken && setAccessToken("");
      accessToken && localStorage.removeItem("accessToken");
      dToken && setDToken("");
      dToken && localStorage.removeItem("dToken");

      setIsLoading(false);
      navigate("/");
    }, 1000); // delay just to show loading effect
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      <div className="flex items-center gap-2 text-xs">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {accessToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={logout}
        disabled={isLoading}
        className={`${
          isLoading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
        } bg-primary-custom text-white text-sm px-10 py-2 rounded-full flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Logging out...
          </>
        ) : (
          "Logout"
        )}
      </button>
    </div>
  );
};

export default Navbar;
