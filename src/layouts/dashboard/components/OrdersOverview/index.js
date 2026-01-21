// layouts/dashboard/components/OrdersOverview.js
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "examples/Timeline/TimelineItem";
import orderApi from "../../../orders/services/orderApi";

function OrdersOverview() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentOrders = async () => {
    try {
      const response = await orderApi.getAllOrders({
        page: 1,
        limit: 5,
        sort: "-createdAt",
      });

      const orders = response.data?.data?.orders || [];
      setRecentOrders(orders);
    } catch (error) {
      console.error("❌ Error fetching recent orders:", error);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      CONFIRMED: "info",
      SHIPPED: "primary",
      DELIVERED: "success",
      CANCELLED: "error",
    };
    return colors[status] || "secondary";
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: "schedule",
      CONFIRMED: "check_circle",
      SHIPPED: "local_shipping",
      DELIVERED: "assignment_turned_in",
      CANCELLED: "cancel",
    };
    return icons[status] || "shopping_cart";
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: "قيد الانتظار",
      CONFIRMED: "تم التأكيد",
      SHIPPED: "تم الشحن",
      DELIVERED: "تم التسليم",
      CANCELLED: "ملغي",
    };
    return texts[status] || status;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-LY", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (priceCents) => {
    return new Intl.NumberFormat("ar-LY", {
      style: "currency",
      currency: "LYD",
      minimumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  if (loading) {
    return (
      <Card sx={{ height: "100%" }}>
        <MDBox pt={3} px={3}>
          <MDTypography variant="h6" fontWeight="medium">
            أحدث الطلبات
          </MDTypography>
          <MDBox p={2} textAlign="center">
            <MDTypography variant="body2" color="text">
              جاري تحميل البيانات...
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          أحدث الطلبات
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              {recentOrders.length} طلب
            </MDTypography>{" "}
            هذا الشهر
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {recentOrders.length === 0 ? (
          <MDBox textAlign="center" py={3}>
            <MDTypography variant="body2" color="text">
              لا توجد طلبات حديثة
            </MDTypography>
          </MDBox>
        ) : (
          recentOrders.map((order, index) => (
            <TimelineItem
              key={order.id}
              color={getStatusColor(order.status)}
              icon={getStatusIcon(order.status)}
              title={`طلب #${order.orderNumber}`}
              dateTime={formatDate(order.createdAt)}
              description={`${formatPrice(order.totalCents)} - ${getStatusText(order.status)}`}
              lastItem={index === recentOrders.length - 1}
            />
          ))
        )}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
