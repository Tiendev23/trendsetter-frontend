import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';
import BrandList from './components/BrandList';
import UserList from './components/UserList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/products" replace />} />
          <Route path="categories" element={<CategoryList />} />
          <Route path="products" element={<ProductList />} />
          <Route path="brands" element={<BrandList />} />
          <Route path="users" element={<UserList />} />
          {/* Các route khác nếu có */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
