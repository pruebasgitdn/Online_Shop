import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const isAuth = useSelector((state: RootState) => state.user.isAuthenticated);

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
