import { AuthLayout } from "@/components/Layout";
import "@/styles/globals.css";

export const metadata = {
  title: "Souaba | Connexion",
  description: "Page de connexion de Souaba",
};

export default function Layout({ children }) {
  return <AuthLayout> {children} </AuthLayout>;
}
