
"use client"
import "./globals.css";
import { CartProvider } from "./Context/CartContext";
import { CourseProvider } from "./Context/CourseContext";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "@/app/Store/store";

const inter = Outfit({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mdl-js">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <CourseProvider>
          <CartProvider>
            <main>{children}</main>
          </CartProvider>
        </CourseProvider>
        <Toaster />
      </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
