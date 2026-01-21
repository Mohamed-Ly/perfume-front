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
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Context
import { useMaterialUIController } from "context";

function AdjustStockModal({ open, onClose, onConfirm, variant }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [adjustmentType, setAdjustmentType] = useState("increase"); // 'increase' or 'decrease'
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // التحقق من الصحة
    const newErrors = {};
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "الكمية مطلوبة ويجب أن تكون أكبر من 0";
    }
    if (!reason.trim()) {
      newErrors.reason = "سبب التعديل مطلوب";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const delta = adjustmentType === "increase" ? parseInt(quantity) : -parseInt(quantity);
      await onConfirm(delta);
      handleClose();
    } catch (error) {
      console.error("Error adjusting stock:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAdjustmentType("increase");
    setQuantity("");
    setReason("");
    setErrors({});
    onClose();
  };

  if (!variant) return null;

  const newStock =
    adjustmentType === "increase"
      ? variant.stockQty + parseInt(quantity || 0)
      : variant.stockQty - parseInt(quantity || 0);

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
          تعديل المخزون
        </MDTypography>
        <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
          المخزون الحالي: <strong>{variant.stockQty}</strong>
        </MDTypography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            {/* نوع التعديل */}
            <Grid item xs={12}>
              <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mb={1}>
                نوع التعديل
              </MDTypography>
              <RadioGroup
                row
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
              >
                <FormControlLabel
                  value="increase"
                  control={<Radio color="success" />}
                  label={
                    <MDBox display="flex" alignItems="center">
                      <Icon sx={{ color: "success.main", mr: 1 }}>add</Icon>
                      <MDTypography>زيادة المخزون</MDTypography>
                    </MDBox>
                  }
                />
                <FormControlLabel
                  value="decrease"
                  control={<Radio color="error" />}
                  label={
                    <MDBox display="flex" alignItems="center">
                      <Icon sx={{ color: "error.main", mr: 1 }}>remove</Icon>
                      <MDTypography>نقصان المخزون</MDTypography>
                    </MDBox>
                  }
                />
              </RadioGroup>
            </Grid>

            {/* الكمية */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`الكمية ${adjustmentType === "increase" ? "المضافة" : "المخصومة"}`}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={!!errors.quantity}
                helperText={errors.quantity}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <Icon
                      sx={{
                        color: adjustmentType === "increase" ? "success.main" : "error.main",
                        mr: 1,
                      }}
                    >
                      {adjustmentType === "increase" ? "add" : "remove"}
                    </Icon>
                  ),
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

            {/* السبب */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="سبب التعديل *"
                multiline
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={!!errors.reason}
                helperText={errors.reason || "مثال: شراء جديد، مرتجعات، تلف، إلخ"}
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

            {/* ملخص التعديل */}
            <Grid item xs={12}>
              <MDBox
                p={2}
                sx={{
                  backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                  borderRadius: "8px",
                  border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <MDTypography variant="h6" color={darkMode ? "white" : "dark"} mb={1}>
                  ملخص التعديل
                </MDTypography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
                      المخزون الحالي:
                    </MDTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography variant="body2" fontWeight="bold">
                      {variant.stockQty}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={6}>
                    <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
                      الكمية {adjustmentType === "increase" ? "المضافة" : "المخصومة"}:
                    </MDTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography
                      variant="body2"
                      fontWeight="bold"
                      color={adjustmentType === "increase" ? "success.main" : "error.main"}
                    >
                      {adjustmentType === "increase" ? "+" : "-"}
                      {quantity || 0}
                    </MDTypography>
                  </Grid>

                  <Grid item xs={6}>
                    <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
                      المخزون الجديد:
                    </MDTypography>
                  </Grid>
                  <Grid item xs={6}>
                    <MDTypography
                      variant="body2"
                      fontWeight="bold"
                      color={newStock >= 0 ? "success.main" : "error.main"}
                    >
                      {newStock}
                      {newStock < 0 && " ❌ (لا يمكن أن يكون المخزون سالباً)"}
                    </MDTypography>
                  </Grid>
                </Grid>
              </MDBox>
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
            color={adjustmentType === "increase" ? "success" : "error"}
            type="submit"
            disabled={loading || newStock < 0}
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
            {loading
              ? "جاري التعديل..."
              : adjustmentType === "increase"
              ? "زيادة المخزون"
              : "خصم المخزون"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

AdjustStockModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  variant: PropTypes.object,
};

export default AdjustStockModal;
