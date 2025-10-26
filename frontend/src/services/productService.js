import api from "../utils/api";

// ✅ Get all products
export const getProducts = async () => {
    const res = await api.get("/products");
    return res.data.data; // backend returns { success, data: [...] }
};

// ✅ Create new product
export const createProduct = async (product) => {
    const res = await api.post("/products", product);
    return res.data;
};

// ✅ Update existing product
export const updateProduct = async (id, product) => {
    const res = await api.put(`/products/${id}`, product);
    return res.data;
};

// ✅ Delete product
export const deleteProduct = async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
};
