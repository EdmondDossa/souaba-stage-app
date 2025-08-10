import { Footer, Header } from "@/components/ui/layout";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
        <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
