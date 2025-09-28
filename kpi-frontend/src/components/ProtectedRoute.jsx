import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    // ถ้าไม่มี token ส่งกลับไปหน้า login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
