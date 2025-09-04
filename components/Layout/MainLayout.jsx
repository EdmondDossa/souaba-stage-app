import { AuthProvider } from "@/context/auth";
import { Footer, Header } from "@/components/ui/layout";
import { Toaster } from "react-hot-toast";
import ClientLoader from "../ui/common/ClientLoader";
import SubscribeToNewsLetter from "../ui/common/SubscribeToNewsLetter";

export default function MainLayout({ children }) {
  return (
    <>
      <AuthProvider>
        <ClientLoader>
          <Header />
          <main className="min-h-screen">{children}</main>
          <SubscribeToNewsLetter />
          <Footer />
        </ClientLoader>
      </AuthProvider>
      <Toaster position="top-right" containerStyle={{fontSize:"14px"}} />
    </>
  );
}
