import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Product API calls
export const productAPI = {
    // Get all products
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    // Get single product by ID
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Create new product with image
    createProduct: async (productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            if (productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        });

        const response = await axios.post(`${API_URL}/products`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Update product with image
    updateProduct: async (id, productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            if (productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        });

        const response = await axios.put(`${API_URL}/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Delete product
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // Search products
    searchProducts: async (query) => {
        const response = await api.get(`/products/search/${query}`);
        return response.data;
    },

    // Get low stock products
    getLowStockProducts: async () => {
        const response = await api.get('/products/low-stock');
        return response.data;
    }
};

// Category API calls
export const categoryAPI = {
    getAllCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    }
};

// Activity Log API calls
export const activityLogAPI = {
    getAllLogs: async (limit = 50, entityType = null) => {
        const params = { limit };
        if (entityType) params.entityType = entityType;
        const response = await api.get('/activity-logs', { params });
        return response.data;
    },

    getLogsByEntity: async (entityId) => {
        const response = await api.get(`/activity-logs/entity/${entityId}`);
        return response.data;
    }
};

// Auth API calls
export const authAPI = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};

// Report API calls
export const reportAPI = {
    getInventoryReport: async () => {
        const response = await api.get('/reports/inventory');
        return response.data;
    }
};

export default api;