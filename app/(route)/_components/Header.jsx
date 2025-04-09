"use client";
import { BellDot, Search } from "lucide-react";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Login from "../authentication/Login";
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
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { AuthContext, useAuth } from "../../Context/AuthContext";
import { useRouter } from "next/navigation";
import Categories from "../category/_components/Categories";

function Header() {
  const router = useRouter();
  const { isLoggedIn, user } = useContext(AuthContext);
  const { logout } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const Open = Boolean(anchorEl);

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //mở dashboard
  const handleAdminManagement = () => {
    router.push("/admin");
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
            <Avatar sx={{ width: 32, height: 32 }}>
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
        <MenuItem onClick={handleAdminManagement}>
          <Avatar /> Admin dashboard
        </MenuItem>
        <MenuItem onClick={handleAdminManagement}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
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
          Logout
        </MenuItem>
      </Menu>
    </div>
  );

  return (
    <div
      className={`p-3  md:grid-cols-6  bg-white flex justify-between fixed top-0 left-0 right-0 w-full  md:grid  
    transition-transform duration-1000 ease-in-out z-50 ${
      isVisible ? "translate-y-0" : "-translate-y-16"
    }`}
    >
      <div className="p-3 col-span-1">
        <a href="/courses">
          <Image
            src="/minhrom.png"
            alt="mylogo"
            width={100}
            height={100}
            layout="intrinsic"
          />
        </a>
      </div>

      <div className="col-span-1 p-4">
        <Categories />
      </div>
      <div className="col-span-3">
        <div
          className="flex gap-3 border justify-between h-11 mt-2
        p-2 rounded-[24px] cursor-text hover:border-cyan-400 
        sm:w-3/5
        lg:w-4/5
        "
          style={{}}
        >
          <input
            className="outline-none w-full sm:text-sm md:text-base lg:text-lg "
            style={{ cursor: "text" }}
            type="text"
            placeholder="What do you want to learn ?"
          />
          <Search className="h-7 p-1 w-7 rounded-[24px] bg-orange-600 text-white " />
        </div>
      </div>

      <div className="col-span-1 flex items-center gap-4  ">
        <BellDot className="text-gray-500" />
        {isLoggedIn ? renderMenu : <Login />}
      </div>
    </div>
  );
}

export default Header;
