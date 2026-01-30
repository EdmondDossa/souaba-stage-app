"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useAuthContext from "@/context/auth";
import getAxiosInstance from "@/lib/request";

export default function SocialCallbackPage() {
  const { provider } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchUser } = useAuthContext();
  const handledRef = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState(
    "Connexion en cours, veuillez patienter..."
  );

  const apiBase = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const run = async () => {
      if (handledRef.current) return;
      if (!provider || !apiBase) {
        setStatus("error");
        setMessage("Configuration manquante. Veuillez réessayer.");
        return;
      }

      const rememberMe =
        typeof window !== "undefined" &&
        sessionStorage.getItem("rememberMe") === "1";

      try {
        const http = getAxiosInstance();
        const { data } = await http.post("/auth/refresh-token");
        const access = data?.accessToken || data?.access || null;
        if (access) {
          if (rememberMe) {
            localStorage.setItem("accessToken", access);
            sessionStorage.removeItem("accessToken");
          } else {
            sessionStorage.setItem("accessToken", access);
            localStorage.removeItem("accessToken");
          }
        }

        // 2) Rafraîchir l'utilisateur (utilise cookie httpOnly ou bearer stocké)
        const { success } = await fetchUser(false);
        if (!success) {
          throw new Error("Fetch user failed");
        }

        handledRef.current = true;
        setStatus("success");
        setMessage("Connexion réussie, redirection...");
        router.replace("/");
      } catch (error) {
        console.error("Social auth error:", error);
        setStatus("error");
        setMessage(
          "Connexion sociale échouée. Veuillez réessayer ou utiliser vos identifiants."
        );
      }
    };

    run();
  }, [provider, apiBase, searchParams, fetchUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow rounded-lg p-6 w-full max-w-sm text-center space-y-3">
        <div className="text-lg font-montserrat-bold text-gray-800">
          Authentification {provider}
        </div>
        <div
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-gray-600"
          }`}
        >
          {message}
        </div>
        {status === "loading" && (
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        )}
      </div>
    </div>
  );
}
