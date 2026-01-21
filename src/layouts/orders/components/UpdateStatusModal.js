import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Button,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function UpdateStatusModal({ open, onClose, onSubmit, order, currentStatus }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [status, setStatus] = useState(currentStatus || "");
  const [cancelledReason, setCancelledReason] = useState("");
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: "PENDING", label: "قيد المراجعة", icon: "schedule" },
    { value: "CONFIRMED", label: "مؤكد", icon: "check_circle" },
    { value: "SHIPPING", label: "قيد الشحن", icon: "local_shipping" },
    { value: "DELIVERED", label: "تم التسليم", icon: "done_all" },
    { value: "CANCELLED", label: "ملغي", icon: "cancel" },
  ];

  const handleSubmit = async () => {
    if (!status) return;

    setLoading(true);
    try {
      const submitData = { status };
      if (status === "CANCELLED" && cancelledReason.trim()) {
        submitData.cancelledReason = cancelledReason.trim();
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus(currentStatus || "");
    setCancelledReason("");
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
          تحديث حالة الطلب
        </MDTypography>
        {order && (
          <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
            رقم الطلب: {order.orderNumber}
          </MDTypography>
        )}
      </DialogTitle>

      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>حالة الطلب</InputLabel>
          <Select value={status} onChange={(e) => setStatus(e.target.value)} label="حالة الطلب">
            {statusOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center">
                  <Icon sx={{ mr: 1 }}>{option.icon}</Icon>
                  {option.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {status === "CANCELLED" && (
          <TextField
            fullWidth
            margin="normal"
            label="سبب الإلغاء"
            multiline
            rows={3}
            value={cancelledReason}
            onChange={(e) => setCancelledReason(e.target.value)}
            placeholder="أدخل سبب إلغاء الطلب..."
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
                "& .MuiInputBase-input": {
                  color: darkMode ? "text.main" : "text.primary",
                },
              },
            }}
          />
        )}

        {/* ملاحظات */}
        <MDBox
          mt={2}
          p={2}
          sx={{
            backgroundColor: darkMode ? "rgba(33,150,243,0.1)" : "rgba(33,150,243,0.05)",
            borderRadius: 1,
            border: `1px solid ${darkMode ? "rgba(33,150,243,0.2)" : "rgba(33,150,243,0.1)"}`,
          }}
        >
          <MDTypography variant="caption" color={darkMode ? "white" : "dark"}>
            <strong>ملاحظة:</strong>
            {status === "CONFIRMED" && " سيتم خصم المخزون عند تأكيد الطلب."}
            {status === "CANCELLED" && " سيتم إرجاع المخزون عند إلغاء الطلب."}
            {status === "DELIVERED" && " تم تسليم الطلب للعميل بنجاح."}
          </MDTypography>
        </MDBox>
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
          onClick={handleSubmit}
          disabled={!status || loading}
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
    </Dialog>
  );
}

UpdateStatusModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  order: PropTypes.shape({
    id: PropTypes.number,
    orderNumber: PropTypes.string,
  }),
  currentStatus: PropTypes.string,
};

UpdateStatusModal.defaultProps = {
  order: null,
  currentStatus: "",
};

export default UpdateStatusModal;
