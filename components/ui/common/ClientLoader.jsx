"use client";
import useAuthContext from "@/context/auth";
import souabaLogo from "@/public/images/logo-primary.png";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

const ClientLoader = ({ children }) => {
  const { isLoading } = useAuthContext();

  if (!isLoading) return children;

  return (
    <section className="min-h-screen flex flex-col justify-center items-center">
        <div>
          <Image src={souabaLogo} width={150} height={150} alt="" />
        </div>
       <div className="animate-spin"> <LoaderCircle className="text-primary w-8 h-8" /> </div>
    </section>
  );
};

export default ClientLoader;
