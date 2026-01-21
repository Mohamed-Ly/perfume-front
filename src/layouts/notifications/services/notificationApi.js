import api from "../../../services/api/api";

export const notificationApi = {
  // الحصول على جميع الإشعارات (آخر 50 إشعار - للأدمن)
  getAllNotifications: (params) => api.get("/notifications/admin/all", { params }),

  // إنشاء إشعار جديد (لجميع المستخدمين أو مستخدم معين)
  createNotification: (data) => {
    return api.post("/notifications/admin", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};

export default notificationApi;
