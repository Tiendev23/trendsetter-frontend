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

// Brand
export const fetchBrands = () => axios.get(`${API_URL}/brands`);
export const createBrand = (data) => axios.post(`${API_URL}/brands`, data);
export const updateBrand = (id, data) => axios.put(`${API_URL}/brands/${id}`, data);
export const deleteBrand = (id) => axios.delete(`${API_URL}/brands/${id}`);

// Product
export const fetchProducts = (filters = {}) => {
  let url = `${API_URL}/products`;
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.brand) params.append('brand', filters.brand);
  if ([...params].length) url += `?${params.toString()}`;
  return axios.get(url);
};
export const createProduct = (data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('category', data.category);
  if (data.brand) formData.append('brand', data.brand);
  formData.append('description', data.description || '');
  formData.append('sizes', JSON.stringify(data.sizes || []));
  formData.append('colors', JSON.stringify(data.colors || []));
  if (data.imageFile) formData.append('image', data.imageFile);
  if (data.bannerFile) formData.append('banner', data.bannerFile);
  return axios.post(`${API_URL}/products`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateProduct = (id, data) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('price', data.price);
  formData.append('category', data.category);
  if (data.brand) formData.append('brand', data.brand);
  formData.append('description', data.description || '');
  formData.append('sizes', JSON.stringify(data.sizes || []));
  formData.append('colors', JSON.stringify(data.colors || []));
  if (data.imageFile) formData.append('image', data.imageFile);
  if (data.bannerFile) formData.append('banner', data.bannerFile);
  return axios.put(`${API_URL}/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);