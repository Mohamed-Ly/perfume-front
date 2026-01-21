import { useState } from "react";
import PropTypes from "prop-types";

// @mui material components
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  MenuItem,
} from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

function CreateBrandModal({ open, onClose, onSubmit }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // قائمة الدول العربية والعالمية
  const countries = [
    { value: "", label: "اختر البلد" },
    { value: "السعودية", label: "السعودية" },
    { value: "الإمارات", label: "الإمارات العربية المتحدة" },
    { value: "مصر", label: "مصر" },
    { value: "الأردن", label: "الأردن" },
    { value: "لبنان", label: "لبنان" },
    { value: "الكويت", label: "الكويت" },
    { value: "قطر", label: "قطر" },
    { value: "عمان", label: "عُمان" },
    { value: "البحرين", label: "البحرين" },
    { value: "العراق", label: "العراق" },
    { value: "الجزائر", label: "الجزائر" },
    { value: "المغرب", label: "المغرب" },
    { value: "تونس", label: "تونس" },
    { value: "فرنسا", label: "فرنسا" },
    { value: "إيطاليا", label: "إيطاليا" },
    { value: "إسبانيا", label: "إسبانيا" },
    { value: "ألمانيا", label: "ألمانيا" },
    { value: "بريطانيا", label: "بريطانيا" },
    { value: "الولايات المتحدة", label: "الولايات المتحدة الأمريكية" },
    { value: "كندا", label: "كندا" },
    { value: "تركيا", label: "تركيا" },
    { value: "الهند", label: "الهند" },
    { value: "الصين", label: "الصين" },
    { value: "اليابان", label: "اليابان" },
    { value: "كوريا الجنوبية", label: "كوريا الجنوبية" },
    { value: "أخرى", label: "أخرى" },
  ];

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isActive" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم الماركة مطلوب";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "اسم الماركة يجب أن يكون على الأقل حرفين";
    } else if (formData.name.trim().length > 60) {
      newErrors.name = "اسم الماركة يجب ألا يتجاوز 60 حرفاً";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // تنظيف البيانات - إذا كان البلد فارغاً نرسل null
      const submitData = {
        ...formData,
        country: formData.country || null,
      };

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error creating brand:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      country: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
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
          إضافة ماركة جديدة
        </MDTypography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* اسم الماركة */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="اسم الماركة *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
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

            {/* بلد الماركة */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="بلد الماركة"
                name="country"
                value={formData.country}
                onChange={handleChange}
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
              >
                {countries.map((country) => (
                  <MenuItem key={country.value} value={country.value}>
                    {country.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* حالة التفعيل */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    color="success"
                  />
                }
                label={
                  <MDTypography
                    variant="button"
                    color={darkMode ? "white" : "dark"}
                    fontWeight="medium"
                  >
                    {formData.isActive ? "مفعل" : "غير مفعل"}
                  </MDTypography>
                }
                disabled={loading}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
            color={darkMode ? "inherit" : "primary"}
            sx={{
              color: darkMode ? "text.main" : "primary.main",
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
              "& .MuiSvgIcon-root": {
                animation: loading ? "spin 1s linear infinite" : "none",
              },
              "@keyframes spin": {
                "0%": { transform: "rotate(0deg)" },
                "100%": { transform: "rotate(360deg)" },
              },
            }}
          >
            {loading ? "جاري الإضافة..." : "إضافة"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

CreateBrandModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateBrandModal;
