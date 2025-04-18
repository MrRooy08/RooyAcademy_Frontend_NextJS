"use client";
import React from "react";
import Header from "../_components/Header";
import { AuthProvider } from "../Context/AuthContext";
import Footer from "../_components/Footer";
import {Provider} from "react-redux";
import store from "../Store/store";

function layout({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
      <div className="flex flex-col justify-between  bg-[#F2F5FA]">
        <div> <Header /> </div>
        
        <div className="mt-16"> {children} </div>

        {/* <div> <Footer /> </div> */}

      </div>
      </AuthProvider>
    </Provider>

  );
}
export default layout;
