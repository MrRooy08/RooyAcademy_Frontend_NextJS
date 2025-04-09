"use client";
import React from "react";
import Header from "./_components/Header";
import AuthContext, { AuthProvider } from "../Context/AuthContext";
import Footer from "./_components/Footer";
import {Provider} from "react-redux";
import store from "../Store/store";

function layout({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
      <div>
        <Header />
      </div>
      <div className="mt-2 ">{children}</div>
      <div>
        <Footer />
      </div>
      </AuthProvider>
    </Provider>

  );
}

export default layout;
