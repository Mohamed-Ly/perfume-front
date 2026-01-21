import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function DeleteOrderModal({ open, onClose, onConfirm, order }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <MDTypography variant="h5" fontWeight="medium" color="error">
          تأكيد حذف الطلب
        </MDTypography>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon sx={{ fontSize: "3rem", color: "error.main", mr: 2 }}>warning</Icon>
          <Box>
            <MDTypography variant="body1" color={darkMode ? "white" : "dark"} fontWeight="medium">
              هل أنت متأكد من حذف الطلب؟
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"} mt={1}>
              رقم الطلب: <strong>{order.orderNumber}</strong>
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
              العميل: <strong>{order.shippingName}</strong>
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
              الإجمالي: <strong>{order.totalCents / 100} د.ل</strong>
            </MDTypography>
          </Box>
        </Box>

        <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
          لا يمكن التراجع عن هذا الإجراء. سيتم حذف الطلب بشكل دائم.
        </MDTypography>

        <MDBox
          mt={2}
          p={2}
          sx={{
            backgroundColor: darkMode ? "rgba(244,67,54,0.1)" : "rgba(244,67,54,0.05)",
            borderRadius: 1,
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          <MDTypography variant="caption" color="error" fontWeight="bold">
            ⚠️ تحذير: هذا الإجراء لا يمكن التراجع عنه. تأكد من أن الطلب ملغى قبل الحذف.
          </MDTypography>
        </MDBox>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
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
          color="error"
          onClick={handleConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <Icon sx={{ animation: "spin 1s linear infinite" }}>refresh</Icon>
            ) : (
              <Icon>delete</Icon>
            )
          }
          sx={{
            "& .MuiSvgIcon-root": {
              animation: loading ? "spin 1s linear infinite" : "none",
            },
          }}
        >
          {loading ? "جاري الحذف..." : "حذف"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

DeleteOrderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  order: PropTypes.shape({
    id: PropTypes.number,
    orderNumber: PropTypes.string,
    shippingName: PropTypes.string,
    totalCents: PropTypes.number,
  }),
};

DeleteOrderModal.defaultProps = {
  order: null,
};

export default DeleteOrderModal;
