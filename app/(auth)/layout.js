import { AuthLayout } from "@/components/Layout";
import { AuthProvider } from "@/context/auth";
import "@/styles/globals.css";

export const metadata = {
  title: "Souaba | Connexion",
  description: "Page de connexion de Souaba",
};

export default function Layout({ children }) {
  return (
    <AuthLayout>
      <AuthProvider>{children}</AuthProvider>
    </AuthLayout>
  );
}
