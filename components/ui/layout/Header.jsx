"use client";
import { useState, useEffect } from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import { AuthProvider } from "@/context/auth";

const Header = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <AuthProvider>
      {" "}
      {isMobile ? <MobileHeader /> : <DesktopHeader />}{" "}
    </AuthProvider>
  );
};

export default Header;
