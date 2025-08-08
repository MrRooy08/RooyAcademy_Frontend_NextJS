"use client";

import React, { useEffect, useState, useContext } from "react";
import { Button } from "@/components/ui/button";
import FormAddCourse from "./FormAddCourse";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import Login from "../../../(login)/login/Login";
import { useAuth } from './../../../Context/AuthContext';

function WelcomeBanner({onCourseAdded}) {
  const { isLoggedIn, user } = useAuth();
  const [openSnackbar, setOpenSnackbar] = useState(false); // Trạng thái hiển thị Snackbar
  const [alertMessage, setAlertMessage] = useState(""); // Nội dung thông báo
  const [alertSeverity, setAlertSeverity] = useState("success"); // Loại thông báo: success, error
  const [progress, setProgress] = useState(100); // khai báo tiến trình

  // Hàm callback nhận thông báo từ component con
  const handleShowSnackbar = (message, severity) => {
    setAlertMessage(message); // Cập nhật nội dung thông báo
    setAlertSeverity(severity); // Cập nhật kiểu thông báo
    setOpenSnackbar(true); // Hiển thị Snackbar
    setProgress(100); //reset tiến trình
  };

  const handleLogin = (data) => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress > 0 ? prevProgress - 2 : 0));
    }, 40);
    return () => {
      clearInterval(timer);
    };
  }, [handleShowSnackbar]);

  return (
    <div
      className="flex justify-between
    rounded-xl p-5"
    >
      {/* <Image src='../'
        width={100}
        height={100}
        /> */}
      <div>
        <h2 className="font-bold text-[29px]">
          {" "}
          Chào mừng đến với 
          <span className="text-primary"> Rooy Education </span>
          Academy
        </h2>
        <h2 className="text-gray-500">
          {" "}
          Explore, Learn and Build All Real Life Projects{" "}  
        </h2>
      </div>
      
        <div style={{ display: "none" }}>
          <Login status={handleLogin} />
        </div>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={2800}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={alertSeverity}
            variant="filled"
          >
            {alertMessage}
            <LinearProgress variant="determinate" value={progress} />
          </Alert>
        </Snackbar>
    </div>
  );
}

export default WelcomeBanner;
