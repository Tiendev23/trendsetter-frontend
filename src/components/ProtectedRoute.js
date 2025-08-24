// src/components/ProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Kiểm tra xem token có tồn tại trong localStorage không
  const token = localStorage.getItem('token');

  // 2. Dùng toán tử ba ngôi để quyết định
  // Nếu có token (token === true), thì render <Outlet />
  // Nếu không có token (token === false), thì chuyển hướng đến trang /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;