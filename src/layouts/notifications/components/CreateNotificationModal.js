import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function CreateNotificationModal({ open, onClose, onSubmit }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    type: "PROMOTIONAL",
    title: "",
    body: "",
    userId: "", // إذا كان فارغاً = لجميع المستخدمين
    data: {},
    isPush: true, // إرسال كـ push notification
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // أنواع الإشعارات
  const notificationTypes = [
    { value: "LOW_STOCK", label: "مخزون منخفض" },
    { value: "PROMOTIONAL", label: "ترويجي" },
    { value: "SYSTEM", label: "نظام" },
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isPush" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان الإشعار مطلوب";
    } else if (formData.title.trim().length < 2 || formData.title.trim().length > 100) {
      newErrors.title = "العنوان يجب أن يكون بين 2 و 100 حرف";
    }

    if (!formData.body.trim()) {
      newErrors.body = "محتوى الإشعار مطلوب";
    } else if (formData.body.trim().length < 2 || formData.body.trim().length > 500) {
      newErrors.body = "المحتوى يجب أن يكون بين 2 و 500 حرف";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // تنظيف البيانات قبل الإرسال
      const submitData = {
        ...formData,
        userId: formData.userId ? parseInt(formData.userId) : undefined, // تحويل إلى number إذا موجود
        data: formData.data || {}, // تأكد من أن data كائن
      };

      console.log("📤 Sending notification data:", submitData);
      await onSubmit(submitData);
    } catch (error) {
      console.error("❌ Error creating notification:", error);

      // معالجة أخطاء السيرفر
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        const newErrors = {};

        Object.keys(serverErrors).forEach((key) => {
          if (key === "undefined") {
            newErrors.general = serverErrors[key];
          } else {
            newErrors[key] = serverErrors[key];
          }
        });

        setErrors(newErrors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: "PROMOTIONAL",
      title: "",
      body: "",
      userId: "",
      data: {},
      isPush: true,
    });
    setErrors({});
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
          إنشاء إشعار جديد
        </MDTypography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          {errors.general && (
            <MDBox mb={2}>
              <MDTypography
                variant="body2"
                color="error"
                align="center"
                sx={{
                  p: 1,
                  backgroundColor: "rgba(244,67,54,0.1)",
                  borderRadius: 1,
                  border: "1px solid rgba(244,67,54,0.3)",
                }}
              >
                <Icon sx={{ mr: 1, fontSize: "1rem" }}>error</Icon>
                {errors.general}
              </MDTypography>
            </MDBox>
          )}

          <Grid container spacing={3}>
            {/* نوع الإشعار */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>نوع الإشعار</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="نوع الإشعار"
                >
                  {notificationTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* عنوان الإشعار */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="عنوان الإشعار *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                disabled={loading}
              />
            </Grid>

            {/* محتوى الإشعار */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="محتوى الإشعار *"
                name="body"
                multiline
                rows={4}
                value={formData.body}
                onChange={handleChange}
                error={!!errors.body}
                helperText={errors.body}
                disabled={loading}
              />
            </Grid>

            {/* إرسال كـ Push Notification */}
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPush}
                    onChange={handleChange}
                    name="isPush"
                    color="primary"
                  />
                }
                label={
                  <MDTypography variant="body2">
                    إرسال كـ Push Notification
                    {formData.isPush && (
                      <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                        (سيتم إرسال إشعار push للمستخدمين)
                      </Typography>
                    )}
                  </MDTypography>
                }
              />
            </Grid> */}

            {/* معلومات إضافية */}
            {/* <Grid item xs={12}>
              <MDBox
                p={2}
                sx={{
                  backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  borderRadius: 1,
                }}
              >
                <MDTypography variant="body2" color="text">
                  💡 ملاحظة: إذا تركت حقل معرّف المستخدم فارغاً، سيتم إرسال الإشعار لجميع
                  المستخدمين.
                  {formData.isPush && " وسيتم إرسال push notification للأجهزة المسجلة."}
                </MDTypography>
              </MDBox>
            </Grid> */}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleClose} disabled={loading} color={darkMode ? "inherit" : "primary"}>
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
                <Icon>send</Icon>
              )
            }
          >
            {loading ? "جاري الإرسال..." : "إنشاء الإشعار"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

CreateNotificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateNotificationModal;
