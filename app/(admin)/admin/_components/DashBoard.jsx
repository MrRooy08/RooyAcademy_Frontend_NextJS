"use client";

import React, { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import GroupTwoToneIcon from "@mui/icons-material/GroupTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import SchoolTwoToneIcon from "@mui/icons-material/SchoolTwoTone";
import CodeOffIcon from '@mui/icons-material/CodeOff';

const uData = [10, 30, 60, 25, 5, 9, 50, 40, 55, 45, 28, 15];
const pData = [60, 28, 45, 55, 40, 50, 9, 5, 25, 60, 30, 60];
const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function DashBoard() {
  const [categories] = useState([
    { name: "Web Development", courses: 40 },
    { name: "Data Science", courses: 30 },
    { name: "Machine Learning", courses: 25 },
    { name: "UI/UX Design", courses: 15 }
  ]);

  const [chartDimensions, setChartDimensions] = useState({
    width: window.innerWidth * 0.9,
    height: window.innerHeight * 0.6,
  });

  useEffect(() => {
    function handleResize() {
      setChartDimensions({
        width: window.innerWidth * 0.9,
        height: window.innerHeight * 0.6,
      });
    }

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ánh xạ icon
  // const iconMap = {
  //   "Web Development": ,
  //   "Data Science": 
  //   "Machine Learning": <RiBrainLine />,
  //   "UI/UX Design": <RiPaletteLine />,
  // };
  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="grid grid-cols-4 text-center gap-3">
        <div class="flex justify-between items-center rounded-md border bg-white p-3">
          <div className=" rounded-full">
            <SchoolTwoToneIcon
              sx={{
                fontSize: 64,
                backgroundColor: "#fb923c", // Màu nền
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </div>
          <div class="flex-1 ">
            <div class="card-body">
              <h6 class="card-subtitle p-1 font-serif font-bold text-lg text-gray-600 italic">
                Total Course
              </h6>
              <p class="card-text font-bold text-orange-600 text-2xl"> 100</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center rounded-md border bg-white p-3">
          <div className="bg-cyan-200 rounded-full">
            <GroupTwoToneIcon
              sx={{
                fontSize: 64,
                backgroundColor: "#FFF9C4", // Màu nền
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </div>
          <div class="flex-1 ">
            <div class="card-body">
              <h6 class="card-subtitle p-1 font-serif font-bold text-lg text-gray-700 italic">
                Total Users
              </h6>
              <p class="card-text font-bold text-orange-300 text-2xl"> 100</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center rounded-md border bg-white p-3">
          <div>
            <PersonAddAltTwoToneIcon
              sx={{
                fontSize: 64,
                backgroundColor: "#22c55e", // Màu nền
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </div>
          <div class="flex-1 ">
            <div class="card-body">
              <h6 class="card-subtitle p-1 font-serif font-bold text-lg text-gray-700 italic">
                New Users
              </h6>
              <p class="card-text font-bold text-orange-300 text-2xl"> 100</p>
            </div>
          </div>
        </div>
        <div class="flex justify-between items-center rounded-md border bg-white p-3">
          <div className="bg-yellow-200 rounded-full">
            <MonetizationOnTwoToneIcon
              sx={{
                fontSize: 64,
                backgroundColor: "#3b82f6", // Màu nền
                borderRadius: "50%",
                padding: "8px",
              }}
            />
          </div>
          <div class="flex-1 ">
            <div class="card-body">
              <h6 class="card-subtitle p-1 font-serif font-bold text-lg text-gray-700 italic">
                Total Sales
              </h6>
              <p class="card-text font-bold text-orange-300 text-2xl"> $100</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Sales and Visits Dashboard</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md border  ">
        <LineChart
          width={chartDimensions.width}
          height={chartDimensions.height}
          series={[
            {
              data: pData,
              label: "Course Visit",
              color: "#00bcd4",
              stroke: "3", // Độ dày đường
              lineWidth: 4,
            },
            {
              data: uData,
              label: "Course Sale ",
              color: "#2196f3",
              stroke: "3", // Độ dày đường
              lineWidth: 8,
            },
          ]}
          xAxis={[{ scaleType: "point", data: xLabels }]}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div class="card border h-full rounded-md bg-white p-3">
          <div class="card-header p-4">
            <div class="flex items-center flex-wrap gap-2 justify-between">
              <h6 class="font-bold text-lg mb-0">Top Categories</h6>
              <a
                href="javascript:void(0)"
                class="text-primary-600 dark:text-primary-600 hover:text-primary-600 flex items-center gap-1"
              >
                View All
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  class="icon"
                ></iconify-icon>
              </a>
            </div>
          </div>
          <div className="card-body p-4 ">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 mb-[26px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-info-50 dark:bg-info-600/20 flex justify-center items-center">
                    {/* {iconMap[category.name]} Thêm icon từ bảng ánh xạ */}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-base mb-0 font-normal">
                      {category.name}
                    </h6>
                    <span className="text-sm text-neutral-600 font-normal">
                      {category.courses}+ Courses
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div class="card border h-full rounded-md bg-white p-3">
          <div class="card-header p-4">
            <div class="flex items-center flex-wrap gap-2 justify-between">
              <h6 class="font-bold text-lg mb-0">Top Selling Courses</h6>
              <a
                href="javascript:void(0)"
                class="text-primary-600 dark:text-primary-600 hover:text-primary-600 flex items-center gap-1"
              >
                View All
                <iconify-icon
                  icon="solar:alt-arrow-right-linear"
                  class="icon"
                ></iconify-icon>
              </a>
            </div>
          </div>
          <div className="card-body p-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 mb-[26px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-info-50 dark:bg-info-600/20 flex justify-center items-center">
                    {/* {iconMap[category.name]} Thêm icon từ bảng ánh xạ */}
                    <CodeOffIcon />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="text-base mb-0 font-normal">
                      {category.name}
                    </h6>
                    <span className="text-sm text-neutral-600 font-normal">
                      {category.courses}+ Courses
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
