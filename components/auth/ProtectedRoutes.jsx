"use client";

import useAuthContext from "@/context/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const router = useRouter();
  const { isLogged, isLoading } = useAuthContext();
  const pathname = usePathname();

  const allowGuestRoutes = ["/add-establishment"];
  const isGuestAllowed = allowGuestRoutes.some((path) =>
    pathname?.startsWith(path)
  );

  useEffect(() => {
    if (!isLoading && !isLogged && !isGuestAllowed) {
      router.push("/");
    }
  }, [isLogged, isLoading, isGuestAllowed, router]);

  if (isLoading && !isGuestAllowed) return null;
  if (!isLogged && !isGuestAllowed) return null;

  return children;
};

export default ProtectedRoutes;
