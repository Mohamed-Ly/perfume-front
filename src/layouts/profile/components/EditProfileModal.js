import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  Alert,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

// regex لرقم الهاتف متوافق مع الباك إند
const phoneRegex = /^[+\d][\d\s-]{5,}$/;

function EditProfileModal({ open, onClose, onSubmit, user }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setSubmitError("");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // تحقق من الاسم (مطابق للباك إند)
    if (formData.name && formData.name.trim()) {
      const nameValue = formData.name.trim();
      if (nameValue.length < 2 || nameValue.length > 50) {
        newErrors.name = "الاسم يجب أن يكون بين 2 و 50 حرفًا";
      }
    }

    // تحقق من البريد الإلكتروني (مطابق للباك إند)
    if (formData.email && formData.email.trim()) {
      const emailValue = formData.email.trim();
      if (!/\S+@\S+\.\S+/.test(emailValue)) {
        newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
      }
    }

    // تحقق من رقم الهاتف (مطابق للباك إند)
    if (formData.phone && formData.phone.trim()) {
      const phoneValue = formData.phone.trim();
      if (!phoneRegex.test(phoneValue)) {
        newErrors.phone = "صيغة رقم الهاتف غير صحيحة";
      }
    }

    // تحقق من كلمة المرور (إضافي للفرونت إند فقط)
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "كلمة المرور يجب ألا تقل عن 8 أحرف";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setSubmitError("");

    try {
      // إعداد البيانات للإرسال (مطابق لتوقعات الباك إند)
      const submitData = {};

      // إضافة الحقول فقط إذا كانت تحتوي على قيم
      if (formData.name.trim()) {
        submitData.name = formData.name.trim();
      }

      if (formData.email.trim()) {
        submitData.email = formData.email.trim();
      }

      if (formData.phone.trim()) {
        submitData.phone = formData.phone.trim();
      }

      if (formData.address.trim()) {
        submitData.address = formData.address.trim();
      }

      if (formData.password) {
        submitData.password = formData.password;
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error updating profile:", error);

      const errorMessage =
        error.response?.data?.message || error.message || "فشل في تحديث البيانات";
      setSubmitError(errorMessage);

      // معالجة أخطاء محددة من السيرفر
      const serverError = error.response?.data;

      if (serverError) {
        // معالجة أخطاء التحقق من الصحة من الباك إند
        if (serverError.errors) {
          const serverErrors = {};
          serverError.errors.forEach((err) => {
            if (err.path === "name") serverErrors.name = err.msg;
            if (err.path === "email") serverErrors.email = err.msg;
            if (err.path === "phone") serverErrors.phone = err.msg;
          });
          setErrors(serverErrors);
        }

        // معالجة أخطاء أخرى من الباك إند
        if (serverError.message) {
          if (serverError.message.includes("البريد الإلكتروني")) {
            setErrors((prev) => ({ ...prev, email: serverError.message }));
          } else if (serverError.message.includes("رقم الهاتف")) {
            setErrors((prev) => ({ ...prev, phone: serverError.message }));
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSubmitError("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? handleClose : null}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: darkMode ? "background.card" : "background.default",
          backgroundImage: "none",
        },
      }}
    >
      <DialogTitle>
        <MDTypography variant="h5" fontWeight="medium" color={darkMode ? "white" : "dark"}>
          تعديل الملف الشخصي
        </MDTypography>
        <MDTypography variant="body2" color="text">
          تحديث معلوماتك الشخصية
        </MDTypography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* رسالة الخطأ العامة */}
          {submitError && !Object.keys(errors).length && (
            <Alert severity="error" sx={{ mb: 2, direction: "rtl" }}>
              {submitError}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* الاسم */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={
                  <span style={{ color: darkMode ? "white" : "black" }}>
                    {errors.name || "بين 2 و 50 حرفاً (اختياري)"}
                  </span>
                }
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid>

            {/* البريد الإلكتروني */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={
                  <span style={{ color: darkMode ? "white" : "black" }}>
                    {errors.email || "صيغة بريد إلكتروني صحيحة (اختياري)"}
                  </span>
                }
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid>

            {/* رقم الهاتف */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="رقم الهاتف"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={
                  <span style={{ color: darkMode ? "white" : "black" }}>
                    {errors.phone || "صيغة رقم هاتف صحيحة (اختياري)"}
                  </span>
                }
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid>

            {/* العنوان */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="العنوان"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid> */}

            {/* كلمة المرور */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="كلمة المرور الجديدة"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={
                  <span style={{ color: darkMode ? "white" : "black" }}>
                    {errors.password || "8 أحرف على الأقل (اختياري)"}
                  </span>
                }
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid>

            {/* تأكيد كلمة المرور */}
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="تأكيد كلمة المرور"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                disabled={loading}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: darkMode ? "text.main" : "text.primary",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  },
                }}
              />
            </Grid>

            {/* ملاحظات */}
            <Grid item xs={12}>
              <MDBox
                p={2}
                sx={{
                  backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  borderRadius: "8px",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <MDTypography variant="body2" color={darkMode ? "white" : "dark"}>
                  <strong>ملاحظة:</strong> جميع الحقول اختيارية. يمكنك تحديث الحقول التي تريد
                  تغييرها فقط. اترك الحقول التي لا تريد تحديثها كما هي.
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={handleClose}
            disabled={loading}
            color={darkMode ? "inherit" : "primary"}
            sx={{
              color: darkMode ? "text.main" : "primary.main",
              minWidth: 100,
            }}
          >
            إلغاء
          </Button>
          <MDButton
            variant="gradient"
            color="info"
            type="submit"
            disabled={loading}
            startIcon={
              loading ? (
                <Icon sx={{ animation: "spin 1s linear infinite" }}>refresh</Icon>
              ) : (
                <Icon>check</Icon>
              )
            }
            sx={{
              minWidth: 150,
              "& .MuiSvgIcon-root": {
                animation: loading ? "spin 1s linear infinite" : "none",
              },
            }}
          >
            {loading ? "جاري التحديث..." : "حفظ التغييرات"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditProfileModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    address: PropTypes.string,
    role: PropTypes.string,
  }),
};

EditProfileModal.defaultProps = {
  user: null,
};

export default EditProfileModal;
