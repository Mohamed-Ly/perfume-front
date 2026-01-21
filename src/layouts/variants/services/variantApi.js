// services/variantApi.js
import api from "../../../services/api/api";

export const variantApi = {
  // الحصول على جميع متغيرات المنتج
  getAllVariants: (productId, params) => api.get(`/products/${productId}/variants`, { params }),

  // الحصول على متغير محدد
  getVariant: (productId, variantId) => api.get(`/products/${productId}/variants/${variantId}`),

  // إنشاء متغير جديد
  createVariant: (productId, data) => api.post(`/products/${productId}/variants`, data),

  // تحديث متغير
  updateVariant: (productId, variantId, data) =>
    api.patch(`/products/${productId}/variants/${variantId}`, data),

  // حذف متغير
  deleteVariant: (productId, variantId) =>
    api.delete(`/products/${productId}/variants/${variantId}`),

  // عدد المتغيرات
  countVariants: (productId, params) =>
    api.get(`/products/${productId}/variants/count`, { params }),

  // تعديل المخزون
  adjustStock: (productId, variantId, data) =>
    api.post(`/products/${productId}/variants/${variantId}/adjust-stock`, data),
};

export default variantApi;
