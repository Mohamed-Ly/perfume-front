// services/offerApi.js - الإصدار البسيط
import api from "../../../services/api/api";

export const offerApi = {
  // الحصول على جميع العروض (للأدمن)
  getAllOffers: (params) => api.get("/offers/admin/all", { params }),

  // الحصول على عرض محدد
  getOfferById: (offerId) => api.get(`/offers/${offerId}`),

  // إنشاء عرض جديد - بسيط بدون تحويل
  createOffer: (data) => {
    const formData = new FormData();

    console.log("🔄 createOffer - Sending data as-is:", data);

    // إضافة جميع الحقول كما هي - الباك إند سيتكفل بالتحويل
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    return api.post("/offers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // تحديث عرض - بسيط بدون تحويل
  updateOffer: (offerId, data) => {
    const formData = new FormData();

    console.log("🔄 updateOffer - Sending data as-is:", data);

    // إضافة جميع الحقول كما هي - الباك إند سيتكفل بالتحويل
    Object.keys(data).forEach((key) => {
      if (key === "image" && data[key] instanceof File) {
        formData.append("image", data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach((item) => formData.append(`${key}[]`, item));
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });

    return api.put(`/offers/${offerId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // حذف عرض
  deleteOffer: (offerId) => api.delete(`/offers/${offerId}`),

  // تفعيل/تعطيل عرض
  toggleOffer: (offerId) => api.patch(`/offers/${offerId}/toggle`),
};

export default offerApi;
