// components/CustomOrdersChart.js
import React from "react";
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// استيراد المتحكم
import { useMaterialUIController } from "context";

// تسجيل مكونات Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function CustomOrdersChart({ data, loading, title = "الطلبات اليومية" }) {
  // استخدام المتحكم للحصول على حالة Dark Mode
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // بيانات افتراضية أثناء التحميل
  const defaultData = {
    labels: ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
    datasets: [
      {
        label: "عدد الطلبات",
        data: [0, 0, 0, 0, 0, 0, 0],
        borderColor: "rgba(76, 175, 80, 1)",
        backgroundColor: darkMode ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartData = loading
    ? defaultData
    : {
        labels: data?.labels || [],
        datasets: [
          {
            label: "عدد الطلبات",
            data: data?.data || [],
            borderColor: "rgba(76, 175, 80, 1)",
            backgroundColor: darkMode ? "rgba(76, 175, 80, 0.2)" : "rgba(76, 175, 80, 0.1)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "rgba(76, 175, 80, 1)",
            pointBorderColor: darkMode ? "#1a1a1a" : "#fff",
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointHoverBackgroundColor: "rgba(76, 175, 80, 1)",
            pointHoverBorderColor: darkMode ? "#fff" : "#1a1a1a",
            pointHoverBorderWidth: 2,
          },
        ],
      };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        rtl: true,
        labels: {
          color: darkMode ? "#fff" : "#333",
          font: {
            size: 12,
            family: "'Cairo', 'Arial', sans-serif",
          },
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        rtl: true,
        backgroundColor: darkMode ? "rgba(33, 33, 33, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: darkMode ? "#fff" : "#333",
        bodyColor: darkMode ? "#fff" : "#333",
        borderColor: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 6,
        callbacks: {
          label: function (context) {
            return `الطلبات: ${context.parsed.y}`;
          },
          labelColor: function (context) {
            return {
              borderColor: "rgba(76, 175, 80, 1)",
              backgroundColor: "rgba(76, 175, 80, 1)",
              borderWidth: 2,
              borderRadius: 2,
            };
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
            family: "'Cairo', 'Arial', sans-serif",
            weight: darkMode ? "400" : "500",
          },
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        border: {
          color: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: darkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
            family: "'Cairo', 'Arial', sans-serif",
            weight: darkMode ? "400" : "500",
          },
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          drawBorder: false,
        },
        border: {
          color: darkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    elements: {
      line: {
        borderWidth: 3,
      },
      point: {
        hoverBackgroundColor: "rgba(76, 175, 80, 1)",
        hoverBorderColor: darkMode ? "#fff" : "#1a1a1a",
      },
    },
  };

  return (
    <Card
      sx={{
        backgroundColor: darkMode ? "background.default" : "background.paper",
        boxShadow: darkMode ? "0 4px 20px 0 rgba(0, 0, 0, 0.3)" : "0 4px 20px 0 rgba(0, 0, 0, 0.1)",
        border: darkMode ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
      }}
    >
      <MDBox
        mx={2}
        mt={-3}
        py={2}
        px={2}
        variant="gradient"
        bgColor="success"
        borderRadius="lg"
        coloredShadow="success"
      >
        <MDTypography variant="h6" color="white" fontWeight="bold" textAlign="center">
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="white" textAlign="center" sx={{ opacity: 0.8 }}>
          آخر 7 أيام
        </MDTypography>
      </MDBox>

      <MDBox
        p={2}
        sx={{
          height: 300,
          direction: "ltr",
          backgroundColor: darkMode ? "background.default" : "background.paper",
        }}
      >
        {loading ? (
          <MDBox display="flex" alignItems="center" justifyContent="center" height="100%">
            <MDTypography variant="body2" color={darkMode ? "text.secondary" : "text.primary"}>
              جاري تحميل البيانات...
            </MDTypography>
          </MDBox>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </MDBox>
    </Card>
  );
}

// إضافة PropTypes للتحقق من أنواع الخصائص
CustomOrdersChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.number),
  }),
  loading: PropTypes.bool,
  title: PropTypes.string,
};

// القيم الافتراضية للخصائص
CustomOrdersChart.defaultProps = {
  data: {
    labels: [],
    data: [],
  },
  loading: false,
  title: "الطلبات اليومية",
};

export default CustomOrdersChart;
