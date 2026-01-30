"use client"

import Image from "next/image";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

export default function SocialLogin({ rememberMe = true }) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL;
  const appBase =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const startSocialLogin = (provider) => {
    if (!apiBase || !appBase) return;
    const frontendCallback = `${appBase}/auth/${provider}/callback`;
    if (typeof window !== "undefined") {
      sessionStorage.setItem("rememberMe", rememberMe ? "1" : "0");
    }
    const state = JSON.stringify({
      redirectUrl: frontendCallback,
      rememberMe: Boolean(rememberMe),
    });
    const target = `${apiBase}/auth/${provider}?state=${encodeURIComponent(
      state
    )}`;
    window.location.href = target;
  };

  return (
    <div className="text-center mb-3">

      <div className="flex justify-center gap-6">
        {/* Bouton Google */}
        <button
          onClick={() => startSocialLogin("google")}
          className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:scale-110 transition-transform"
        >
          <Image width={30} height={30} alt="" src="/images/google.png" />
        </button>

        {/* Bouton Facebook */}
        <button
          onClick={() => startSocialLogin("facebook")}
          className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:scale-110 transition-transform"
        >
          <FaFacebookF className="text-blue-600 text-2xl" />
        </button>
      </div>
    </div>
  );
}
