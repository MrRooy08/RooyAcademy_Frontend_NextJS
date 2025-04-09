"use client";
import React from "react";
import AuthContext, { AuthProvider } from "../Context/AuthContext";
import Header from "../(admin)/admin/_components/Header";

function layout({ children }) {
  return (
    <AuthProvider>
      <div>
        <Header></Header>
      </div>
      <div className="mt-2 ">{children}</div>
    </AuthProvider>
  );
}

export default layout;
