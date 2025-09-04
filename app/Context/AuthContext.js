"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { store } from "@/app/Store/store";
import { courseApi } from "@/app/features/courses/courseApi";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/Context/CartContext";
import { useLazyGetCourseByCourseIdQuery } from "@/app/features/courses/courseApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [triggerGetCourse] = useLazyGetCourseByCourseIdQuery();
  const {addItem, cartItems} = useCart();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      try {
          const userResponse = await fetch(
            "/api/users/myInfo",
            {
              method: "GET",
              credentials: 'include',
              headers: { 'ngrok-skip-browser-warning': 'true' },
            }
          );
          if (!userResponse.ok) {
            setIsLoggedIn(false);
            setLoading(false);
          }
          else {
            const userData = await userResponse.json();
            if (userData?.result?.cart?.items?.length > 0) {
              try {
                const detailedCourses = await Promise.all(
                  userData.result.cart.items.map(async (cartItem) => {
                    try {
                      const res = await triggerGetCourse(cartItem.id).unwrap();
                      console.log(res, "res")
                      if (!res?.result) return null;
                      return {
                        ...res.result,
                        price: cartItem.discountedPrice ?? cartItem.originalPrice,
                      };
                    } catch (_) {
                      return null;
                    }
                  })
                );
                detailedCourses.filter(Boolean).forEach((course) => addItem(course));
              } catch (err) {
                console.error("Failed to fetch course details for cart:", err);
              }
            }
            setIsLoggedIn(true);
            setUser(userData);
            console.log("🚀 ~ AuthProvider ~ user:", user)
            setLoading(false);
          }
      }catch (error) {
      }
    };
    checkTokenValidity();
  }, [isLoggedIn]);

  const login = async (username, password) => {
    try {
      const response = await fetch("/api/auth/log-in", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });
  
      if (response.ok) {
        setIsLoggedIn(true);
        return true;
      } else {
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      setIsLoggedIn(false);
      return false;
    }
  };

  const logout = async () => {
    // Clear client-side caches & storage BEFORE redirect
    setLoading(true);
    localStorage.removeItem("purchasedCourses");
    // RTK query cache reset
    store.dispatch(courseApi.util.resetApiState());

    try {
      const response = await fetch("/api/auth/log-out", {
        method: "POST",
        credentials: "include",
        headers: { 'ngrok-skip-browser-warning': 'true' },
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setLoading(false);
        window.dispatchEvent(new Event("cart_cleared"));
        localStorage.removeItem("cartItems");
        return router.push("/login");
      }
    } catch (error) {
    }
  };

  const register = async (username, password) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (response.ok) {
        setIsLoggedIn(true);
        return true;
      }
    } catch (error) {
    }
    setIsLoggedIn(true);
    return true;
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
