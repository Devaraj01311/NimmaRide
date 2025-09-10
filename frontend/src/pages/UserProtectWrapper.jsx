import React, { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval } from 'react-loader-spinner';


const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setLoading] = useState(true); 

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setUser(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate, setUser]);
  
if (isLoading) {
  return (
<div className="flex justify-center items-center h-screen">
  <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
</div>
  );
}


  return <>{children}</>;
};

export default UserProtectWrapper;
