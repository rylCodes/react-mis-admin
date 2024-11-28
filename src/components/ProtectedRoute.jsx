import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Call your auth endpoint to check if the user is authenticated
        const response = await axios.get(
          `http://localhost:8000/api/admin/auth`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        console.log(response.data);

        // Check if the user is a admin type (you can adjust this based on your actual logic)
        if (response.data?.data?.user_type === "admin") {
          setIsAuthenticated(true);
          setIsAdmin(true);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />; // Redirect to login if not authenticated or not a admin
  }

  return children;
};

export default ProtectedRoute;
