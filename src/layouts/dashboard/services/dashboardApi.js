// import api from "../../../services/api/api";
// import orderApi from "../../orders/services/orderApi";
// import userApi from "../../users/services/userApi";

// // خرائط مساعدة
// const AR_MONTHS_SHORT = {
//   "01": "يناير",
//   "02": "فبراير",
//   "03": "مارس",
//   "04": "أبريل",
//   "05": "مايو",
//   "06": "يونيو",
//   "07": "يوليو",
//   "08": "أغسطس",
//   "09": "سبتمبر",
//   10: "أكتوبر",
//   11: "نوفمبر",
//   12: "ديسمبر",
// };

// // const WEEKDAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
// const WEEKDAYS_AR = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// const toMonthLabel = (ym, { short = false } = {}) => {
//   const [y, m] = ym.split("-");
//   return short ? AR_MONTHS_SHORT[m] : `${AR_MONTHS_SHORT[m]} ${y}`;
// };
// const toWeekdayLabel = (isoDate) => {
//   const d = new Date(isoDate);
//   return WEEKDAYS_AR[d.getDay()];
// };

// export const dashboardApi = {
//   // الإحصائيات الأساسية (للكروت)
//   getDashboardStats: async () => {
//     const [ordersStats, usersStats] = await Promise.all([
//       orderApi.getOrderStats(), // لديك مسبقًا
//       userApi.getUsersCount(), // لديك مسبقًا
//     ]);

//     return {
//       orders: ordersStats.data?.data?.stats || ordersStats.data?.stats || {},
//       users: usersStats.data?.data?.counts || usersStats.data?.counts || {},
//     };
//   },

//   // جديد: جلب السلاسل الزمنية من الباك
//   getChartsSeries: async () => {
//     const res = await api.get("/dashboard/charts");
//     // شكل الاستجابة حسب ما رجعناه من الباك
//     return (
//       res.data?.data || {
//         ordersMonthly: [],
//         ordersWeekly: [],
//         usersMonthly: [],
//       }
//     );
//   },

//   // كوّن بيانات الرسوم من السلاسل الزمنية
//   makeChartsFromSeries: (series) => {
//     const { ordersMonthly, ordersWeekly, usersMonthly } = series;

//     // 1) المبيعات الشهرية (Bar)
//     const revenueLabels = ordersMonthly.map((m) => toMonthLabel(m.ym, { short: true }));
//     const revenueData = ordersMonthly.map((m) => Math.floor((m.revenueCents || 0) / 100));
//     const revenueChart = {
//       labels: revenueLabels,
//       datasets: { label: "المبيعات (دينار)", data: revenueData },
//     };

//     // 2) الطلبات اليومية (Line) - آخر 7 أيام
//     const ordersLabels = ordersWeekly.map((d) => toWeekdayLabel(d.d));
//     const ordersData = ordersWeekly.map((d) => d.orders || 0);
//     const ordersChart = {
//       labels: ordersLabels,
//       datasets: { label: "عدد الطلبات", data: ordersData },
//     };

//     // 3) المستخدمون الجدد شهريًا (Line)
//     const usersLabels = usersMonthly.map((m) => toMonthLabel(m.ym, { short: true }));
//     const usersData = usersMonthly.map((m) => m.newUsers || 0);
//     const usersChart = {
//       labels: usersLabels,
//       datasets: { label: "المستخدمون الجدد", data: usersData },
//     };

//     return { revenueChart, ordersChart, usersChart };
//   },
// };

// export default dashboardApi;

// services/dashboardApi.js
import api from "../../../services/api/api";
import orderApi from "../../orders/services/orderApi";
import userApi from "../../users/services/userApi";

// خرائط مساعدة
const AR_MONTHS_SHORT = {
  "01": "يناير",
  "02": "فبراير",
  "03": "مارس",
  "04": "أبريل",
  "05": "مايو",
  "06": "يونيو",
  "07": "يوليو",
  "08": "أغسطس",
  "09": "سبتمبر",
  10: "أكتوبر",
  11: "نوفمبر",
  12: "ديسمبر",
};

const WEEKDAYS_AR_SHORT = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

const toMonthLabel = (ym, { short = false } = {}) => {
  const [y, m] = ym.split("-");
  return short ? AR_MONTHS_SHORT[m] : `${AR_MONTHS_SHORT[m]} ${y}`;
};

export const dashboardApi = {
  // الإحصائيات الأساسية (للكروت)
  getDashboardStats: async () => {
    const [ordersStats, usersStats] = await Promise.all([
      orderApi.getOrderStats(),
      userApi.getUsersCount(),
    ]);

    return {
      orders: ordersStats.data?.data?.stats || ordersStats.data?.stats || {},
      users: usersStats.data?.data?.counts || usersStats.data?.counts || {},
    };
  },

  // جلب السلاسل الزمنية من الباك
  getChartsSeries: async () => {
    const res = await api.get("/dashboard/charts");
    return (
      res.data?.data || {
        ordersMonthly: [],
        ordersWeekly: [],
        usersMonthly: [],
      }
    );
  },

  // كوّن بيانات الرسوم من السلاسل الزمنية
  makeChartsFromSeries: (series, todayOrders = 0) => {
    const { ordersMonthly, ordersWeekly, usersMonthly } = series;

    // 1) المبيعات الشهرية (Bar) - نعكس لعرض الأحدث أولاً
    const reversedMonthly = [...ordersMonthly].reverse();
    const revenueLabels = reversedMonthly.map((m) => toMonthLabel(m.ym, { short: true }));
    const revenueData = reversedMonthly.map((m) => Math.floor((m.revenueCents || 0) / 100));

    const revenueChart = {
      labels: revenueLabels,
      datasets: { label: "المبيعات (دينار)", data: revenueData },
    };

    // 2) الطلبات اليومية - التصحيح النهائي لترتيب الأيام
    const getWeeklyOrdersData = (weeklyData) => {
      // نحتاج لإعادة ترتيب البيانات لتبدأ من الأحد
      const dayOrder = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

      // إنشاء خريطة للبيانات حسب اسم اليوم
      const dataByDay = new Map();
      weeklyData.forEach((day) => {
        dataByDay.set(day.dayName, day.orders);
      });

      // إعادة بناء البيانات بالترتيب الصحيح
      const orderedLabels = [...dayOrder];
      const orderedData = dayOrder.map((dayName) => dataByDay.get(dayName) || 0);

      console.log("📊 Frontend - Reordered Weekly Data:", {
        original: weeklyData.map((d) => ({ day: d.dayName, orders: d.orders })),
        reordered: orderedLabels.map((label, index) => ({
          day: label,
          orders: orderedData[index],
        })),
        today: new Date().getDay(),
        todayName: WEEKDAYS_AR_SHORT[new Date().getDay()],
      });

      return { labels: orderedLabels, data: orderedData };
    };

    const weeklyChartData = getWeeklyOrdersData(ordersWeekly);

    // 3) المستخدمون الجدد شهريًا (Line) - نعكس لعرض الأحدث أولاً
    const reversedUsersMonthly = [...usersMonthly].reverse();
    const usersLabels = reversedUsersMonthly.map((m) => toMonthLabel(m.ym, { short: true }));
    const usersData = reversedUsersMonthly.map((m) => m.newUsers || 0);

    const usersChart = {
      labels: usersLabels,
      datasets: { label: "المستخدمون الجدد", data: usersData },
    };

    return {
      revenueChart,
      ordersChart: weeklyChartData,
      usersChart,
    };
  },
};

export default dashboardApi;
