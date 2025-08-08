"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PaymentIcon from '@mui/icons-material/Payment';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';

const Sidebar = ({ isOpen, onToggle }) => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <DashboardIcon />, text: 'Dashboard', path: '/admin' },
    { icon: <SchoolIcon />, text: 'Khóa học', path: '/admin/courses' },
    { icon: <PeopleIcon />, text: 'Học viên', path: '/admin/students' },
    { icon: <PaymentIcon />, text: 'Thanh toán', path: '/admin/payments' },
    { icon: <SettingsIcon />, text: 'Cài đặt', path: '/admin/settings' },
  ];

  return (
    <>
      {/* Sidebar responsive */}
      <div className={`fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300
        ${isOpen ? 'w-64' : 'w-16'}
        hidden lg:block
      `}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-xl font-bold transition-all duration-200 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>Admin Panel</h2>
            <IconButton onClick={onToggle} className="block">
              <MenuIcon sx={{ color: '#3b82f6' }} />
            </IconButton>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${isOpen ? 'justify-start' : 'justify-center'}
                  ${pathname === item.path ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
                `}
              >
                {item.icon}
                <span className={`transition-all duration-200 ${!isOpen ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                  {item.text}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Sidebar mobile overlay */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-all duration-300 lg:hidden ${isOpen ? '' : 'hidden'}`}>
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <IconButton onClick={onToggle}>
              <MenuIcon sx={{ color: '#3b82f6' }} />
            </IconButton>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${pathname === item.path ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}
                `}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Overlay cho mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default Sidebar; 