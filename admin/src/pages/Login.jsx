import React from "react";
import { assets } from "../assets/assets";
import { useState, useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- 1. ADDED STATE
  const { setAccessToken, backendUrl } = useContext(AdminContext);
  const { setDToken} = useContext(DoctorContext);


  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        try {
          const response = await axios.post(backendUrl + "/api/admin/login", {
            email,
            password,
          });

          const data = response.data?.data;
          console.log("token", data.token);

          if (response.data?.success) {
            localStorage.setItem("accessToken", data.token);
            setAccessToken(data.token);
            toast.success("Login successful");
          } else {
            toast.error(response.data?.message || "Login failed");
          }
        } catch (error) {
          const message =
            error.response?.data?.message || "Something went wrong!";
          toast.error(message);
          console.error("Login error:", message);
        }
      } else {
          try {
            const response = await axios.post(backendUrl + "/api/doctor/login", {
            email,
            password,
          });

          const data = response.data?.data;
          console.log("token", data.token);

          if (response.data?.success) {
            localStorage.setItem("dToken", data.token);
            setDToken(data.token);
            toast.success("Login successful");
          } else {
            toast.error(response.data?.message || "Login failed");
          }
          } catch (error) {
             const message =
            error.response?.data?.message || "Something went wrong!";
          toast.error(message);
          console.error("Login error:", message);
          }
      }
    } catch (error) {}
  };
  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg">
        <p className="text-2xl font-semibold m-auto">
          <span className="text-primary-custom">{state}</span> Login
        </p>
        <div className="w-full ">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type="email"
            required
          />
        </div>
        {/* --- 2. UPDATED PASSWORD BLOCK --- */}
        <div className="w-full relative">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            type={showPassword ? "text" : "password"}
            required
          />
          <img
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 cursor-pointer"
            src={showPassword ? assets.eye_open : assets.eye_close}
            alt="Toggle password visibility"
            width={20}
          />
        </div>
        {/* --- END OF UPDATED BLOCK --- */}
        <button className="bg-primary-custom text-white w-full py-2 rounded-md text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              className="text-primary-custom underline cursor-pointer "
              onClick={() => setState("Doctor")}
            >
              {" "}
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              className="text-primary-custom underline cursor-pointer "
              onClick={() => setState("Admin")}
            >
              {" "}
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;