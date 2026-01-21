/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import Alert from "@mui/material/Alert";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Context
import { useMaterialUIController, setDirection } from "context";

// API services
import userApi from "../users/services/userApi";

// Components
import EditProfileModal from "./components/EditProfileModal";

function Profile() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;

  // الحصول على بيانات المستخدم من الـ Redux store
  const { user: authUser, isAuthenticated } = useSelector((state) => state.auth);

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Set RTL direction
  useEffect(() => {
    setDirection(dispatch, "rtl");
    return () => setDirection(dispatch, "ltr");
  }, [dispatch]);

  // جلب بيانات المستخدم الحالي من API
  const fetchCurrentUser = async () => {
    try {
      setLoading(true);

      // إذا كان لدينا بيانات المستخدم في الـ store مع ID
      if (authUser && authUser.id) {
        try {
          // جلب البيانات المحدثة من API
          const response = await userApi.getUserDetails(authUser.id);

          // استخراج بيانات المستخدم من الاستجابة
          const userData = response.data?.data?.user || response.data?.user || response.data;

          if (userData) {
            setCurrentUser(userData);
          } else {
            throw new Error("لم يتم العثور على بيانات المستخدم في الاستجابة");
          }
        } catch (apiError) {
          // إذا فشل API نستخدم البيانات من الـ store
          setCurrentUser(authUser);
          setMessage({
            type: "warning",
            text: "تم تحميل البيانات المحفوظة محلياً",
          });
        }
      } else {
        // إذا لم يكن هناك user في الـ store، نستخدم البيانات من localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
        } else {
          setMessage({
            type: "error",
            text: "لم يتم العثور على بيانات المستخدم. يرجى تسجيل الدخول مرة أخرى.",
          });
        }
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setMessage({
        type: "error",
        text: "فشل في تحميل بيانات المستخدم",
      });
    } finally {
      setLoading(false);
    }
  };

  // التحميل الأولي
  useEffect(() => {
    if (authUser && authUser.id) {
      fetchCurrentUser();
    } else {
      // محاولة استخدام بيانات من localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setLoading(false);
      } else {
        setLoading(false);
        setMessage({
          type: "warning",
          text: "لم يتم العثور على بيانات المستخدم المسجل",
        });
      }
    }
  }, [authUser]);

  // تحديث بيانات المستخدم
  const handleUpdateProfile = async (userData) => {
    try {
      if (!currentUser?.id) {
        throw new Error("لا يوجد معرف مستخدم");
      }

      const response = await userApi.updateUser(currentUser.id, userData);

      // استخراج البيانات المحدثة من الاستجابة
      const updatedUser = response.data?.data?.user || response.data?.user || response.data;

      if (!updatedUser) {
        throw new Error("لم يتم استلام بيانات المستخدم المحدثة");
      }

      // تحديث الـ state المحلي
      setCurrentUser(updatedUser);

      // تحديث localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditModalOpen(false);
      toast.success("تم تحديث بياناتك الشخصية بنجاح!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        rtl: true,
      });

      // إخفاء الرسالة بعد 3 ثواني
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "فشل في تحديث البيانات";

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        rtl: true,
      });

      throw new Error(errorMessage);
    }
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    try {
      return new Date(dateString).toLocaleDateString("ar-LY", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "تاريخ غير صالح";
    }
  };

  // عرض القيمة أو النص البديل
  const displayValue = (value, fallback = "غير محدد") => {
    return value || fallback;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox p={3} textAlign="center">
          <MDTypography variant="h6" color="text">
            جاري تحميل البيانات...
          </MDTypography>
        </MDBox>
        <Footer />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />

      {/* رسائل التنبيه */}
      {message.text && (
        <MDBox mx={2} mt={2}>
          <Alert
            severity={message.type}
            onClose={() => setMessage({ type: "", text: "" })}
            sx={{ direction: "rtl" }}
          >
            {message.text}
          </Alert>
        </MDBox>
      )}

      {currentUser ? (
        <MDBox>
          {/* الهيدر */}
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
            <MDBox>
              <MDTypography variant="h6" color="white" fontWeight="bold">
                الملف الشخصي
              </MDTypography>
            </MDBox>
            <MDButton
              variant="gradient"
              color={darkMode ? "light" : "dark"}
              onClick={() => setEditModalOpen(true)}
              startIcon={<Icon>edit</Icon>}
            >
              تعديل الملف الشخصي
            </MDButton>
          </MDBox>

          {/* محتوى الصفحة */}
          <MDBox mt={4} mb={3}>
            <Grid container spacing={3}>
              {/* معلومات المستخدم */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h5" gutterBottom fontWeight="bold">
                      المعلومات الشخصية
                    </MDTypography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            الاسم الكامل
                          </MDTypography>
                          <MDTypography variant="body1" fontWeight="medium">
                            {displayValue(currentUser.name)}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            البريد الإلكتروني
                          </MDTypography>
                          <MDTypography variant="body1">
                            {displayValue(currentUser.email)}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <MDBox mb={2}>
                          <MDTypography variant="caption" color="text" fontWeight="medium">
                            رقم الهاتف
                          </MDTypography>
                          <MDTypography variant="body1">
                            {displayValue(currentUser.phone)}
                          </MDTypography>
                        </MDBox>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {/* معلومات إضافية */}
              <Grid item xs={12} lg={6}>
                <Card>
                  <MDBox p={3}>
                    <MDTypography variant="h5" gutterBottom fontWeight="bold">
                      معلومات الحساب
                    </MDTypography>
                    <MDBox mb={2}>
                      <MDTypography variant="caption" color="text" fontWeight="medium">
                        معرف المستخدم
                      </MDTypography>
                      <MDTypography variant="body2" fontFamily="monospace">
                        #{displayValue(currentUser.id, "غير معروف")}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={2}>
                      <MDTypography variant="caption" color="text" fontWeight="medium">
                        تاريخ التسجيل
                      </MDTypography>
                      <MDTypography variant="body2">
                        {formatDate(currentUser.createdAt)}
                      </MDTypography>
                    </MDBox>
                    <MDBox mb={2}>
                      <MDTypography variant="caption" color="text" fontWeight="medium">
                        آخر تحديث
                      </MDTypography>
                      <MDTypography variant="body2">
                        {formatDate(currentUser.updatedAt)}
                      </MDTypography>
                    </MDBox>
                    <Divider sx={{ my: 2 }} />
                    <MDBox>
                      <MDTypography variant="caption" color="text" fontWeight="medium">
                        حالة الحساب
                      </MDTypography>
                      <MDTypography
                        variant="body2"
                        color={isAuthenticated ? "success" : "error"}
                        fontWeight="medium"
                      >
                        {isAuthenticated ? "✓ نشط" : "✗ غير نشط"}
                      </MDTypography>
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
      ) : (
        <MDBox p={3} textAlign="center">
          <MDTypography variant="h6" color="error">
            لم يتم العثور على بيانات المستخدم
          </MDTypography>
          <MDButton variant="gradient" color="info" onClick={fetchCurrentUser} sx={{ mt: 2 }}>
            إعادة المحاولة
          </MDButton>
        </MDBox>
      )}

      <Footer />

      {/* مودال تعديل الملف الشخصي */}
      <EditProfileModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
        user={currentUser}
      />
    </DashboardLayout>
  );
}

export default Profile;
