import { useState, useEffect } from "react";
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
  Box,
  Typography,
  Chip,
} from "@mui/material";
import Icon from "@mui/material/Icon";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useMaterialUIController } from "context";

function EditOfferModal({ open, onClose, onSubmit, offer }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offerType: "",
    target: "ALL_PRODUCTS",
    discountPercentage: "",
    discountAmount: "",
    minPurchaseAmount: "",
    maxDiscountAmount: "",
    startDate: "",
    endDate: "",
    displayOrder: 0,
    image: null,
    productIds: [],
    categoryIds: [],
    brandIds: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function toDateTimeLocalValue(dateInput) {
    if (!dateInput) return "";
    const d = new Date(dateInput);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mi = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  }

  function fromDateTimeLocalValue(localValue) {
    // localValue مثل "2025-10-17T17:00"
    // إن أردت تخزين UTC في الداتابيز، حوله إلى ISO
    return localValue ? new Date(localValue).toISOString() : null;
  }

  // أنواع العروض
  const offerTypes = [
    { value: "DISCOUNT_PERCENTAGE", label: "خصم نسبي" },
    { value: "DISCOUNT_AMOUNT", label: "خصم مبلغ" },
    { value: "BUY_ONE_GET_ONE", label: "اشتري واحد واحصل على الآخر" },
    { value: "FREE_SHIPPING", label: "شحن مجاني" },
    { value: "SPECIAL_OFFER", label: "عرض خاص" },
  ];

  // أهداف العروض
  const offerTargets = [
    { value: "ALL_PRODUCTS", label: "جميع المنتجات" },
    { value: "SPECIFIC_PRODUCTS", label: "منتجات محددة" },
    { value: "SPECIFIC_CATEGORIES", label: "تصنيفات محددة" },
    { value: "SPECIFIC_BRANDS", label: "ماركات محددة" },
  ];

  useEffect(() => {
    if (offer) {
      // تحويل التواريخ للتنسيق المناسب
      const startDate = toDateTimeLocalValue(offer.startDate);
      const endDate = toDateTimeLocalValue(offer.endDate);

      setFormData({
        title: offer.title || "",
        description: offer.description || "",
        offerType: offer.offerType || "",
        target: offer.target || "ALL_PRODUCTS",
        discountPercentage: offer.discountPercentage || "",
        discountAmount: offer.discountAmount || "",
        minPurchaseAmount: offer.minPurchaseAmount || "",
        maxDiscountAmount: offer.maxDiscountAmount || "",
        startDate: startDate,
        endDate: endDate,
        displayOrder: offer.displayOrder || 0,
        image: null,
        productIds: offer.offerProducts?.map((op) => op.productId) || [],
        categoryIds: offer.offerCategories?.map((oc) => oc.categoryId) || [],
        brandIds: offer.offerBrands?.map((ob) => ob.brandId) || [],
      });

      if (offer.image) {
        setImagePreview(offer.image);
      }
    }
  }, [offer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من حجم الملف (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "حجم الصورة يجب ألا يتجاوز 5MB" }));
        return;
      }

      // التحقق من نوع الملف
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({ ...prev, image: "نوع الملف غير مدعوم. استخدم JPG, PNG, أو WebP" }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));

      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // التحقق من الحقول الإلزامية
    if (!formData.title.trim()) {
      newErrors.title = "عنوان العرض مطلوب";
    } else if (formData.title.trim().length < 2 || formData.title.trim().length > 100) {
      newErrors.title = "العنوان يجب أن يكون بين 2 و 100 حرف";
    }

    if (!formData.offerType) {
      newErrors.offerType = "نوع العرض مطلوب";
    }

    if (!formData.startDate) {
      newErrors.startDate = "تاريخ البداية مطلوب";
    }

    if (!formData.endDate) {
      newErrors.endDate = "تاريخ النهاية مطلوب";
    }

    // التحقق من التواريخ
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (startDate >= endDate) {
        newErrors.endDate = "تاريخ النهاية يجب أن يكون بعد تاريخ البداية";
      }
    }

    // التحقق من نوع الخصم
    if (formData.offerType === "DISCOUNT_PERCENTAGE" && !formData.discountPercentage) {
      newErrors.discountPercentage = "نسبة الخصم مطلوبة";
    } else if (formData.offerType === "DISCOUNT_AMOUNT" && !formData.discountAmount) {
      newErrors.discountAmount = "مبلغ الخصم مطلوب";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // في handleSubmit في EditOfferModal.js - استبدل جزء التحويل بهذا:

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🔄 Edit form submission started");

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    setLoading(true);
    try {
      const submitData = { ...formData };

      console.log("📝 Original form data:", formData);

      // تنظيف البيانات بناءً على نوع العرض
      if (
        formData.offerType === "FREE_SHIPPING" ||
        formData.offerType === "BUY_ONE_GET_ONE" ||
        formData.offerType === "SPECIAL_OFFER"
      ) {
        console.log("🧹 Cleaning discount fields for offer type:", formData.offerType);
        delete submitData.discountPercentage;
        delete submitData.discountAmount;
        delete submitData.minPurchaseAmount;
        delete submitData.maxDiscountAmount;
      } else if (formData.offerType === "DISCOUNT_PERCENTAGE") {
        console.log("🧹 Cleaning discountAmount field");
        delete submitData.discountAmount;
      } else if (formData.offerType === "DISCOUNT_AMOUNT") {
        console.log("🧹 Cleaning discountPercentage field");
        delete submitData.discountPercentage;
      }

      // ⚠️ إزالة التحويل إلى numbers - سيتكفل الـ API بذلك
      // فقط تأكد من أن القيم ليست فارغة
      const numericFields = [
        "discountPercentage",
        "discountAmount",
        "minPurchaseAmount",
        "maxDiscountAmount",
        "displayOrder",
      ];
      numericFields.forEach((field) => {
        if (submitData[field] === "" || submitData[field] === null) {
          delete submitData[field];
        }
      });

      // إزالة الحقول الفارغة
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] === "" || submitData[key] === null || submitData[key] === undefined) {
          console.log(`🗑️ Removing empty field: ${key}`);
          delete submitData[key];
        }
      });

      if (submitData.startDate) {
        submitData.startDate = fromDateTimeLocalValue(submitData.startDate);
      }
      if (submitData.endDate) {
        submitData.endDate = fromDateTimeLocalValue(submitData.endDate);
      }

      console.log("📤 Final data to send to backend:", submitData);

      await onSubmit(submitData);
      console.log("✅ onSubmit completed successfully");
    } catch (error) {
      console.error("❌ Error in handleSubmit:", error);
      // ... باقي كود معالجة الأخطاء
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      offerType: "",
      target: "ALL_PRODUCTS",
      discountPercentage: "",
      discountAmount: "",
      minPurchaseAmount: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      displayOrder: 0,
      image: null,
      productIds: [],
      categoryIds: [],
      brandIds: [],
    });
    setErrors({});
    setImagePreview(null);
    onClose();
  };

  const getDiscountText = () => {
    switch (offer?.offerType) {
      case "DISCOUNT_PERCENTAGE":
        return `${offer.discountPercentage}%`;
      case "DISCOUNT_AMOUNT":
        return `${(offer.discountAmount / 100).toFixed(2)} د.ل`;
      case "BUY_ONE_GET_ONE":
        return "2x1";
      case "FREE_SHIPPING":
        return "شحن مجاني";
      default:
        return "عرض خاص";
    }
  };

  const getTargetText = () => {
    const targets = {
      ALL_PRODUCTS: "جميع المنتجات",
      SPECIFIC_PRODUCTS: "منتجات محددة",
      SPECIFIC_CATEGORIES: "تصنيفات محددة",
      SPECIFIC_BRANDS: "ماركات محددة",
    };
    return targets[offer?.target] || offer?.target;
  };

  if (!offer) return null;

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
          تعديل العرض
        </MDTypography>
        <MDTypography variant="body2" color="text">
          {offer.title}
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
          {/* معلومات سريعة عن العرض */}
          <MDBox
            p={2}
            mb={3}
            sx={{
              backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
              borderRadius: "8px",
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  نوع العرض الحالي:
                </MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {getDiscountText()}
                </MDTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  الهدف الحالي:
                </MDTypography>
                <MDTypography variant="body2" fontWeight="medium">
                  {getTargetText()}
                </MDTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  عدد المنتجات:
                </MDTypography>
                <MDTypography variant="body2">{offer.offerProducts?.length || 0}</MDTypography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  عدد النقرات:
                </MDTypography>
                <MDTypography variant="body2">{offer.clickCount || 0}</MDTypography>
              </Grid>
            </Grid>
          </MDBox>

          <Grid container spacing={3}>
            {/* المعلومات الأساسية */}
            <Grid item xs={12}>
              <MDTypography variant="h6" gutterBottom>
                المعلومات الأساسية
              </MDTypography>
            </Grid>

            {/* العنوان */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="عنوان العرض *"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                disabled={loading}
              />
            </Grid>

            {/* الوصف */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="وصف العرض"
                name="description"
                multiline
                rows={2}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={loading}
              />
            </Grid>

            {/* نوع العرض */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.offerType} disabled={loading}>
                <InputLabel>نوع العرض *</InputLabel>
                <Select
                  name="offerType"
                  value={formData.offerType}
                  onChange={handleChange}
                  label="نوع العرض *"
                >
                  {offerTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.offerType && (
                  <Typography variant="caption" color="error">
                    {errors.offerType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* هدف العرض */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth disabled={loading}>
                <InputLabel>هدف العرض</InputLabel>
                <Select
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  label="هدف العرض"
                >
                  {offerTargets.map((target) => (
                    <MenuItem key={target.value} value={target.value}>
                      {target.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* تفاصيل الخصم */}
            <Grid item xs={12}>
              <MDTypography variant="h6" gutterBottom>
                تفاصيل الخصم
              </MDTypography>
            </Grid>

            {/* نسبة الخصم */}
            {formData.offerType === "DISCOUNT_PERCENTAGE" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="نسبة الخصم % *"
                  name="discountPercentage"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  error={!!errors.discountPercentage}
                  helperText={errors.discountPercentage}
                  disabled={loading}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
            )}

            {/* مبلغ الخصم */}
            {formData.offerType === "DISCOUNT_AMOUNT" && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="مبلغ الخصم (د.ل) *"
                  name="discountAmount"
                  type="number"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  error={!!errors.discountAmount}
                  helperText={errors.discountAmount}
                  disabled={loading}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            )}

            {/* الحد الأدنى للشراء */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الحد الأدنى للشراء (د.ل)"
                name="minPurchaseAmount"
                type="number"
                value={formData.minPurchaseAmount}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* الحد الأقصى للخصم */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="الحد الأقصى للخصم (د.ل)"
                name="maxDiscountAmount"
                type="number"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: 0 }}
              />
            </Grid>

            {/* التواريخ */}
            <Grid item xs={12}>
              <MDTypography variant="h6" gutterBottom>
                فترة العرض
              </MDTypography>
            </Grid>

            {/* تاريخ البداية */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="تاريخ البداية *"
                name="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={handleChange}
                error={!!errors.startDate}
                helperText={errors.startDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* تاريخ النهاية */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="تاريخ النهاية *"
                name="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={handleChange}
                error={!!errors.endDate}
                helperText={errors.endDate}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* الصورة */}
            <Grid item xs={12}>
              <MDTypography variant="h6" gutterBottom>
                صورة العرض
              </MDTypography>
              <MDTypography variant="caption" color="text" display="block" sx={{ mb: 2 }}>
                اترك الحقل فارغاً للحفاظ على الصورة الحالية
              </MDTypography>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  border: `2px dashed ${
                    errors.image ? "red" : darkMode ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                  }`,
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)",
                }}
                onClick={() => document.getElementById("edit-offer-image-input").click()}
              >
                <input
                  id="edit-offer-image-input"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  disabled={loading}
                />

                {imagePreview ? (
                  <Box>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                    />
                    <MDTypography variant="body2" color="text" sx={{ mt: 1 }}>
                      انقر لتغيير الصورة
                    </MDTypography>
                  </Box>
                ) : offer.image ? (
                  <Box>
                    <img
                      src={offer.image}
                      alt="Current"
                      style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                    />
                    <MDTypography variant="body2" color="text" sx={{ mt: 1 }}>
                      الصورة الحالية - انقر لتغييرها
                    </MDTypography>
                  </Box>
                ) : (
                  <Box>
                    <Icon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }}>cloud_upload</Icon>
                    <MDTypography variant="body2" color="text">
                      انقر لرفع صورة جديدة
                    </MDTypography>
                    <MDTypography variant="caption" color="text" sx={{ opacity: 0.7 }}>
                      JPG, PNG, WebP - الحد الأقصى 5MB
                    </MDTypography>
                  </Box>
                )}
              </Box>
              {errors.image && (
                <MDTypography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                  {errors.image}
                </MDTypography>
              )}
            </Grid>

            {/* ترتيب العرض */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="ترتيب العرض"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                disabled={loading}
                inputProps={{ min: 0 }}
                helperText="رقم أقل يعني ظهوراً أولاً"
              />
            </Grid>
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
                <Icon>check</Icon>
              )
            }
          >
            {loading ? "جاري التحديث..." : "حفظ التغييرات"}
          </MDButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

EditOfferModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  offer: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    offerType: PropTypes.string,
    target: PropTypes.string,
    discountPercentage: PropTypes.number,
    discountAmount: PropTypes.number,
    minPurchaseAmount: PropTypes.number,
    maxDiscountAmount: PropTypes.number,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    displayOrder: PropTypes.number,
    image: PropTypes.string,
    clickCount: PropTypes.number,
    offerProducts: PropTypes.array,
    offerCategories: PropTypes.array,
    offerBrands: PropTypes.array,
  }),
};

EditOfferModal.defaultProps = {
  offer: null,
};

export default EditOfferModal;
