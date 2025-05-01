"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  Tooltip,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link'
import useFormValidation from './../../../hooks/form/useFormValidation';



export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const validateLogin = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 5 characters long';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const onSubmit = (values) => {

    fetch("http://localhost:8080/auth/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        startProcessing();
        if (data.code !== 0) {
          throw new Error(data.message);
        }
        handleClickClose();
      })
      .catch((error) => {
        let customErrorMessage = 'Cannot access! Please try later';
        if (error.message === 'Failed to fetch') {
          customErrorMessage = 'Cannot access! Please try later';
        } else if (error.message) {
          customErrorMessage = error.message; 
        }
        setSnackBarMessage(customErrorMessage);
        setSnackBarOpen(true);
      })
      .finally(() => {
        stopProcessing();
      });
  };

  const { values, errors, handleChange, handleSubmit } = useFormValidation({ username: "", password: "" }, validateLogin, onSubmit);


  useEffect(() => {
    if (pathname === "/login") {
      handleClickOpen()
    }
  }, [pathname])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleClick = () => {
    alert(
      "Please refer to Oauth2 series for this implementation guidelines. https://www.youtube.com/playlist?list=PL2xsxmVse9IbweCh6QKqZhousfEWabSeq"
    );
  };


  function startProcessing() {
    document.body.style.cursor = 'wait';
  }
  function stopProcessing() {
    document.body.style.cursor = 'default';
  }

  return (
    <div >
      {
        pathname !== "/login" && (
          <Tooltip disableFocusListener disableTouchListener title="Log in or Sign up">
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7D41E1",
                "&:hover": {
                  backgroundColor: "#6A37C7",
                },
              }}
              onClick={handleClickOpen}
            >
              Get Started
            </Button>
          </Tooltip>
        )}



      <Dialog open={open} onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClickClose();
      }}>

        <Snackbar
          open={snackBarOpen}
          onClose={handleCloseSnackBar}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackBar}
            severity="error"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snackBarMessage}
          </Alert>
        </Snackbar>
        {
          pathname !== "/login" ? (
            <button
              className="text-gray-400 absolute top-0 right-0 p-1 hover:text-gray-200"
              onClick={handleClickClose}
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="bg-white z-10 p-1 ">
              <Tooltip title="Back To Home" placement="top">
                <Link href="/courses"
                  className="inline-flex items-center transition-colors group px-3 py-2 rounded-md   bg-white hover:bg-[#E3F2FD]">
                  <ArrowLeft className="h-4 w-4 mr-2 text-[#1976D2] group-hover:text-[#1976D2] transition-transform" />
                </Link>
              </Tooltip>
            </div>
          )
        }

        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="50%"

        >
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 4,
              padding: 1,
              height: 500,
            }}
          >
            <CardContent>
              <Typography sx={{ textAlign: 'center' }} variant="h5" component="h1" gutterBottom >
                Welcome to Rooy Education
              </Typography>
              <Box
                component="form"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                onSubmit={handleSubmit}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                  error={Boolean(errors.username)}
                  helperText={errors.username}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  name="password"
                  margin="normal"
                  value={values.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  sx={{
                    mt: "15px",
                    mb: "25px",
                  }}
                >
                  Login
                </Button>
                <Divider />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                gap="25px"
              >
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleClick}
                  fullWidth
                  sx={{ gap: "10px" }}
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                >
                  Create an account
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Dialog>
    </div>
  );
}
