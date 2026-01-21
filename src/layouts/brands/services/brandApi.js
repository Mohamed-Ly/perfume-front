import api from "../../../services/api/api";

export const brandApi = {
  // الحصول على جميع الماركات
  getAllBrands: (params) => api.get("/brands", { params }),

  // الحصول على ماركة محددة
  getBrand: (id) => api.get(`/brands/${id}`),

  // إنشاء ماركة جديدة
  createBrand: (data) => api.post("/brands", data),

  // تحديث ماركة
  updateBrand: (id, data) => api.patch(`/brands/${id}`, data),

  // حذف ماركة
  deleteBrand: (id) => api.delete(`/brands/${id}`),

  // عدد الماركات
  countBrands: (params) => api.get("/brands/count", { params }),
};

export default brandApi;
