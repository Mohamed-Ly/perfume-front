// components/CustomRevenueChart.js
import React from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// استيراد المتحكم
import { useMaterialUIController } from "context";

// تسجيل مكونات Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function CustomRevenueChart({ data, loading, title = "المبيعات الشهرية" }) {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  // بيانات افتراضية أثناء التحميل
  const defaultData = {
    labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
    datasets: [
      {
        label: "المبيعات (دينار)",
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: "rgba(33, 150, 243, 0.8)",
        borderColor: "rgba(33, 150, 243, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartData = loading
    ? defaultData
    : {
        labels: data?.labels || [],
        datasets: [
          {
            label: "المبيعات (دينار)",
            data: data?.data || [],
            backgroundColor: darkMode ? "rgba(33, 150, 243, 0.7)" : "rgba(33, 150, 243, 0.8)",
            borderColor: "rgba(33, 150, 243, 1)",
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
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
            return `المبيعات: ${context.parsed.y.toLocaleString()} د.ل`;
          },
          labelColor: function (context) {
            return {
              borderColor: "rgba(33, 150, 243, 1)",
              backgroundColor: "rgba(33, 150, 243, 1)",
              borderWidth: 2,
              borderRadius: 2,
            };
          },
        },
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
          callback: function (value) {
            return value.toLocaleString() + " د.ل";
          },
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
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white" fontWeight="bold" textAlign="center">
          {title}
        </MDTypography>
        <MDTypography variant="caption" color="white" textAlign="center" sx={{ opacity: 0.8 }}>
          آخر 6 أشهر
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
          <Bar data={chartData} options={options} />
        )}
      </MDBox>
    </Card>
  );
}

CustomRevenueChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    data: PropTypes.arrayOf(PropTypes.number),
  }),
  loading: PropTypes.bool,
  title: PropTypes.string,
};

CustomRevenueChart.defaultProps = {
  data: {
    labels: [],
    data: [],
  },
  loading: false,
  title: "المبيعات الشهرية",
};

export default CustomRevenueChart;
