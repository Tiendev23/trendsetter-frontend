import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// ===== Loại sản phẩm =====
export const fetchCategories = () => axios.get(`${API_URL}/categories`);

export const createCategory = (data) => {
  if (data instanceof FormData) {
    return axios.post(`${API_URL}/categories`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return axios.post(`${API_URL}/categories`, data);
};

export const updateCategory = (id, data) => {
  if (data instanceof FormData) {
    return axios.put(`${API_URL}/categories/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
  return axios.put(`${API_URL}/categories/${id}`, data);
};

export const deleteCategory = (id) => axios.delete(`${API_URL}/categories/${id}`);


// ===== Sản phẩm =====

export const fetchProducts = (categoryId) => {
  const url = categoryId ? `${API_URL}/products?category=${categoryId}` : `${API_URL}/products`;
  return axios.get(url);
};

export const createProduct = (data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('category', data.category);
  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }
  return axios.post(`${API_URL}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = (id, data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('category', data.category);
  if (data.imageFile) {
    formData.append('image', data.imageFile);
  }
  return axios.put(`${API_URL}/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);
