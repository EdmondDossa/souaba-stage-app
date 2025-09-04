"use client";
import React, { useState } from "react";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useAuthContext from "@/context/auth";
import ConditionalComponentRender from "@/components/auth/ConditionalComponentRender";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-primary.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </Link>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/find-accomodation"
              className={`text-gray-800 hover:text-gray-900  py-2 text-sm font-medium transition-colors ${pathname === "/find-accomodation" ? "active-border":""} `}
            >
              Trouver un hébergement
            </Link>
          </nav>

          {/* Boutons de droite */}
          <div className="flex items-center space-x-3">
            <ConditionalComponentRender forLoggedUser={false}>
              {/* Bouton S'inscrire */}
              <Link
                href="/register"
                className="hidden sm:inline-flex items-center px-5 py-2.5 border-2 border-primary text-black rounded-full text-sm font-bold bg-white hover:shadow-lg shadow-gray-500 hover:bg-primary hover:text-white transition"
              >
                S'inscrire
              </Link>

              {/* Bouton Se connecter */}
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-5 py-2.5 border-2 border-primary text-black rounded-full text-sm font-bold bg-white hover:bg-primary hover:shadow-lg shadow-gray-500 hover:text-white transition"
              >
                Se connecter
              </Link>
            </ConditionalComponentRender>
              {/* Bouton Ajouter votre établissement */}
              <Link
                href="/add-establishment"
                className="hidden sm:inline-flex items-center px-5 py-2.5 bg-green text-white rounded-full text-sm font-bold hover:opacity-80 transition-colors shadow-sm"
              >
                Ajouter votre établissement
              </Link>
            {/* Avatar utilisateur */}
            <ConditionalComponentRender forLoggedUser={true}>
              <div className="relative">
                <div
                  onClick={toggleMenu}
                  className="flex items-center rounded-full border-2 border-[#CBCBCB] space-x-1 p-1.5"
                >
                  <div className="w-8 h-8   flex items-center justify-center">
                    <Menu className="w-5 h-5 text-gray-[#CBCBCB]" />
                  </div>
                  <div className="w-8 h-8   flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                </div>
              </div>
            </ConditionalComponentRender>
          </div>
        </div>
      </div>
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className={`absolute z-20  ${
              isMobile ? "w-full" : "w-[150px] right-4"
            }`}
            onClick={toggleMenu}
          >
            <div className="relative top-full left-0 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden">
              {/* Menu */}
              {isMobile && (
                <nav className="flex flex-col justify-start space-y-1">
                  <Link
                    href="/"
                    className="text-gray-800 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Trouver un hébergement
                  </Link>
                  <ConditionalComponentRender forLoggedUser={false}>
                    <Link
                      href="/register"
                      className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-full text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                    >
                      S'inscrire
                    </Link>

                    {/* Bouton Se connecter */}
                    <Link
                      href="/login"
                      className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-full text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                    >
                      Se connecter
                    </Link>
                  </ConditionalComponentRender>
                  <Link
                    href="/add-establishment"
                    className="inline-flex justify-center items-center px-5 py-2.5 bg-green text-white rounded-full text-sm font-bold hover:opacity-80 transition-colors shadow-sm"
                  >
                    Ajouter votre établissement
                  </Link>
                </nav>
              )}
              {/* Profil Action */}

              <div className="py-2">
                {/* First Section */}
                <div className="px-4 py-2 flex flex-col space-y-1">
                  <Link
                    href="/messages"
                    className="block  text-gray-700 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    Messages
                  </Link>
                  <Link
                    href="/notifications"
                    className="block  text-gray-700 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    Notifications
                  </Link>
                  <Link
                    href="/reservations"
                    className="block  text-gray-700 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    Réservations
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-2" />

                {/* Second Section */}
                <div className="px-4 py-2 flex flex-col space-y-1">
                  <Link
                    href="/profile"
                    className="block  text-gray-700 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    Profil
                  </Link>
                  <Link
                    href="/help"
                    className="block  text-gray-700 hover:bg-gray-50 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={toggleMenu}
                  >
                    Centre d'aide
                  </Link>
                  <button
                    className="block cursor-pointer p-1 w-full text-gray-700 hover:bg-red-500/50 hover:text-red-700 rounded-lg px-2 text-sm font-medium transition-colors"
                    onClick={() => {
                      toggleMenu();
                      logout();
                    }}
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
