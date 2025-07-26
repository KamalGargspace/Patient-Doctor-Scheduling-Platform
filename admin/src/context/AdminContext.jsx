import { useState } from "react";
import { createContext } from "react";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [accessToken, setAccessToken] = useState("");

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const value = {
    accessToken,
    setAccessToken,
    backendUrl,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
