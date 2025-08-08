"use client"

import { AuthProvider } from "../Context/AuthContext";
import {Provider} from "react-redux";
import store from "@/app/Store/store";

export default function Layout({ children }) {
  return (
    <Provider store={store}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Provider>
  );
}
