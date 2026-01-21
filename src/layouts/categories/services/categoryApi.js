import api from "../../../services/api/api";

export const categoryApi = {
  // الحصول على جميع التصنيفات
  getAllCategories: (params) => api.get("/categories", { params }),

  // الحصول على تصنيف محدد
  getCategory: (id) => api.get(`/categories/${id}`),

  // إنشاء تصنيف جديد
  createCategory: (data) => api.post("/categories", data),

  // تحديث تصنيف
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),

  // حذف تصنيف
  deleteCategory: (id) => api.delete(`/categories/${id}`),

  // عدد التصنيفات
  countCategories: (params) => api.get("/categories/count", { params }),
};

export default categoryApi;
