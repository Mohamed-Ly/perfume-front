import { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

function EditVariantModal({ open, onClose, onSubmit, variant }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    sizeMl: "",
    concentration: "",
    priceCents: "",
    stockQty: "",
    sku: "",
    barcode: "",
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // خيارات التركيز الشائعة للعطور
  const concentrationOptions = [
    { value: "EDP", label: "EDP - عطر مركز" },
    { value: "EDT", label: "EDT - عطر مائي" },
    { value: "Parfum", label: "بارفيوم - عطر نقي" },
    { value: "Cologne", label: "كولونيا" },
    { value: "Extrait", label: "إكسترايت" },
  ];

  // أحجام شائعة للعطور
  const sizeOptions = [
    { value: 30, label: "30 مل" },
    { value: 50, label: "50 مل" },
    { value: 60, label: "60 مل" },
    { value: 75, label: "75 مل" },
    { value: 90, label: "90 مل" },
    { value: 100, label: "100 مل" },
    { value: 125, label: "125 مل" },
    { value: 150, label: "150 مل" },
    { value: 200, label: "200 مل" },
  ];

  useEffect(() => {
    if (variant) {
      setFormData({
        sizeMl: variant.sizeMl || "",
        concentration: variant.concentration || "",
        priceCents: (variant.priceCents / 100).toString(), // تحويل القرش إلى ريال
        stockQty: variant.stockQty?.toString() || "",
        sku: variant.sku || "",
        // barcode: variant.barcode || "",
        isActive: variant.isActive ?? true,
      });
    }
  }, [variant]);

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

    if (!formData.priceCents || formData.priceCents < 0) {
      newErrors.priceCents = "السعر مطلوب ويجب أن يكون رقمًا موجبًا";
    }

    if (formData.stockQty && formData.stockQty < 0) {
      newErrors.stockQty = "المخزون يجب أن يكون 0 أو أكبر";
    }

    if (formData.sizeMl && (formData.sizeMl < 1 || formData.sizeMl > 10000)) {
      newErrors.sizeMl = "الحجم غير صالح";
    }

    if (formData.concentration && formData.concentration.length < 2) {
      newErrors.concentration = "التركيز غير صالح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        priceCents: parseInt(formData.priceCents) * 100, // تحويل الريال إلى قرش
        stockQty: formData.stockQty ? parseInt(formData.stockQty) : 0,
        sizeMl: formData.sizeMl ? parseInt(formData.sizeMl) : null,
        concentration: formData.concentration || null,
        sku: formData.sku || null,
        // barcode: formData.barcode || null,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error updating variant:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      sizeMl: "",
      concentration: "",
      priceCents: "",
      stockQty: "",
      sku: "",
      // barcode: "",
      isActive: true,
    });
    setErrors({});
    onClose();
  };

  if (!variant) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
          تعديل المتغير
        </MDTypography>
        <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
          ID: {variant.id}
        </MDTypography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* الحجم */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>الحجم (مل)</InputLabel>
                <Select
                  name="sizeMl"
                  value={formData.sizeMl}
                  onChange={handleChange}
                  label="الحجم (مل)"
                  disabled={loading}
                  sx={{
                    height: "42px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>لا يوجد</em>
                  </MenuItem>
                  {sizeOptions.map((size) => (
                    <MenuItem key={size.value} value={size.value}>
                      {size.label}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">
                    <em>حجم مخصص</em>
                  </MenuItem>
                </Select>
              </FormControl>
              {formData.sizeMl === "custom" && (
                <TextField
                  fullWidth
                  label="الحجم المخصص (مل)"
                  name="sizeMl"
                  value={formData.sizeMl}
                  onChange={handleChange}
                  type="number"
                  margin="normal"
                  error={!!errors.sizeMl}
                  helperText={errors.sizeMl}
                  disabled={loading}
                />
              )}
            </Grid>

            {/* التركيز */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>التركيز</InputLabel>
                <Select
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleChange}
                  label="التركيز"
                  disabled={loading}
                  sx={{
                    height: "42px",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>لا يوجد</em>
                  </MenuItem>
                  {concentrationOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">
                    <em>تركيز مخصص</em>
                  </MenuItem>
                </Select>
              </FormControl>
              {formData.concentration === "custom" && (
                <TextField
                  fullWidth
                  label="التركيز المخصص"
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleChange}
                  margin="normal"
                  error={!!errors.concentration}
                  helperText={errors.concentration}
                  disabled={loading}
                />
              )}
            </Grid>

            {/* السعر */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="السعر (دينار) *"
                name="priceCents"
                type="number"
                value={formData.priceCents}
                onChange={handleChange}
                error={!!errors.priceCents}
                helperText={errors.priceCents}
                disabled={loading}
                InputProps={{
                  endAdornment: <MDTypography variant="button">د.ل</MDTypography>,
                }}
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

            {/* المخزون */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="المخزون"
                name="stockQty"
                type="number"
                value={formData.stockQty}
                onChange={handleChange}
                error={!!errors.stockQty}
                helperText={errors.stockQty}
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

            {/* SKU */}
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="SKU (كود المنتج)"
                name="sku"
                value={formData.sku}
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
              />
            </Grid>

            {/* الباركود */}
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الباركود"
                name="barcode"
                value={formData.barcode}
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
              />
            </Grid> */}

            {/* الحالة */}
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
            }}
          >
            {loading ? "جاري التحديث..." : "تحديث"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditVariantModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  variant: PropTypes.object,
};

export default EditVariantModal;
