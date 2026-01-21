import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button } from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function DeleteUserModal({ open, onClose, onConfirm, user }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-LY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
          تأكيد حذف المستخدم
        </MDTypography>
      </DialogTitle>

      <DialogContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Icon sx={{ fontSize: "3rem", color: "error.main", mr: 2 }}>warning</Icon>
          <Box>
            <MDTypography variant="body1" color={darkMode ? "white" : "dark"} fontWeight="medium">
              هل أنت متأكد من حذف المستخدم؟
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"} mt={1}>
              الاسم: <strong>{user.name}</strong>
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
              البريد: <strong>{user.email}</strong>
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
              رقم الهاتف: <strong>{user.phone}</strong>
            </MDTypography>
            <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
              تاريخ التسجيل: <strong>{formatDate(user.createdAt)}</strong>
            </MDTypography>
          </Box>
        </Box>

        <MDTypography variant="body2" color={darkMode ? "text.main" : "text.secondary"}>
          لا يمكن التراجع عن هذا الإجراء. سيتم حذف المستخدم وجميع بياناته المرتبطة بشكل دائم.
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
            ⚠️ تحذير: هذا الإجراء سيمسح جميع بيانات المستخدم بما في ذلك:
            <br />• الطلبات والسلة والمفضلة
            <br />• التوكنات والإشعارات
            <br />• جميع السجلات المرتبطة به
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
          {loading ? "جاري الحذف..." : "حذف المستخدم"}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}

DeleteUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};

DeleteUserModal.defaultProps = {
  user: null,
};

export default DeleteUserModal;
