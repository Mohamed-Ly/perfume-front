// services/productApi.js
import api from "../../../services/api/api";

export const productApi = {
  // الحصول على جميع المنتجات
  getAllProducts: (params) => api.get("/products", { params }),

  // الحصول على منتج محدد
  getProduct: (id) => api.get(`/products/${id}`),

  // إنشاء منتج جديد - استخدام FormData
  createProduct: (data) =>
    api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // تحديث منتج - استخدام FormData
  updateProduct: (id, data) =>
    api.patch(`/products/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // حذف منتج
  deleteProduct: (id) => api.delete(`/products/${id}`),

  // عدد المنتجات
  countProducts: (params) => api.get("/products/count", { params }),
};

export default productApi;
