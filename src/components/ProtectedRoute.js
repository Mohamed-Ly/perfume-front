import React, { useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  // استخدام useMemo لمنع إعادة التوجيه غير الضرورية
  const redirectPath = useMemo(() => {
    if (!isLoading && !isAuthenticated) {
      return "/authentication/sign-in";
    }
    return null;
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        flexDirection="column"
      >
        <MDTypography variant="h4" color="text">
          جاري التحميل...
        </MDTypography>
      </MDBox>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
