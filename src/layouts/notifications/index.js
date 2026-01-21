import { useState, useEffect } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Badge from "@mui/material/Badge";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Context
import { useMaterialUIController, setDirection } from "context";

// API services
import notificationApi from "./services/notificationApi";

// Components
import CreateNotificationModal from "./components/CreateNotificationModal";

function Notifications() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Set RTL direction
  useEffect(() => {
    setDirection(dispatch, "rtl");
    return () => setDirection(dispatch, "ltr");
  }, [dispatch]);

  // Fetch campaigns
  const fetchCampaigns = async () => {
    try {
      setLoading(true);

      const response = await notificationApi.getAllNotifications();

      // ✅ التصحيح: البيانات الآن في response.data.data.campaigns
      const campaignsData = response.data?.data?.campaigns || [];

      console.log("📋 Loaded campaigns:", campaignsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("❌ Error fetching campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // التحميل الأولي
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // إنشاء إشعار
  const handleCreateNotification = async (notificationData) => {
    try {
      await notificationApi.createNotification(notificationData);
      await fetchCampaigns(); // إعادة تحميل القائمة بعد الإنشاء
      setCreateModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  // دوال المساعدة
  const getNotificationTypeText = (type) => {
    const types = {
      ORDER_CREATED: "طلب جديد",
      ORDER_CONFIRMED: "تم تأكيد الطلب",
      ORDER_SHIPPED: "تم شحن الطلب",
      ORDER_DELIVERED: "تم التسليم",
      ORDER_CANCELLED: "تم إلغاء الطلب",
      LOW_STOCK: "مخزون منخفض",
      PROMOTIONAL: "ترويجي",
      SYSTEM: "نظام",
    };
    return types[type] || type;
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      ORDER_CREATED: "primary",
      ORDER_CONFIRMED: "success",
      ORDER_SHIPPED: "info",
      ORDER_DELIVERED: "success",
      ORDER_CANCELLED: "error",
      LOW_STOCK: "warning",
      PROMOTIONAL: "secondary",
      SYSTEM: "default",
    };
    return colors[type] || "default";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-LY", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const truncateText = (text, length = 50) => {
    if (!text) return "";
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  // حساب إجمالي المستلمين
  const totalRecipients = campaigns.reduce((total, campaign) => total + campaign.recipients, 0);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox display="flex" alignItems="center" gap={2}>
                  <MDTypography
                    variant="h6"
                    color="white"
                    sx={{
                      fontWeight: "bold",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    حملات الإشعارات
                  </MDTypography>
                  <Badge
                    badgeContent={campaigns.length}
                    color="secondary"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    <Icon sx={{ color: "white" }}>campaign</Icon>
                  </Badge>
                </MDBox>
                <MDButton
                  variant="gradient"
                  color={darkMode ? "light" : "dark"}
                  onClick={() => setCreateModalOpen(true)}
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  حملة جديدة
                </MDButton>
              </MDBox>

              {/* Stats Cards */}
              <MDBox p={2} display="flex" gap={2} flexWrap="wrap">
                <Card sx={{ minWidth: 200, p: 2 }}>
                  <MDTypography variant="h6" color="text">
                    عدد الحملات
                  </MDTypography>
                  <MDTypography variant="h4" color="info" fontWeight="bold">
                    {campaigns.length}
                  </MDTypography>
                </Card>
                <Card sx={{ minWidth: 200, p: 2 }}>
                  <MDTypography variant="h6" color="text">
                    إجمالي المستلمين
                  </MDTypography>
                  <MDTypography variant="h4" color="success" fontWeight="bold">
                    {totalRecipients}
                  </MDTypography>
                </Card>
              </MDBox>

              {/* Campaigns Table */}
              <MDBox pt={1} pb={2}>
                {loading ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      جاري تحميل البيانات...
                    </MDTypography>
                  </MDBox>
                ) : campaigns.length === 0 ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      لا توجد حملات إشعارات
                    </MDTypography>
                  </MDBox>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow
                          sx={{
                            backgroundColor: darkMode
                              ? "rgba(255,255,255,0.05)"
                              : "rgba(0,0,0,0.02)",
                            borderBottom: "2px solid",
                            borderBottomColor: darkMode
                              ? "rgba(255,255,255,0.1)"
                              : "rgba(0,0,0,0.1)",
                          }}
                        >
                          <TableCell
                            sx={{
                              width: "10%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              color: darkMode ? "text.main" : "text.primary",
                              py: 2,
                            }}
                          >
                            نوع الحملة
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              color: darkMode ? "text.main" : "text.primary",
                              py: 2,
                            }}
                          >
                            العنوان
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              color: darkMode ? "text.main" : "text.primary",
                              py: 2,
                            }}
                          >
                            المحتوى
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              color: darkMode ? "text.main" : "text.primary",
                              py: 2,
                            }}
                          >
                            عدد المستلمين
                          </TableCell>
                          <TableCell
                            sx={{
                              width: "10%",
                              textAlign: "center",
                              fontWeight: "bold",
                              fontSize: "0.875rem",
                              color: darkMode ? "text.main" : "text.primary",
                              py: 2,
                            }}
                          >
                            آخر إرسال
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {campaigns.map((campaign, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Chip
                                label={getNotificationTypeText(campaign.type)}
                                color={getNotificationTypeColor(campaign.type)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="button" fontWeight="medium">
                                {campaign.title}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="caption" color="text">
                                {truncateText(campaign.body)}
                              </MDTypography>
                            </TableCell>
                            <TableCell>
                              <Badge
                                badgeContent={campaign.recipients}
                                color="primary"
                                sx={{
                                  "& .MuiBadge-badge": {
                                    fontSize: "0.7rem",
                                    fontWeight: "bold",
                                  },
                                }}
                              >
                                <MDTypography variant="button" fontWeight="medium">
                                  مستخدم
                                </MDTypography>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <MDTypography variant="caption">
                                {formatDate(campaign.lastSentAt)}
                              </MDTypography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* إظهار الإحصائيات */}
                    <MDBox p={2}>
                      <MDTypography variant="button" color="text">
                        عرض {campaigns.length} حملة إشعارات
                      </MDTypography>
                    </MDBox>
                  </TableContainer>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modal إنشاء الإشعار */}
      <CreateNotificationModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNotification}
      />
    </DashboardLayout>
  );
}

export default Notifications;
