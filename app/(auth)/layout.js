import "@/styles/globals.css";
import Image from "next/image";

export const metadata = {
  title: "Souaba | Se connecter",
  description: "Page de connexion de Souaba",
};

export default function LoginLayout({ children }) {
  return (
    <body>
      <main className="min-h-screen flex flex-col items-center justify-center content-center">
        {children}
      </main>
    </body>
  );
}
