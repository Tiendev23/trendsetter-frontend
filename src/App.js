import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các components trang admin
import Layout from './components/Layout';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import BrandList from './components/BrandList';
import UserList from './components/UserList';
import OrderList from './components/OrderList';
import OrderDetail from './components/OrderDetail';

import LoginPage from './components/LoginPage';      
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/products" replace />} />

            <Route path="categories" element={<CategoryList />} />
            <Route path="products" element={<ProductList />} />
            <Route path="brands" element={<BrandList />} />
            <Route path="users" element={<UserList />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            
          </Route>
        </Route>

       
        {/* Nếu chưa đăng nhập, ProtectedRoute sẽ tự chuyển về /login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;