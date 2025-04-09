"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import {
  getToken,
  removeToken,
  setToken,
} from "../_services/localStorageService";
import { useRouter } from "next/navigation";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [token, setValueToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkTokenValidity = async (token) => {
      if (!token) {
        // alert("Khac token");
        setIsLoggedIn(false);

        return;
      }
      // alert("da goi fetch");
      try {
        const response = await fetch("http://localhost:8080/auth/introspect", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify({ token: token }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("hello" + JSON.stringify(data));
        if (data.result.valid !== true) {
          setUser(null);
          setIsLoggedIn(false);
          // alert("dang nhap sai");
        } else {
          const userResponse = await fetch(
            "http://localhost:8080/users/myInfo",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!userResponse.ok) {
            throw new Error(
              `Lỗi khi lấy thông tin người dùng! status: ${userResponse.status}`
            );
          }

          const userData = await userResponse.json(); // Thông tin người dùng
          // alert("Dữ liệu trả về từ fetch: " + JSON.stringify(userData));
          setUser(userData);
          setIsLoggedIn(true);
          if (user?.result?.roles.some((role) => role.name == "ADMIN")) {
            router.push("/admin");
            // alert("dc goi");
          }
        }
      } catch (error) {
      }
    };
    checkTokenValidity(token);
  }, [token]);

  const login = (newToken) => {
    setValueToken(newToken);
    setToken(newToken); // Cập nhật token và kích hoạt lại useEffect
  };

  const logout = () => {
    removeToken();
    setToken(null); // Cập nhật lại token khi người dùng đăng xuất
    setValueToken(null);
    document.cookie = "accessToken=; Max-Age=0; path=/";
    router.push("/courses");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
