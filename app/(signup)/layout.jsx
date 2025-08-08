
import { AuthProvider } from "../Context/AuthContext";

export default function Layout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
