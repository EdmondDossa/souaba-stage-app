"use client";

import useAuthContext from "@/context/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoutes = ({ children }) => {
  const router = useRouter();
  const { isLogged } = useAuthContext();

  useEffect(()=>{
    if(!isLogged) router.push("/");
  },[isLogged]);

  return children;
};

export default ProtectedRoutes;
