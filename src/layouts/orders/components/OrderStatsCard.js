import { Grid, Card, Box } from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function StatCard({ title, value, icon, color, loading, darkMode }) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card>
        <MDBox display="flex" alignItems="center" p={2}>
          <MDBox
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="4rem"
            height="4rem"
            borderRadius="md"
            variant="gradient"
            bgColor={color}
            color="white"
            shadow="md"
            mr={2}
          >
            <Icon fontSize="medium">{icon}</Icon>
          </MDBox>
          <MDBox>
            <MDTypography variant="button" color="text" fontWeight="medium">
              {title}
            </MDTypography>
            <MDTypography variant="h5" fontWeight="bold">
              {loading ? "..." : value}
            </MDTypography>
          </MDBox>
        </MDBox>
      </Card>
    </Grid>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  darkMode: PropTypes.bool,
};

StatCard.defaultProps = {
  loading: false,
  darkMode: false,
};

function OrderStatsCard({ stats, loading, darkMode }) {
  const formatPrice = (priceCents) => {
    return new Intl.NumberFormat("ar-LY", {
      style: "currency",
      currency: "LYD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceCents / 100);
  };

  return (
    <>
      <StatCard
        title="إجمالي الطلبات"
        value={stats?.totalOrders || 0}
        icon="shopping_cart"
        color="info"
        loading={loading}
        darkMode={darkMode}
      />

      <StatCard
        title="المبيعات الإجمالية"
        value={formatPrice(stats?.totalRevenue || 0)}
        icon="payments"
        color="success"
        loading={loading}
        darkMode={darkMode}
      />

      <StatCard
        title="متوسط قيمة الطلب"
        value={formatPrice(stats?.averageOrderValue || 0)}
        icon="analytics"
        color="primary"
        loading={loading}
        darkMode={darkMode}
      />

      <StatCard
        title="طلبات اليوم"
        value={stats?.todayOrders || 0}
        icon="today"
        color="warning"
        loading={loading}
        darkMode={darkMode}
      />
    </>
  );
}

OrderStatsCard.propTypes = {
  stats: PropTypes.shape({
    totalOrders: PropTypes.number,
    totalRevenue: PropTypes.number,
    averageOrderValue: PropTypes.number,
    todayOrders: PropTypes.number,
  }),
  loading: PropTypes.bool,
  darkMode: PropTypes.bool,
};

OrderStatsCard.defaultProps = {
  stats: {},
  loading: false,
  darkMode: false,
};

export default OrderStatsCard;
