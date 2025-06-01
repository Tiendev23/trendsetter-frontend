import React, { useState } from 'react';
import Layout from './components/Layout';
import CategoryList from './components/CategoryList';
import ProductList from './components/ProductList';

function App() {
  const [page, setPage] = useState('categories');

  return (
    <Layout onMenuSelect={setPage}>
      {page === 'categories' && <CategoryList />}
      {page === 'products' && <ProductList />}
    </Layout>
  );
}

export default App;
