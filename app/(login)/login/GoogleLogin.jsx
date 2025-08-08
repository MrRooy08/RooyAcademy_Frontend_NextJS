"use client";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingOverlay from "@/app/_components/LoadingOverlay";
import { useAuth } from "@/app/Context/AuthContext";

export default function GoogleLoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { setIsLoggedIn } = useAuth();
    const router = useRouter();

    const handleLoginSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const idToken = credentialResponse.credential;

            const res = await fetch("http://localhost:8080/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ idToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Đăng nhập thất bại từ server");
            }

            localStorage.setItem("token", data.token);
            toast.success("Đăng nhập thành công! Đang chuyển hướng...", {
                action: {
                    label: "Undo",
                },
                style: {
                    backgroundColor: '#4caf50',
                    color: 'white',
                    borderRadius: '10px',
                },
                duration: 2500,
                position: "top-right",
            });
            setIsLoggedIn(true);
            setIsLoading(false);
            router.replace("/courses");
        } catch (error) {
            setIsLoading(false); 
            toast.error(error.message || "Đăng nhập thất bại", {
                action: {
                    label: "Undo",
                },
                style: {
                    backgroundColor: '#f44336',
                    color: 'white',
                    borderRadius: '10px',
                },
                duration: 3000,
                position: "top-right",
            });
            return; 
        }
    };

    return (
        <div>
            {isLoading && <LoadingOverlay />}
            <GoogleLogin
                onSuccess={handleLoginSuccess}
            />
        </div>
    );
}
