"use client";
import { Box, Button, Card, CardContent, Divider, TextField, Typography, Tooltip } from "@mui/material";
import { useAuth } from "@/app/Context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {toast} from "sonner";
import Link from "next/link";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import useFormValidation from "@/hooks/form/useFormValidation";

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const validate = (vals) => {
    const errs = {};
    if (!vals.username || vals.username.length < 5) {
      errs.username = 'Tên đăng nhập phải có ít nhất 5 ký tự';
    } else if (!vals.password || vals.password.length < 8) {
      errs.password = 'Vui lòng nhập mật khẩu dài hơn 8 ký tự';
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(vals.username)) {
      errs.username = "Chỉ hỗ trợ địa chỉ Gmail";
    }
    if (!isOtpSent) {
      if (!vals.password) errs.password = "Mật khẩu bắt buộc";
    } else {
      if (!otp || otp.length < 6) errs.otp = "Mã OTP phải có 6 ký tự";
    }
    return errs;
  };

  const onSubmit = async (values) => {
    const v = validate(values);
    if (Object.keys(v).length !== 0) return;

    if (!isOtpSent) {
      setIsSubmiting(true);
      try {
        const response = await fetch("https://db2777da0cce.ngrok-free.app/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
          credentials: "include",
        });
        const data = await response.json();
        console.log(data,"hello datat")
        if (data.code === 1001) {
          toast.error("Tài khoản đã tồn tại!");
          return;
        }
        toast.success("Mã otp đã được gửi đến email của bạn!");
        setIsOtpSent(true);
      } catch (e) {
        toast.error("Lỗi khi đăng ký!");
      } finally {
        setIsSubmiting(false);
      }
    } else {
      setIsVerifying(true);
      try {
        const response = await fetch("https://db2777da0cce.ngrok-free.app/users/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...values, otp }),
          credentials: "include",
        });
        if (!response.ok) {
          toast.error("Mã OTP không đúng!", {
            duration: 5000,
            position: "top-right",
            style:{
              color:"red",
              fontSize:"16px"
            }
          });
          return;
        }
        toast.success("Đăng ký thành công!");
        const success = await login(values.username, values.password);
        if (success) {
          router.push("/courses");
        }
      } catch (e) {
        toast.error("Mã OTP không đúng hoặc đã hết hạn", {
          duration: 5000,
          position: "top-right",
          style:{
            color:"red",
            fontSize:"16px"
          }
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const { values, errors, handleChange, handleSubmit } = useFormValidation({ username: "", password: "" }, validate, onSubmit);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ minWidth: 380, maxWidth: 460, boxShadow: 6, borderRadius: 3 }}>
        <Tooltip title="Back To Home" placement="top">
          <Link href="/courses" className="top-4 left-4 inline-flex items-center transition-colors group bg-white rounded-md p-2 hover:bg-[#E3F2FD]">
            <ArrowLeft className="h-4 w-4 text-[#1976D2] group-hover:text-[#1976D2]" />
          </Link>
        </Tooltip>
        <CardContent>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Đăng ký tài khoản
          </Typography>
          <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Email (Gmail)"
              name="username"
              value={values.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              fullWidth
              disabled={isOtpSent}
            />
            <TextField
              label="Mật khẩu"
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              fullWidth
              disabled={isOtpSent}
            />
            {isOtpSent && (
              <TextField
                label="Mã OTP"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={Boolean(errors.otp)}
                helperText={errors.otp}
                fullWidth
              />
            )}
            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={isOtpSent ? isVerifying : isSubmiting}
            >
              {isOtpSent
                ? isVerifying
                  ? <LoadingOverlay />
                  : "Xác thực OTP"
                : isSubmiting
                  ? <LoadingOverlay />
                  : "Gửi OTP"}
            </Button>
            <Divider />
            <Typography variant="body2" align="center">
              Đã có tài khoản? <Link href="/login" className="text-blue-600 underline">Đăng nhập</Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
