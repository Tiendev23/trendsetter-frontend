    import axios from 'axios';

    const API_URL = 'https://trendsetter-backend.onrender.com/api';
    //const API_URL = 'http://localhost:5000/api'

    // Tạo một instance của axios
    const apiClient = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // Cấu hình Interceptor
    // Đoạn code này sẽ tự động thêm token vào header của MỌI request gửi đi từ apiClient
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );


    // ===== AUTHENTICATION =====
    // Hàm login vẫn dùng axios gốc vì lúc này chưa cần token
    export const login = (credentials) =>
        axios.post(`${API_URL}/auth/login`, {
            emailOrUsername: credentials.username,  // Dùng username hoặc email đều được
            password: credentials.password
        });// Đăng ký
    export const register = (data) => apiClient.post(`/users`, data);

    export const logout = () => {
        localStorage.removeItem('token');
        // Xóa header Authorization khỏi các request trong tương lai nếu cần
        delete apiClient.defaults.headers.common['Authorization'];
        window.location.href = '/login'; // Chuyển hướng về trang login
    };


    // ===== User =====
    export const fetchUsers = () => apiClient.get(`/users`);
    export const createUser = (data) => apiClient.post(`/users`, data);
    export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
    export const deleteUser = (id) => apiClient.delete(`/users/${id}`);

    export const fetchCommentsByProduct = (productId) =>
        apiClient.get(`/comments/product/${productId}`);

    export const createComment = (data) =>
        apiClient.post(`/comments`, data);

    export const deleteComment = (id) =>
        apiClient.delete(`/comments/${id}`);

    // ===== Favorites =====
    export const fetchUserFavorites = (userId) =>
        apiClient.get(`/users/${userId}/favorites`);

    export const addUserFavorite = (userId, productId) =>
        apiClient.post(`/users/${userId}/favorites`, { productId });

    export const removeUserFavorite = (userId, productId) =>
        apiClient.delete(`/users/${userId}/favorites/${productId}`);


    export const fetchProductById = (id) => apiClient.get(`/products/${id}`);


    // ===== Đơn hàng =====
    export const fetchOrders = () => apiClient.get(`/orders`);
    export const fetchOrderById = (id) => apiClient.get(`/orders/${id}`);
    export const createOrder = (data) => apiClient.post(`/orders`, data);
    export const updateOrderStatus = (id, status) => apiClient.put(`/orders/${id}/status`, { status });
    export const deleteOrder = (id) => apiClient.delete(`/orders/${id}`);


    // ===== Loại sản phẩm =====
    export const fetchCategories = () => apiClient.get(`/categories`);
    export const fetchLevelOneCategories = () => apiClient.get(`/categories/level-one`);
    export const fetchSubCategories = (parentId) => apiClient.get(`/categories/sub/${parentId}`);
    export const createCategory = (data) => apiClient.post(`/categories`, data);
    export const updateCategory = (id, data) => apiClient.put(`/categories/${id}`, data);
    export const deleteCategory = (id) => apiClient.delete(`/categories/${id}`);


    // ===== Thương hiệu =====
    export const fetchBrands = () => apiClient.get(`/brands`);
    export const createBrand = (data) => apiClient.post(`/brands`, data);
    export const updateBrand = (id, data) => apiClient.put(`/brands/${id}`, data);
    export const deleteBrand = (id) => apiClient.delete(`/brands/${id}`);

    // ===== Sản phẩm =====
    export const fetchProducts = (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.category) params.append('category', filters.category);
        if (filters.brand) params.append('brand', filters.brand);
        // Sử dụng apiClient và truyền params
        return apiClient.get('/products', { params });
    };
    // export const createProduct = (data) => {
    //     const formData = new FormData();
    //     // ... (giữ nguyên phần tạo formData)
    //     formData.append('name', data.name);
    //     formData.append('price', data.price);
    //     formData.append('category', data.category);
    //     if (data.brand) formData.append('brand', data.brand);
    //     formData.append('description', data.description || '');
    //     formData.append('sizes', JSON.stringify(data.sizes || []));
    //     formData.append('colors', JSON.stringify(data.colors || []));
    //     if (data.imageFile) formData.append('image', data.imageFile);
    //     if (data.bannerFile) formData.append('banner', data.bannerFile);

    //     return apiClient.post(`/products`, formData, {
    //         headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    // };

    // export const updateProduct = (productId, data) => {
    //     const formData = new FormData();
    //     // ... (giữ nguyên phần tạo formData)
    //     formData.append('name', data.name);
    //     formData.append('price', data.price);
    //     formData.append('category', data.category);
    //     if (data.brand) formData.append('brand', data.brand);
    //     formData.append('description', data.description || '');
    //     formData.append('sizes', JSON.stringify(data.sizes || []));
    //     formData.append('colors', JSON.stringify(data.colors || []));
    //     if (data.imageFile) formData.append('image', data.imageFile);
    //     if (data.bannerFile) formData.append('banner', data.bannerFile);

    //     return apiClient.put(`/products/${productId}`, formData, {
    //         headers: { 'Content-Type': 'multipart/form-data' },
    //     });
    // };

export const createProduct = (formData) => {
    return apiClient.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateProduct = (productId, formData) => {
    return apiClient.put(`/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

    export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);