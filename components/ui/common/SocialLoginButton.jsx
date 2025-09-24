"use client"

import { FaApple, FaGoogle, FaFacebookF } from "react-icons/fa";

export default function SocialLogin() {
  return (
    <div className="text-center mb-3">

      <div className="flex justify-center gap-6">
        {/* Bouton Apple */}
        <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:scale-110 transition-transform">
          <FaApple className="text-black text-2xl" />
        </button>

        {/* Bouton Google */}
        <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:scale-110 transition-transform">
          <FaGoogle className="text-red-500 text-2xl" />
        </button>

        {/* Bouton Facebook */}
        <button className="w-14 h-14 flex items-center justify-center rounded-full border border-gray-300 bg-white hover:scale-110 transition-transform">
          <FaFacebookF className="text-blue-600 text-2xl" />
        </button>
      </div>
    </div>
  );
}
