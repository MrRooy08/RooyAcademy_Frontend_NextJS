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
import { useAuth } from "../../Context/AuthContext";
import { useState } from "react";
import { setToken } from "../../_services/localStorageService";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");

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
  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:8080/auth/log-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        startProcessing();
        if (data.code !== 0) {
          throw new Error(data.message);
        }
        const token = data.result?.token;
        setToken(token);
        login(token);
        document.cookie = `accessToken=${token}; path=/`;
        handleClickClose();
        router.push('/admin')
      })
      .catch((error) => {
        setSnackBarMessage(error.message);
        setSnackBarOpen(true);
      })
      .finally(() => {
        stopProcessing();
      });
  };

  return (
    <div>
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
      <Dialog open={open} onClose={handleClickClose}>
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          borderRadius={5}
          height="60vh"
          bgcolor={"#f0f2f5"}
        >
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
          <Card
            sx={{
              minWidth: 400,
              maxWidth: 500,
              boxShadow: 4,
              borderRadius: 4,
              padding: 4,
            }}
          >
            <CardContent>
              <Typography variant="h5" component="h1" gutterBottom>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
