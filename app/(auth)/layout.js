import "@/styles/globals.css";

export const metadata = {
  title: "Souaba | Se connecter",
  description: "Page de connexion de Souaba",
};

export default function LoginLayout({ children }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center content-center">
      {children}
    </main>
  );
}
