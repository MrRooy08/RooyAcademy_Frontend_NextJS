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
import { useLazyGetCourseByCourseIdQuery } from "@/app/features/courses/courseApi";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from 'next/link'
import useFormValidation from './../../../hooks/form/useFormValidation';
import GoogleLogin from "./GoogleLogin";
import { toast } from "sonner";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import { useCart } from "@/app/Context/CartContext";

export default function Login() {
  const { cartItems, clearCart, removeItem } = useCart();
  const [triggerGetCourse] = useLazyGetCourseByCourseIdQuery();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirect');
  const { login } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateLogin = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Tên đăng nhập là bắt buộc';
    } else if (values.username.length < 5) {
      errors.username = 'Tên đăng nhập phải có ít nhất 5 ký tự';
    } else if (!values.password || values.password.length < 5) {
      errors.password = 'Tên đăng nhập hoặc mật khẩu không đúng';
    }
    return errors;
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        // If user was redirected here from a "Buy Now" action we might not have any cart items yet.
        if (redirectTo?.startsWith("/checkout")) {
          const userResponse = await fetch(
            "http://localhost:8080/users/myInfo",
            {
              credentials: 'include',
            }
          )
          const userInfo = await userResponse.json();
          let courseId = cartItems[0]?.id;
          let isInstructorOfAny = false;
          // Case 1: User already has items in cart ("Add to cart" flow)
            if (cartItems.length > 0 ) {
            try {
              for (const item of cartItems) {
                const course = await triggerGetCourse(item.id).unwrap();
                const isOwner = course?.result?.instructorCourse?.some(
                  (ins) =>
                    ins.instructor === userInfo?.result?.instructorId &&
                    ins.isOwner === "true"
                );
                if (isOwner) {
                  courseId = item.id;
                  isInstructorOfAny = true;
                  break; // chỉ cần 1 khoá học là giảng viên thì dừng lại
                }
              }
              if (isInstructorOfAny) {
                toast.success("Đăng nhập thành công!", {
                  description: (
                    <span className="font-bold">
                      Vì bạn là giảng viên của khoá học này nên sẽ được chuyển đến trang chỉnh sửa khoá học
                    </span>
                  ),
                  action: {
                    label: "Undo",
                  },
                  duration: 2000,
                  position: "top-right",
                });
                clearCart();
                router.push(`/dashboard/manage/${courseId}/edit`);
                return;
              } else {
                toast.success("Đăng nhập thành công!", {
                  description: (
                    <span className="font-bold">
                      Hãy mau thanh toán để có thể sử dụng khoá học này
                    </span>
                  ),
                  action: {
                    label: "Undo",
                  },
                  duration: 2000,
                  position: "top-right",
                });
                
                router.back();
              }
            } catch (error) {
              toast.error(`Bạn đã là giảng viên của khoá học ${courseId} nên không thể thanh toán`);
              setIsSubmitting(false);
              return;
            }
          } else {
            // Case 2: "Buy Now" flow – cart is still empty so use courseName taken from redirectTo URL
            try {
              const courseSlug = redirectTo.split("/checkout/")[1];
              const course = await triggerGetCourse(courseSlug).unwrap();
              const isOwner = course?.result?.instructorCourse?.some(
                (ins) =>
                  ins.instructor === userInfo?.result?.instructorId &&
                  ins.isOwner === "true"
              );
              if (isOwner) {
                toast.success("Đăng nhập thành công!", {
                  description: (
                    <span className="font-bold">
                      Vì bạn là giảng viên của khoá học này nên sẽ được chuyển đến trang chỉnh sửa khoá học
                    </span>
                  ),
                  action: {
                    label: "Undo",
                  },
                  duration: 2000,
                  position: "top-right",
                });
                router.push(`/dashboard/manage/${courseSlug}/edit`);
                return;
              } else {
                toast.success("Đăng nhập thành công!", {
                  description: (
                    <span className="font-bold">
                      Hãy mau thanh toán để có thể sử dụng khoá học này
                    </span>
                  ),
                  action: {
                    label: "Undo",
                  },
                  duration: 2000,
                  position: "top-right",
                });
                router.push(redirectTo);
                return;
              }
            } catch (error) {
              toast.error("Đã xảy ra lỗi khi lấy thông tin khoá học");
              setIsSubmitting(false);
              return;
            }
          }
        }
        else {
          toast.success("Đăng nhập thành công!", {
            action: {
              label: "Undo",
            },
            duration: 2000,
            position: "top-right",
          });
          if (pathname === "/login") {
            router.push("/courses");
          }
          else {
            router.refresh();
          }
        }
      } else {
        toast.error("Tên đăng nhập hoặc mật khẩu không đúng");
        setErrors({ "username": "Tên đăng nhập hoặc mật khẩu không đúng", "password": "Tên đăng nhập hoặc mật khẩu không đúng" });
        setValues({ username: "", password: "" });
        setIsSubmitting(false);
      }
    }
    catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng ");
      setIsSubmitting(false);
    }
  };


  const { values, setValues, setErrors, errors, handleChange, handleSubmit } = useFormValidation({ username: "", password: "" }, validateLogin, onSubmit);


  useEffect(() => {
    if (pathname === "/login") {
      handleClickOpen()
    }
  }, [pathname, isSubmitting])

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
              Bắt đầu
            </Button>
          </Tooltip>
        )
      }

      <Dialog open={open} onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClickClose();
      }}>
        {isSubmitting && <LoadingOverlay />}
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
                Chào mừng đến với Rooy Academy
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
                  autoComplete="username"
                />
                <TextField
                  aria-invalid="false"
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
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    mt: "15px",
                    mb: "25px",
                  }}
                >
                  Đăng nhập
                </Button>
                <Divider />
              </Box>

              <Box
                display="flex"
                flexDirection="column"
                width="100%"
                gap="25px"
              >
                <GoogleLogin />
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  size="large"
                  onClick={() => router.push("/signup")}
                >
                  Đăng ký
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Dialog>
    </div>
  );
}
