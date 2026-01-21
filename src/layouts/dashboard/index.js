// layouts/dashboard/index.js
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useMaterialUIController, setDirection } from "context";
import dashboardApi from "./services/dashboardApi";

// استيراد المخططات المخصصة
import CustomOrdersChart from "./components/CustomOrdersChart";
import CustomRevenueChart from "./components/CustomRevenueChart";
import CustomUsersChart from "./components/CustomUsersChart";

function Dashboard() {
  const [, dispatch] = useMaterialUIController();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    totalUsers: 0,
    customers: 0,
    admins: 0,
  });
  const [revenueChart, setRevenueChart] = useState({
    labels: [],
    datasets: [{ label: "", data: [] }],
  });
  const [ordersChartData, setOrdersChartData] = useState({
    labels: [],
    data: [],
  });
  const [usersChart, setUsersChart] = useState({
    labels: [],
    datasets: [{ label: "", data: [] }],
  });
  const [loading, setLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    setDirection(dispatch, "rtl");
    return () => setDirection(dispatch, "ltr");
  }, [dispatch]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setChartsLoading(true);

      const statsData = await dashboardApi.getDashboardStats();
      const newStats = {
        totalOrders: statsData.orders.totalOrders || 0,
        totalRevenue: statsData.orders.totalRevenue || 0,
        todayOrders: statsData.orders.todayOrders || 0,
        totalUsers: statsData.users.total || 0,
        customers: statsData.users.customers || 0,
        admins: statsData.users.admins || 0,
      };
      setStats(newStats);

      const series = await dashboardApi.getChartsSeries();
      const charts = dashboardApi.makeChartsFromSeries(series, newStats.todayOrders);

      setRevenueChart(charts.revenueChart);
      setOrdersChartData(charts.ordersChart); // البيانات للمخطط المخصص
      setUsersChart(charts.usersChart);
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      // Fallback data
      setOrdersChartData({
        labels: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
        data: [2, 0, 0, 0, 0, 1, 0],
      });
    } finally {
      setLoading(false);
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatPrice = (priceCents) => {
    return new Intl.NumberFormat("ar-LY", {
      style: "currency",
      currency: "LYD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* الكروت الإحصائية */}
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="shopping_cart"
                title="إجمالي الطلبات"
                count={loading ? "..." : stats.totalOrders}
                percentage={{ color: "success", amount: "+12%", label: "مقارنة بالأسبوع الماضي" }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="people"
                title="إجمالي المستخدمين"
                count={loading ? "..." : stats.totalUsers}
                percentage={{ color: "success", amount: "+8%", label: "مقارنة بالشهر الماضي" }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="payments"
                title="الإيرادات"
                count={loading ? "..." : formatPrice(stats.totalRevenue)}
                percentage={{ color: "success", amount: "+15%", label: "مقارنة بالشهر الماضي" }}
              />
            </MDBox>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="today"
                title="طلبات اليوم"
                count={loading ? "..." : stats.todayOrders}
                percentage={{
                  color: stats.todayOrders > 0 ? "success" : "error",
                  amount: stats.todayOrders > 0 ? "+5%" : "0%",
                  label: "مقارنة بالأمس",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* مخطط المبيعات الشهرية المخصص */}
            <Grid item xs={12} md={6} lg={4}>
              <CustomRevenueChart
                data={{
                  labels: revenueChart.labels,
                  data: revenueChart.datasets?.data || [],
                }}
                loading={chartsLoading}
                title="المبيعات الشهرية"
              />
            </Grid>

            {/* المخطط المخصص للطلبات اليومية */}
            <Grid item xs={12} md={6} lg={4}>
              <CustomOrdersChart
                data={ordersChartData}
                loading={chartsLoading}
                title="الطلبات اليومية"
              />
            </Grid>

            {/* مخطط المستخدمين الجدد المخصص */}
            <Grid item xs={12} md={6} lg={4}>
              <CustomUsersChart
                data={{
                  labels: usersChart.labels,
                  data: usersChart.datasets?.data || [],
                }}
                loading={chartsLoading}
                title="المستخدمين الجدد"
              />
            </Grid>
          </Grid>
        </MDBox>

        <MDBox style={{ marginTop: "50px" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
