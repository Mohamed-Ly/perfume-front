import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { useMaterialUIController, setDirection } from "context";

// Images
import bgImage from "assets/images/baroque-style-with-pink-flowers-arrangement.jpg";

// Redux actions
import { loginUser } from "store/slices/authSlice";

function SignIn() {
  const [, materialDispatch] = useMaterialUIController(); // غير اسم هذا
  const reduxDispatch = useDispatch(); // وغير اسم هذا
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoading } = useSelector((state) => state.auth);

  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });
  const [localError, setLocalError] = useState("");

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // مسح الخطأ المحلي عند البدء بالكتابة
    if (localError) {
      setLocalError("");
    }
  };

  useEffect(() => {
    setDirection(materialDispatch, "rtl"); // استخدم materialDispatch هنا
  }, [materialDispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    // التحقق من صحة البيانات الأساسية
    if (!formData.identifier.trim() || !formData.password.trim()) {
      setLocalError("يرجى ملء جميع الحقول");
      toast.error("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const result = await reduxDispatch(loginUser(formData)); // استخدم reduxDispatch هنا

      // معالجة النتيجة مباشرة
      if (loginUser.fulfilled.match(result)) {
        const user = result.payload.data.user;

        // التحقق من دور المستخدم
        if (user.role === "ADMIN") {
          toast.success("تم تسجيل الدخول بنجاح!");
          const from = location.state?.from?.pathname || "/dashboard";
          navigate(from, { replace: true });
        } else {
          toast.error("ليس لديك صلاحية للوصول إلى لوحة التحكم");
        }
      } else if (loginUser.rejected.match(result)) {
        // معالجة الخطأ مباشرة
        const errorMessage = result.payload || "فشل تسجيل الدخول";
        setLocalError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error.message || "حدث خطأ غير متوقع";
      setLocalError(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            تسجيل الدخول
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                name="identifier"
                label="البريد الإلكتروني أو رقم الهاتف"
                fullWidth
                value={formData.identifier}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={!!localError}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                name="password"
                label="كلمة المرور"
                fullWidth
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                error={!!localError}
              />
            </MDBox>

            {/* عرض الخطأ تحت الحقول */}
            {localError && (
              <MDBox mb={2}>
                <MDTypography variant="caption" color="error" fontWeight="medium">
                  {localError}
                </MDTypography>
              </MDBox>
            )}

            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} disabled={isLoading} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{
                  cursor: isLoading ? "not-allowed" : "pointer",
                  userSelect: "none",
                  ml: -1,
                  opacity: isLoading ? 0.6 : 1,
                }}
              >
                تذكرني
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                للمشرفين فقط
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default SignIn;
