// services/orderApi.js
import api from "../../../services/api/api";

export const orderApi = {
  // الأدمن: الحصول على جميع الطلبات
  getAllOrders: (params) => api.get("/orders/admin/all", { params }),

  // الأدمن: إحصائيات الطلبات
  getOrderStats: (params) => api.get("/orders/admin/stats", { params }),

  // الأدمن: تفاصيل طلب
  getOrderDetails: (orderId) => api.get(`/orders/admin/${orderId}`),

  // الأدمن: تحديث حالة الطلب
  updateOrderStatus: (orderId, data) => api.patch(`/orders/admin/${orderId}/status`, data),

  // الأدمن: حذف طلب
  deleteOrder: (orderId) => api.delete(`/orders/admin/${orderId}`),

  // المستخدم: طلباتي
  getUserOrders: (params) => api.get("/orders", { params }),

  // المستخدم: تفاصيل طلب
  getUserOrder: (orderId) => api.get(`/orders/${orderId}`),
};

export default orderApi;
