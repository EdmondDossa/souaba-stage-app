"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import useAuthContext from "@/context/auth";

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

  const readCookieToken = (names = []) => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const entry of cookies) {
      const [rawName, ...rest] = entry.split("=");
      const name = rawName?.trim();
      if (names.includes(name)) return rest.join("=");
    }
    return null;
  };

  const clearCookieTokens = (names = []) => {
    if (typeof document === "undefined") return;
    const expire = "Thu, 01 Jan 1970 00:00:00 GMT";
    names.forEach((name) => {
      document.cookie = `${name}=; expires=${expire}; path=/`;
    });
  };

  useEffect(() => {
    const run = async () => {
      if (handledRef.current) return;
      if (!provider || !apiBase) {
        setStatus("error");
        setMessage("Configuration manquante. Veuillez réessayer.");
        return;
      }

      const cookieAccess = readCookieToken(["accessToken"]);
      const cookieRefresh = readCookieToken(["refreshToken"]);
      console.log("Social auth tokens from cookies:", {
        cookieAccess,
        cookieRefresh,
      });

      const hasAnyToken =
        cookieAccess ||
        cookieRefresh ||
        (typeof window !== "undefined" &&
          (localStorage.getItem("accessToken") ||
            localStorage.getItem("refreshToken")));

      try {
        // 1) Tokens déjà présents en query ou dans les cookies
        const finalAccess = cookieAccess;
        const finalRefresh = cookieRefresh;
        console.log("Social auth tokens from cookies:", {
          finalAccess,
          finalRefresh,
        });
        if (finalAccess) {
          localStorage.setItem("accessToken", finalAccess);
        }
        if (finalRefresh) {
          localStorage.setItem("refreshToken", finalRefresh);
        }

        // 3) Nettoyer les cookies pour éviter toute incohérence
        clearCookieTokens(["accessToken", "refreshToken"]);

        // 4) Rafraîchir l'utilisateur (utilise cookie httpOnly ou bearer stocké)
        const { success } = await fetchUser(false);
        if (!success) {
          if (hasAnyToken) {
            setStatus("error");
            setMessage(
              "Connexion reçue, mais la finalisation a échoué. Veuillez réessayer."
            );
            return;
          }
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
