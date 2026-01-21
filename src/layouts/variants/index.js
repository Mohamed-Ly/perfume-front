/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Context
import { useMaterialUIController, setDirection } from "context";

// API services
import variantApi from "./services/variantApi";
import productApi from "../products/services/productApi";

// Components
import CreateVariantModal from "./components/CreateVariantModal";
import EditVariantModal from "./components/EditVariantModal";
import DeleteVariantModal from "./components/DeleteVariantModal";
import AdjustStockModal from "./components/AdjustStockModal";

function ProductVariants() {
  const [controller, dispatch] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();

  // إضافة state لاختيار المنتج
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // باقي الـ states
  const [variants, setVariants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [adjustStockModalOpen, setAdjustStockModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  // Set RTL direction
  useEffect(() => {
    setDirection(dispatch, "rtl");
    return () => setDirection(dispatch, "ltr");
  }, [dispatch]);

  // جلب قائمة المنتجات
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await productApi.getAllProducts({
        limit: 1000,
        isActive: true,
      });

      // التصحيح هنا - البيانات تأتي في response.data.data.items
      const productsData = response.data?.data?.items || response.data?.items || [];
      setProducts(productsData);

      console.log("📦 المنتجات المحملة:", productsData); // للتdebug
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch variants with pagination
  const fetchVariants = async (
    page = pagination.page,
    limit = pagination.limit,
    search = searchTerm
  ) => {
    if (!selectedProduct) {
      setVariants([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const params = {
        page,
        limit,
        ...(search && { q: search }),
      };

      const response = await variantApi.getAllVariants(selectedProduct.id, params);

      // معالجة البيانات
      const responseData = response.data?.data || response.data;
      const variantsData = responseData?.items || [];
      const total = responseData?.total || 0;
      const pages = responseData?.pages || Math.ceil(total / limit);

      setVariants(variantsData);
      setPagination((prev) => ({
        ...prev,
        page,
        limit,
        total,
        pages,
      }));
    } catch (error) {
      console.error("❌ Error fetching variants:", error);
      setVariants([]);
    } finally {
      setLoading(false);
    }
  };

  // التحميل الأولي
  useEffect(() => {
    fetchProducts();
  }, []);

  // عندما يتغير المنتج المختار
  useEffect(() => {
    if (selectedProduct) {
      fetchVariants(1, pagination.limit, searchTerm);
    } else {
      setVariants([]);
      setLoading(false);
    }
  }, [selectedProduct]);

  // البحث مع debounce
  useEffect(() => {
    if (!selectedProduct) return;

    const timeoutId = setTimeout(() => {
      fetchVariants(1, pagination.limit, searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // تغيير الصفحة
  const handlePageChange = (event, value) => {
    console.log("📄 Changing to page:", value);
    fetchVariants(value, pagination.limit, searchTerm);
  };

  // إنشاء متغير
  const handleCreateVariant = async (variantData) => {
    try {
      await variantApi.createVariant(selectedProduct.id, variantData);
      await fetchVariants(pagination.page, pagination.limit, searchTerm);
      setCreateModalOpen(false);
    } catch (error) {
      throw error;
    }
  };

  // تعديل متغير
  const handleEditVariant = async (variantData) => {
    try {
      await variantApi.updateVariant(selectedProduct.id, selectedVariant.id, variantData);
      await fetchVariants(pagination.page, pagination.limit, searchTerm);
      setEditModalOpen(false);
      setSelectedVariant(null);
    } catch (error) {
      throw error;
    }
  };

  // حذف متغير
  const handleDeleteVariant = async () => {
    try {
      await variantApi.deleteVariant(selectedProduct.id, selectedVariant.id);
      await fetchVariants(pagination.page, pagination.limit, searchTerm);
      setDeleteModalOpen(false);
      setSelectedVariant(null);
    } catch (error) {
      throw error;
    }
  };

  // تعديل المخزون
  const handleAdjustStock = async (delta) => {
    try {
      await variantApi.adjustStock(selectedProduct.id, selectedVariant.id, { delta });
      await fetchVariants(pagination.page, pagination.limit, searchTerm);
      setAdjustStockModalOpen(false);
      setSelectedVariant(null);
    } catch (error) {
      throw error;
    }
  };

  // فتح نافذة التعديل
  const openEditModal = (variant) => {
    setSelectedVariant(variant);
    setEditModalOpen(true);
  };

  // فتح نافذة الحذف
  const openDeleteModal = (variant) => {
    setSelectedVariant(variant);
    setDeleteModalOpen(true);
  };

  // فتح نافذة تعديل المخزون
  const openAdjustStockModal = (variant) => {
    setSelectedVariant(variant);
    setAdjustStockModalOpen(true);
  };

  // مسح البحث
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // تنسيق السعر
  const formatPrice = (priceCents) => {
    return new Intl.NumberFormat("ar-LY", {
      style: "currency",
      currency: "LYD",
      minimumFractionDigits: 0, // لا تظهر أي أصفار عشرية
      maximumFractionDigits: 0, // لا تظهر أي أرقام عشرية
    }).format(priceCents / 100);
  };

  // العودة إلى قائمة المنتجات
  // const handleBackToProducts = () => {
  //   navigate("/products");
  // };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              {/* Breadcrumbs */}
              {/* <MDBox p={2}>
                <Breadcrumbs aria-label="breadcrumb">
                  <Link
                    color="inherit"
                    onClick={handleBackToProducts}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    المنتجات
                  </Link>
                  <MDTypography color="text.primary">متغيرات المنتج</MDTypography>
                </Breadcrumbs>
              </MDBox> */}

              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDBox>
                  <MDTypography
                    variant="h6"
                    color="white"
                    sx={{
                      fontWeight: "bold",
                      textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                    }}
                  >
                    {"إدارة متغيرات المنتج"}
                  </MDTypography>
                  {/* <MDTypography variant="caption" color="white" sx={{ opacity: 0.8 }}>
                    {selectedProduct
                      ? `${selectedProduct.brand?.name} - ${selectedProduct.category?.name}`
                      : "اختر منتجاً لعرض متغيراته"}
                  </MDTypography> */}
                </MDBox>
                <MDButton
                  variant="gradient"
                  color={darkMode ? "light" : "dark"}
                  onClick={() => setCreateModalOpen(true)}
                  disabled={!selectedProduct}
                  startIcon={<Icon>add</Icon>}
                  sx={{
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: "bold",
                    boxShadow: darkMode
                      ? "0 2px 6px rgba(255,255,255,0.1)"
                      : "0 2px 6px rgba(0,0,0,0.1)",
                    "&:hover": {
                      boxShadow: darkMode
                        ? "0 4px 12px rgba(255,255,255,0.15)"
                        : "0 4px 12px rgba(0,0,0,0.15)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.2s ease-in-out",
                    "&:disabled": {
                      opacity: 0.5,
                      cursor: "not-allowed",
                    },
                  }}
                >
                  إضافة متغير
                </MDButton>
              </MDBox>

              {/* منتج Selector */}
              <MDBox p={2} pb={1}>
                <FormControl fullWidth>
                  <InputLabel>اختر المنتج</InputLabel>
                  <Select
                    value={selectedProduct?.id || ""}
                    onChange={(e) => {
                      const product = products.find((p) => p.id === e.target.value);
                      setSelectedProduct(product);
                      setSearchTerm(""); // مسح البحث عند تغيير المنتج
                    }}
                    label="اختر المنتج"
                    disabled={productsLoading}
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
                      <em>-- اختر منتجًا --</em>
                    </MenuItem>
                    {products.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.name} - {product.brand?.name}
                        {!product.isActive && " (غير مفعل)"}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {productsLoading && (
                  <MDTypography variant="caption" color="text" sx={{ mt: 1, display: "block" }}>
                    جاري تحميل المنتجات...
                  </MDTypography>
                )}
              </MDBox>

              {/* Search Box - يظهر فقط عندما يكون هناك منتج مختار */}
              {selectedProduct && (
                <MDBox p={2} pb={1}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="ابحث عن متغير بالحجم، التركيز، السعر، أو SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon
                            sx={{
                              color: darkMode ? "text.main" : "text.secondary",
                            }}
                          >
                            search
                          </Icon>
                        </InputAdornment>
                      ),
                      endAdornment: searchTerm && (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleClearSearch}
                            sx={{
                              color: darkMode ? "text.main" : "text.secondary",
                              "&:hover": {
                                color: darkMode ? "error.light" : "error.main",
                              },
                            }}
                          >
                            <Icon>close</Icon>
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        backgroundColor: darkMode ? "background.card" : "white",
                        "& fieldset": {
                          borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
                        },
                        "&:hover fieldset": {
                          borderColor: darkMode ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: darkMode ? "primary.main" : "primary.main",
                          borderWidth: "2px",
                        },
                      },
                      "& .MuiInputBase-input": {
                        color: darkMode ? "text.main" : "text.primary",
                        "&::placeholder": {
                          color: darkMode ? "text.secondary" : "text.disabled",
                          opacity: 1,
                        },
                      },
                    }}
                  />
                </MDBox>
              )}

              {/* جدول المتغيرات */}
              <MDBox pt={1} pb={2}>
                {!selectedProduct ? (
                  <MDBox p={3} textAlign="center">
                    <Icon
                      sx={{
                        fontSize: 64,
                        color: "text.secondary",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    >
                      inventory_2
                    </Icon>
                    <MDTypography variant="h6" color="text" gutterBottom>
                      اختر منتجاً لعرض متغيراته
                    </MDTypography>
                    <MDTypography variant="body2" color="text">
                      اختر منتجاً من القائمة أعلاه لبدء إدارة المتغيرات
                    </MDTypography>
                  </MDBox>
                ) : loading ? (
                  <MDBox p={3} textAlign="center">
                    <MDTypography variant="h6" color="text">
                      جاري تحميل المتغيرات...
                    </MDTypography>
                  </MDBox>
                ) : variants.length === 0 ? (
                  <MDBox p={3} textAlign="center">
                    <Icon
                      sx={{
                        fontSize: 48,
                        color: "text.secondary",
                        mb: 2,
                        opacity: 0.5,
                      }}
                    >
                      format_list_bulleted
                    </Icon>
                    <MDTypography variant="h6" color="text" gutterBottom>
                      لا توجد متغيرات لهذا المنتج
                    </MDTypography>
                    <MDTypography variant="body2" color="text.secondary">
                      يمكنك إضافة متغيرات جديدة باستخدام زر إضافة متغير
                    </MDTypography>
                  </MDBox>
                ) : (
                  <>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow
                            sx={{
                              backgroundColor: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.02)",
                              borderBottom: "2px solid",
                              borderBottomColor: darkMode
                                ? "rgba(255,255,255,0.1)"
                                : "rgba(0,0,0,0.1)",
                            }}
                          >
                            <TableCell
                              sx={{
                                width: "5%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              #
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "15%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              الحجم
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "15%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              التركيز
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "15%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              السعر
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "10%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              المخزون
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "15%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              SKU/كود المنتج
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "10%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              الحالة
                            </TableCell>
                            <TableCell
                              sx={{
                                width: "15%",
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "0.875rem",
                                color: darkMode ? "text.main" : "text.primary",
                                py: 2,
                              }}
                            >
                              الإجراءات
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variants.map((variant, index) => (
                            <TableRow
                              key={variant.id}
                              sx={{
                                backgroundColor:
                                  index % 2 === 0
                                    ? darkMode
                                      ? "rgba(255,255,255,0.02)"
                                      : "rgba(0,0,0,0.01)"
                                    : "transparent",
                                "&:hover": {
                                  backgroundColor: darkMode
                                    ? "rgba(255,255,255,0.05)"
                                    : "rgba(0,0,0,0.03)",
                                },
                              }}
                            >
                              <TableCell style={{ textAlign: "center" }}>
                                <MDTypography variant="button" fontWeight="medium">
                                  {variant.id}
                                </MDTypography>
                              </TableCell>

                              {/* الحجم */}
                              <TableCell style={{ textAlign: "center" }}>
                                {variant.sizeMl ? (
                                  <Chip
                                    label={`${variant.sizeMl} مل`}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      borderRadius: "12px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                ) : (
                                  <MDTypography variant="caption" color="text">
                                    -
                                  </MDTypography>
                                )}
                              </TableCell>

                              {/* التركيز */}
                              <TableCell style={{ textAlign: "center" }}>
                                {variant.concentration ? (
                                  <Chip
                                    label={variant.concentration}
                                    color="secondary"
                                    variant="outlined"
                                    size="small"
                                    sx={{
                                      borderRadius: "12px",
                                      fontWeight: "bold",
                                    }}
                                  />
                                ) : (
                                  <MDTypography variant="caption" color="text">
                                    -
                                  </MDTypography>
                                )}
                              </TableCell>

                              {/* السعر */}
                              <TableCell style={{ textAlign: "center" }}>
                                <MDTypography variant="button" fontWeight="bold" color="success">
                                  {formatPrice(variant.priceCents)}
                                </MDTypography>
                              </TableCell>

                              {/* المخزون */}
                              <TableCell style={{ textAlign: "center" }}>
                                <MDBox
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  gap={1}
                                >
                                  <Chip
                                    label={variant.stockQty}
                                    color={variant.stockQty > 0 ? "success" : "error"}
                                    variant="filled"
                                    size="small"
                                    sx={{
                                      borderRadius: "12px",
                                      fontWeight: "bold",
                                      minWidth: "50px",
                                    }}
                                  />
                                  <IconButton
                                    size="small"
                                    color="info"
                                    onClick={() => openAdjustStockModal(variant)}
                                    sx={{
                                      backgroundColor: darkMode
                                        ? "rgba(33,150,243,0.1)"
                                        : "rgba(33,150,243,0.05)",
                                      "&:hover": {
                                        backgroundColor: darkMode
                                          ? "rgba(33,150,243,0.2)"
                                          : "rgba(33,150,243,0.1)",
                                      },
                                    }}
                                  >
                                    <Icon fontSize="small">inventory_2</Icon>
                                  </IconButton>
                                </MDBox>
                              </TableCell>

                              {/* SKU/باركود */}
                              <TableCell style={{ textAlign: "center" }}>
                                <MDBox>
                                  {variant.sku && (
                                    <MDTypography
                                      variant="caption"
                                      display="block"
                                      fontWeight="medium"
                                    >
                                      SKU: {variant.sku}
                                    </MDTypography>
                                  )}
                                  {variant.barcode && (
                                    <MDTypography variant="caption" display="block" color="text">
                                      باركود: {variant.barcode}
                                    </MDTypography>
                                  )}
                                  {!variant.sku && !variant.barcode && (
                                    <MDTypography variant="caption" color="text">
                                      -
                                    </MDTypography>
                                  )}
                                </MDBox>
                              </TableCell>

                              {/* الحالة */}
                              <TableCell style={{ textAlign: "center" }}>
                                <MDBox
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: "6px",
                                    backgroundColor: variant.isActive
                                      ? darkMode
                                        ? "rgba(76, 175, 80, 0.15)"
                                        : "rgba(76, 175, 80, 0.1)"
                                      : darkMode
                                      ? "rgba(244, 67, 54, 0.15)"
                                      : "rgba(244, 67, 54, 0.1)",
                                    border: "1px solid",
                                    borderColor: variant.isActive
                                      ? darkMode
                                        ? "rgba(76, 175, 80, 0.3)"
                                        : "rgba(76, 175, 80, 0.2)"
                                      : darkMode
                                      ? "rgba(244, 67, 54, 0.3)"
                                      : "rgba(244, 67, 54, 0.2)",
                                  }}
                                >
                                  <Icon
                                    sx={{
                                      fontSize: "1rem",
                                      mr: 0.5,
                                      color: variant.isActive ? "success.main" : "error.main",
                                    }}
                                  >
                                    {variant.isActive ? "check_circle" : "cancel"}
                                  </Icon>
                                  <MDTypography
                                    variant="caption"
                                    fontWeight="bold"
                                    color={variant.isActive ? "success" : "error"}
                                  >
                                    {variant.isActive ? "مفعل" : "غير مفعل"}
                                  </MDTypography>
                                </MDBox>
                              </TableCell>

                              {/* الإجراءات */}
                              <TableCell style={{ textAlign: "center" }}>
                                <MDBox display="flex" gap={1} justifyContent="center">
                                  <IconButton
                                    color="info"
                                    size="small"
                                    onClick={() => openEditModal(variant)}
                                    sx={{
                                      backgroundColor: darkMode
                                        ? "rgba(33,150,243,0.1)"
                                        : "rgba(33,150,243,0.05)",
                                      "&:hover": {
                                        backgroundColor: darkMode
                                          ? "rgba(33,150,243,0.2)"
                                          : "rgba(33,150,243,0.1)",
                                      },
                                    }}
                                  >
                                    <Icon fontSize="small">edit</Icon>
                                  </IconButton>

                                  <IconButton
                                    color="error"
                                    size="small"
                                    onClick={() => openDeleteModal(variant)}
                                    sx={{
                                      backgroundColor: darkMode
                                        ? "rgba(244,67,54,0.1)"
                                        : "rgba(244,67,54,0.05)",
                                      "&:hover": {
                                        backgroundColor: darkMode
                                          ? "rgba(244,67,54,0.2)"
                                          : "rgba(244,67,54,0.1)",
                                      },
                                    }}
                                  >
                                    <Icon fontSize="small">delete</Icon>
                                  </IconButton>
                                </MDBox>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    {/* Pagination خارجي */}
                    <MDBox
                      p={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        borderTop: "1px solid",
                        borderTopColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      }}
                    >
                      <MDBox display="flex" alignItems="center" gap={2}>
                        <MDTypography
                          variant="button"
                          color={darkMode ? "white" : "dark"}
                          fontWeight="medium"
                        >
                          إظهار {variants.length} من أصل {pagination.total} متغير
                        </MDTypography>
                      </MDBox>

                      <Stack spacing={2}>
                        <Pagination
                          count={pagination.pages}
                          page={pagination.page}
                          onChange={handlePageChange}
                          color="primary"
                          size="medium"
                          sx={{
                            "& .MuiPaginationItem-root": {
                              color: darkMode ? "text.main" : "text.primary",
                              borderColor: darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
                              "&:hover": {
                                backgroundColor: darkMode
                                  ? "rgba(255,255,255,0.1)"
                                  : "rgba(0,0,0,0.1)",
                              },
                            },
                            "& .MuiPaginationItem-root.Mui-selected": {
                              backgroundColor: darkMode ? "primary.main" : "primary.main",
                              color: "white",
                              "&:hover": {
                                backgroundColor: darkMode ? "primary.dark" : "primary.dark",
                              },
                            },
                          }}
                        />
                      </Stack>
                    </MDBox>
                  </>
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />

      {/* Modals */}
      <CreateVariantModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateVariant}
        product={selectedProduct}
        disabled={!selectedProduct}
      />

      <EditVariantModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedVariant(null);
        }}
        onSubmit={handleEditVariant}
        variant={selectedVariant}
      />

      <DeleteVariantModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedVariant(null);
        }}
        onConfirm={handleDeleteVariant}
        variant={selectedVariant}
      />

      <AdjustStockModal
        open={adjustStockModalOpen}
        onClose={() => {
          setAdjustStockModalOpen(false);
          setSelectedVariant(null);
        }}
        onConfirm={handleAdjustStock}
        variant={selectedVariant}
      />
    </DashboardLayout>
  );
}

export default ProductVariants;
