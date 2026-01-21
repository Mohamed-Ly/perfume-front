// layouts/dashboard/components/Projects.js
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import productApi from "../../../products/services/productApi";
import categoryApi from "../../../categories/services/categoryApi";
import brandApi from "../../../brands/services/brandApi";

function Projects() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(null);
  const [view, setView] = useState("products"); // 'products', 'categories', 'brands'

  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [productsRes, categoriesRes, brandsRes] = await Promise.all([
        productApi.getAllProducts({ page: 1, limit: 5, sort: "-createdAt" }),
        categoryApi.getAllCategories({ page: 1, limit: 5 }),
        brandApi.getAllBrands({ page: 1, limit: 5 }),
      ]);

      // التصحيح: استخدام items بدلاً من products/categories/brands
      setProducts(productsRes.data?.data?.items || []);
      setCategories(categoriesRes.data?.data?.items || []);
      setBrands(brandsRes.data?.data?.items || []);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setProducts([]);
      setCategories([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // تعريف الأعمدة بشكل ثابت
  const productColumns = [
    { Header: "المنتج", accessor: "product", width: "40%", align: "left" },
    { Header: "السعر", accessor: "price", width: "20%", align: "center" },
    { Header: "الحالة", accessor: "status", width: "20%", align: "center" },
    { Header: "تاريخ الإضافة", accessor: "createdAt", width: "20%", align: "center" },
  ];

  const categoryColumns = [
    { Header: "التصنيف", accessor: "category", width: "50%", align: "left" },
    { Header: "الحالة", accessor: "status", width: "20%", align: "center" },
    { Header: "تاريخ الإضافة", accessor: "createdAt", width: "30%", align: "center" },
  ];

  const brandColumns = [
    { Header: "الماركة", accessor: "brand", width: "50%", align: "left" },
    { Header: "الحالة", accessor: "status", width: "20%", align: "center" },
    { Header: "تاريخ الإضافة", accessor: "createdAt", width: "30%", align: "center" },
  ];

  const getColumns = () => {
    switch (view) {
      case "products":
        return productColumns;
      case "categories":
        return categoryColumns;
      case "brands":
        return brandColumns;
      default:
        return productColumns;
    }
  };

  const getRows = () => {
    switch (view) {
      case "products":
        return products.map((product) => ({
          product: (
            <MDTypography variant="button" fontWeight="medium">
              {product.name}
            </MDTypography>
          ),
          price: (
            <MDTypography variant="caption" color="text" fontWeight="medium">
              {new Intl.NumberFormat("ar-LY", {
                style: "currency",
                currency: "LYD",
                minimumFractionDigits: 0,
              }).format((product.priceCents || 0) / 100)}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" color={product.isActive ? "success" : "error"}>
              {product.isActive ? "نشط" : "غير نشط"}
            </MDTypography>
          ),
          createdAt: (
            <MDTypography variant="caption">
              {new Date(product.createdAt).toLocaleDateString("ar-LY")}
            </MDTypography>
          ),
        }));

      case "categories":
        return categories.map((category) => ({
          category: (
            <MDTypography variant="button" fontWeight="medium">
              {category.name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" color={category.isActive ? "success" : "error"}>
              {category.isActive ? "نشط" : "غير نشط"}
            </MDTypography>
          ),
          createdAt: (
            <MDTypography variant="caption">
              {new Date(category.createdAt).toLocaleDateString("ar-LY")}
            </MDTypography>
          ),
        }));

      case "brands":
        return brands.map((brand) => ({
          brand: (
            <MDTypography variant="button" fontWeight="medium">
              {brand.name}
            </MDTypography>
          ),
          status: (
            <MDTypography variant="caption" color={brand.isActive ? "success" : "error"}>
              {brand.isActive ? "نشط" : "غير نشط"}
            </MDTypography>
          ),
          createdAt: (
            <MDTypography variant="caption">
              {new Date(brand.createdAt).toLocaleDateString("ar-LY")}
            </MDTypography>
          ),
        }));

      default:
        return [];
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
    closeMenu();
  };

  const getTitle = () => {
    const titles = {
      products: "أحدث المنتجات",
      categories: "أحدث التصنيفات",
      brands: "أحدث الماركات",
    };
    return titles[view] || "المحتوى";
  };

  const getCount = () => {
    const counts = {
      products: products.length,
      categories: categories.length,
      brands: brands.length,
    };
    return counts[view] || 0;
  };

  const renderMenu = (
    <Menu
      id="view-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={() => handleViewChange("products")}>المنتجات</MenuItem>
      <MenuItem onClick={() => handleViewChange("categories")}>التصنيفات</MenuItem>
      <MenuItem onClick={() => handleViewChange("brands")}>الماركات</MenuItem>
    </Menu>
  );

  return (
    <Card>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <MDBox>
          <MDTypography variant="h6" gutterBottom>
            {getTitle()}
          </MDTypography>
          <MDBox display="flex" alignItems="center" lineHeight={0}>
            <Icon
              sx={{
                fontWeight: "bold",
                color: ({ palette: { info } }) => info.main,
                mt: -0.5,
              }}
            >
              inventory_2
            </Icon>
            <MDTypography variant="button" fontWeight="regular" color="text">
              &nbsp;<strong>{getCount()} عنصر</strong> معروض
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox color="text" px={2}>
          <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
            more_vert
          </Icon>
        </MDBox>
        {renderMenu}
      </MDBox>

      <MDBox>
        {loading ? (
          <MDBox p={3} textAlign="center">
            <MDTypography variant="body2" color="text">
              جاري تحميل البيانات...
            </MDTypography>
          </MDBox>
        ) : (
          <DataTable
            table={{
              columns: getColumns(),
              rows: getRows(),
            }}
            showTotalEntries={false}
            isSorted={false}
            noEndBorder
            entriesPerPage={false}
          />
        )}
      </MDBox>
    </Card>
  );
}

export default Projects;
