import React from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const PerfumeLoadingElegant = () => {
  const primaryColor = "#5f0b28"; // اللون المطلوب: العنابي الداكن الجميل

  return (
    <MDBox
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // يمكن تغيير خلفية الشاشة الكاملة إذا لزم الأمر، هنا نستخدم خلفية افتراضية
        backgroundColor: "rgba(255, 255, 255, 0.95)", // خلفية شبه شفافة بيضاء فاتحة
        zIndex: 9999,
        // تأثير خفيف عند التحميل
        backdropFilter: "blur(2px)",
      }}
    >
      {/* زجاجة العطر - بتصميم أكثر أناقة وعصري */}
      <MDBox
        sx={{
          position: "relative",
          width: "90px",
          height: "130px",
          animation: "elegantFloat 2.5s ease-in-out infinite", // حركة طفو أبطأ وأكثر هدوءاً
          "@keyframes elegantFloat": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-18px)" },
          },
        }}
      >
        {/* جسم الزجاجة الأنيق (مستطيل مع حواف مدورة خفيفة) */}
        <MDBox
          sx={{
            position: "absolute",
            bottom: 0,
            left: "15px",
            width: "60px",
            height: "90px",
            // تدرج لوني عميق باستخدام اللون المطلوب
            background: `linear-gradient(180deg, ${primaryColor} 0%, #a33c5e 100%)`,
            borderRadius: "8px", // حواف أنعم
            boxShadow: `0 8px 30px rgba(95, 11, 40, 0.6)`, // ظل أعمق وأكثر تركيزاً
            border: "1px solid rgba(255, 255, 255, 0.2)", // لمعة زجاجية خفيفة
          }}
        />

        {/* قطعة الرذاذ المعدنية (Spray Nozzle) */}
        <MDBox
          sx={{
            position: "absolute",
            top: "10px",
            left: "37px",
            width: "16px",
            height: "10px",
            backgroundColor: "#A9A9A9", // لون معدني رمادي فاتح
            borderRadius: "2px 2px 0 0",
          }}
        />

        {/* غطاء الزجاجة (Cap) */}
        <MDBox
          sx={{
            position: "absolute",
            top: "-15px",
            left: "30px",
            width: "30px",
            height: "25px",
            backgroundColor: "#2D3748", // غطاء داكن
            borderRadius: "6px 6px 15px 15px", // شكل غطاء عصري
            boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
            // خط زخرفي على الغطاء
            "&::before": {
              content: '""',
              position: "absolute",
              bottom: "3px",
              left: "0",
              width: "100%",
              height: "2px",
              backgroundColor: "#A9A9A9",
            },
          }}
        />

        {/* تأثير الرذاذ/العطر المتصاعد - فقاعات متناثرة وأكثر خفة */}
        {[1.5, 2.2, 3.0].map((duration, index) => (
          <MDBox
            key={index}
            sx={{
              position: "absolute",
              // تحديد أماكن الفقاعات
              top: `${-40 - index * 15}px`,
              left: `${40 + (index % 2 === 0 ? -10 : 10)}px`,
              width: `${5 + index * 2}px`,
              height: `${5 + index * 2}px`,
              backgroundColor: `rgba(95, 11, 40, ${0.4 - index * 0.1})`, // شفافية خفيفة
              borderRadius: "50%",
              animation: `sprayBubble ${duration}s ease-in-out infinite ${index * 0.5}s`,
              boxShadow: `0 0 ${4 + index * 2}px rgba(95, 11, 40, 0.8)`, // توهج خفيف
            }}
          />
        ))}

        {/* تعريف حركة الفقاعات (Spray) */}
        <MDBox
          sx={{
            "@keyframes sprayBubble": {
              "0%": {
                transform: "translateY(0) scale(1)",
                opacity: 0,
              },
              "50%": {
                transform: "translateY(-30px) scale(1.1)",
                opacity: 0.8,
              },
              "100%": {
                transform: "translateY(-60px) scale(0.8)",
                opacity: 0,
              },
            },
          }}
        />
      </MDBox>

      {/* النص */}
      {/* <MDTypography
        variant="h5"
        sx={{
          mt: 4, // زيادة المسافة عن الزجاجة
          animation: "elegantPulse 1.8s ease-in-out infinite",
          fontWeight: "bold",
          color: primaryColor, // استخدام نفس لون العطر
          letterSpacing: "1px", // زيادة تباعد الحروف قليلاً
          "@keyframes elegantPulse": {
            "0%, 100%": { opacity: 0.8, transform: "scale(1)" },
            "50%": { opacity: 1, transform: "scale(1.05)" },
          },
        }}
      >
        جاري تحضير العطر...
      </MDTypography> */}
    </MDBox>
  );
};

export default PerfumeLoadingElegant;
