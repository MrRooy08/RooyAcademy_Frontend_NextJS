"use client";
import { BellDot, Search } from "lucide-react";
import { toast } from "sonner";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Login from "../(login)/login/Login";
import {
  Box,
  Divider,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  ShoppingCart
} from "lucide-react"
import { useCart } from "../Context/CartContext"
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import  LoadingOverlay  from "@/app/_components/LoadingOverlay";
import { useAuth } from "../Context/AuthContext";
import { useRouter } from "next/navigation";
import Categories from "../(route)/category/_components/Categories";
import { useGetCoursesQuery, useDeleteCartItemsMutation } from "../features/courses/courseApi";
import { getImageURL } from "@/lib/media";
import { Button } from "@/components/ui/button"
import Link from "next/link";


function Header() {
  const router = useRouter();
  const { isLoggedIn, user, logout, loading } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [noResult, setNoResult] = useState(false);
  const debounceRef = useRef();
  const { data: courseData } = useGetCoursesQuery();
  const [deleteCartItems] = useDeleteCartItemsMutation();
  const courses = useMemo(() => (courseData?.result || []), [courseData]);


  // helper build haystack for searching across multiple fields
  const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const buildHaystack = (c) => normalize(`${c.name ?? ""} ${c.subtitle ?? ""} ${c.category ?? ""} ${c.parentCategory ?? ""} ${c.topic ?? ""} ${c.level ?? ""} ${c.instructorCourse.map((i) => i.name).join(" ") ?? ""}`);
  const tokenise = (str) => normalize(str).split(/\s+/).filter(t => t.length >= 2);
  const performSearch = (term) => {
    const tokens = tokenise(term);
    if (tokens.length === 0) return [];
    return courses.filter(c => {
      const hay = buildHaystack(c);
      return tokens.every(t => hay.includes(t));
    });
  };
  const { cartItems, cartCount, removeItem } = useCart();
  const [cartAnchor, setCartAnchor] = useState(null);
  const cartOpen = Boolean(cartAnchor);
  const Open = Boolean(anchorEl);

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (currentScrollTop > lastScrollTop) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollTop]);

  // debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!searchTerm) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const term = searchTerm.toLowerCase();
      const list = performSearch(term).slice(0, 8);
      setSuggestions(list);
      setNoResult(list.length === 0);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm, courses]);

  const handleSearch = () => {
    const list = performSearch(searchTerm);
    if (list.length === 0) {
      setNoResult(true);
      setSuggestions(courses.slice(0, 5));
      setSearchTerm("");
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    } else {
      // chuyển tới trang kết quả hoặc hiển thị dropdown
      setSuggestions(list.slice(0, 8));
      setNoResult(false);
      setSearchTerm("");
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCheck = async () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      try {
        const response = await fetch(`http://localhost:8080/instructor/grant`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        router.refresh();
        toast.success("Đăng ký thành công!");
      } catch (e) {
        toast.error("Lỗi khi đăng ký!");
      }

    }
  }

  const handleRemoveItem = (courseId) => {
    if (isLoggedIn) {
      deleteCartItems({ cartId: user?.result?.cart.cartId, courseId: courseId });
    }
    removeItem(courseId);
  };

  const renderMenu = (
    <div>
      <Box>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick2}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={Open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={Open ? "true" : undefined}
          >
            <Avatar sx={{ width: 40, height: 40 }}>
              {isLoggedIn
                ? user?.result?.firstName?.charAt(0).toUpperCase()
                : ""}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {
          isLoggedIn && user?.result?.roles?.some(role => role.name === "ADMIN") ? (
            <MenuItem component={Link} href="/dashboard?role=ADMIN">
              <Avatar /> Dashboard
            </MenuItem>
          ) : (
            <MenuItem component={Link} href="/dashboard">
              <Avatar /> Dashboard thường
            </MenuItem>
          )
        }
        <MenuItem component={Link} href={`/user-profile/${user?.result?.username}`}>
          <Avatar /> Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> Danh sách khóa học
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {loading ? <LoadingOverlay /> : "Logout"}
        </MenuItem>
      </Menu>
    </div>
  );

  return (
    <>
      <div
        className={`p-3  md:grid-cols-8  bg-white flex justify-between fixed top-0 left-0 right-0 w-full  md:grid  
    transition-transform duration-1000 ease-in-out z-50 ${isVisible ? "translate-y-0" : "-translate-y-16"
          }`}
      >
        <div className="p-3 col-span-1">
          <a href="/courses">
            <img
              src="/minhrom.png"
              alt="mylogo"
              width={100}
              height={100}
              layout="intrinsic"
            />
          </a>
        </div>

        <div className="col-span-2 p-4">
          <Categories />
        </div>
        <div className="col-span-3">
          <div
            className="relative flex gap-3 border justify-between h-11 mt-2
        p-2 rounded-[24px] cursor-text hover:border-cyan-400 
        sm:w-3/5
        lg:w-4/5
        "
            style={{}}
          >
            <input
              className="outline-none w-full sm:text-sm md:text-base lg:text-lg "
              onKeyDown={(e) => { if (e.key === 'Enter') { handleSearch(); } }}
              style={{ cursor: "text" }}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bạn muốn học gì  ?"
            />
            <Search onClick={handleSearch} className="cursor-pointer h-7 p-1 w-7 rounded-[24px] bg-orange-600 text-white " />
            {(suggestions.length > 0 || noResult) && (
              <div className="absolute left-0 top-full w-full bg-white shadow-lg rounded max-h-60 overflow-y-auto mt-1 z-50">
                {suggestions.map((course) => (
                  <div
                    key={course.id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-2"
                    onMouseDown={() => {
                      router.push(`/course-preview/${course.id}`)
                      setSearchTerm("")
                    }
                    }
                  >
                    <img
                      src={getImageURL(course.imageUrl, course.id) || "/placeholder.svg"}
                      alt={course.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <span className="line-clamp-1">{course.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="col-span-2 flex items-center gap-4  ">
          <div className="relative" onClick={() => router.push("/cart")} onMouseEnter={(e) => setCartAnchor(e.currentTarget)} onMouseLeave={() => setCartAnchor(null)}>
            <ShoppingCart className="text-gray-500 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            )}
            {cartOpen && (
              <div className="absolute right-0 top-6 bg-white shadow-lg rounded-md w-72 p-4 z-50" onMouseEnter={() => setCartAnchor(true)} onMouseLeave={() => setCartAnchor(null)}>
                <h4 className="font-semibold mb-2">Giỏ hàng ({cartCount})</h4>
                <div className="max-h-60 overflow-y-auto divide-y">
                  {cartItems.length === 0 && <p className="text-sm py-4 text-center">Chưa có khóa học nào</p>}
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <img src={getImageURL(item.imageUrl, item.id) || "/placeholder.svg"} alt={item.name} className="w-10 h-10 object-cover rounded" />
                        <span className="text-sm line-clamp-1 max-w-[120px]">{item.name}</span>
                      </div>
                      <button className="text-xs text-red-500" onClick={() => handleRemoveItem(item.id)}>Xoá</button>
                    </div>
                  ))}
                </div>
                {cartItems.length > 0 && (
                  <button className="mt-3 w-full bg-purple-600 text-white p-2 rounded" onClick={() => router.push("/checkout")}>Thanh toán</button>
                )}
              </div>
            )}
          </div>

          {!user?.result?.roles?.some(role => role.name === "ADMIN") && (
            (isLoggedIn ? (
              <>
                {
                  user?.result?.instructorId !== "" && user?.result?.instructorId !== null ? (
                    <Button variant="outline"
                      onClick={() => router.push("/dashboard?role=INSTRUCTOR")}
                    >
                      Dashboard Giảng viên
                    </Button>
                  ) : (
                    <Button variant="outline"
                      onClick={handleCheck}
                    >
                      Giảng dạy trên Rooy
                    </Button>
                  )
                }
              </>
            ) : (
              <Button variant="outline" onClick={handleCheck}>
                Giảng dạy trên Rooy
              </Button>
            ))
          )}

          {isLoggedIn ? renderMenu : <Login />}
        </div>
      </div>
    </>
  );
}

export default Header;
