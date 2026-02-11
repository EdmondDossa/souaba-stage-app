"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, UserCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useAuthContext from "@/context/auth";
import ConditionalComponentRender from "@/components/auth/ConditionalComponentRender";
import { usePathname, useRouter } from "next/navigation";
import { SvgIcon } from "@/components/ui/common";
import MobileSearchMenu from "@/components/ui/common/MobileSearchMenu";

const MobileHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, isLogged } = useAuthContext();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const menuPanelRef = useRef(null);
  const userMenuRef = useRef(null);
  const userMenuPanelRef = useRef(null);

  useEffect(() => {
    const closeMenus = (event) => {
      const isInsideMenuTrigger = menuRef.current?.contains(event.target);
      const isInsideMenuPanel = menuPanelRef.current?.contains(event.target);
      if (!isInsideMenuTrigger && !isInsideMenuPanel) {
        setIsMenuOpen(false);
      }
      const isInsideUserTrigger = userMenuRef.current?.contains(event.target);
      const isInsideUserPanel = userMenuPanelRef.current?.contains(event.target);
      if (!isInsideUserTrigger && !isInsideUserPanel) {
        setIsUserMenuOpen(false);
      }
    };

    const closeOnScroll = () => {
      setIsMenuOpen(false);
      setIsSearchOpen(false);
      setIsUserMenuOpen(false);
    };

    window.addEventListener("mousedown", closeMenus);
    window.addEventListener("scroll", closeOnScroll);

    return () => {
      window.removeEventListener("mousedown", closeMenus);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((prev) => !prev);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const showFloatingSearchButton = useMemo(() => {
    if (!pathname) return false;
    if (pathname === "/" || pathname === "/home") return true;
    return [
      "/search",
      "/find-hosting",
      "/find-accommodations",
      "/find-bedroom",
      "/hotels-details",
      "/appartement-details",
    ].some((route) => pathname.startsWith(route));
  }, [pathname]);

  return (
    <header className="fixed w-full bg-white shadow-md top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            ref={menuRef}
            className="w-10 h-10 flex items-center justify-center md:hidden relative"
          >
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              <div className="relative w-6 h-6">
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "opacity-0 scale-0 pointer-events-none"
                      : "opacity-100 scale-100"
                  }`}
                >
                  <SvgIcon name="menuGroup" size={25} />
                </div>
                <div
                  className={`absolute inset-0 transition-all duration-300 ease-in-out ${
                    isMenuOpen
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-0 pointer-events-none"
                  }`}
                >
                  <SvgIcon name="menuGroupClicked" size={25} />
                </div>
              </div>
            </button>
          </div>

          <div className="flex-1 flex justify-center md:flex-none md:flex-1">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo-primary.png"
                alt="Logo"
                width={100}
                height={100}
                className="h-auto"
              />
            </Link>
          </div>

          <div
            ref={userMenuRef}
            className="w-10 h-10 flex items-center justify-center md:hidden relative"
          >
            <ConditionalComponentRender forLoggedUser={true}>
              <button
                onClick={toggleUserMenu}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border-2 transition ${
                  isUserMenuOpen
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 text-primary hover:bg-gray-50"
                }`}
                aria-label="Menu profil"
              >
                <UserCircle size={20} />
              </button>
            </ConditionalComponentRender>

            <ConditionalComponentRender forLoggedUser={false}>
              <Link
                href="/login"
                className="flex items-center justify-center w-10 h-10 rounded-lg border-2 border-gray-300 text-primary hover:bg-gray-50 transition"
                aria-label="Se connecter"
              >
                <UserCircle size={20} />
              </Link>
            </ConditionalComponentRender>
          </div>

          {showFloatingSearchButton && (
            <button
              onClick={toggleSearch}
              className="fixed md:hidden bottom-5 right-4 z-[120] h-12 w-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center active:scale-95 transition"
              aria-label="Ouvrir la recherche"
            >
              <Search size={20} />
            </button>
          )}

          {isSearchOpen && showFloatingSearchButton && (
            <>
              <div
                className="fixed inset-0 bg-black/20 z-[95]"
                onClick={() => setIsSearchOpen(false)}
              />
              <div className="fixed right-4 bottom-20 min-w-[250px] w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-lg border border-gray-200 overflow-visible z-[100]">
                <MobileSearchMenu
                  className="p-6"
                  onSearch={({ check_in, check_out, capacity, destination }) => {
                    const params = new URLSearchParams();
                    params.set("check_in", check_in);
                    params.set("check_out", check_out);
                    params.set("type", "all");
                    params.set("page", "1");
                    params.set("limit", "10");
                    if (destination) params.set("city", destination);
                    if (capacity > 0) params.set("capacity", String(capacity));
                    setIsSearchOpen(false);
                    router.push(`/search?${params.toString()}`);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsMenuOpen(false)}
          />
          <div
            ref={menuPanelRef}
            className="fixed left-4 top-[72px] w-64 text-sm bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[100]"
          >
            <div className="p-4">
              <nav className="flex flex-col space-y-2 mb-4">
                <Link
                  href="/find-hosting"
                  className="text-black hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Trouver un hébergement
                </Link>
              </nav>

              <ConditionalComponentRender forLoggedUser={false}>
                <div className="flex flex-col space-y-2 mb-4">
                  <Link
                    href="/register"
                    className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-lg text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    S'inscrire
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex justify-center items-center px-5 py-2.5 border-2 border-primary text-black rounded-lg text-sm font-bold bg-white hover:bg-primary hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                </div>
              </ConditionalComponentRender>

              <Link
                href="/add-establishment"
                className="inline-flex whitespace-nowrap justify-center items-center w-full px-5 py-2.5 bg-green text-white rounded-lg text-sm font-bold hover:opacity-80 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ajouter votre établissement
              </Link>
            </div>
          </div>
        </>
      )}

      {isUserMenuOpen && isLogged && (
        <>
          <div
            className="fixed inset-0 z-[90]"
            onClick={() => setIsUserMenuOpen(false)}
          />
          <div
            ref={userMenuPanelRef}
            className="fixed right-4 top-[72px] w-64 text-sm bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-[100]"
          >
            <div className="p-4">
              <div className="flex flex-col space-y-1 pb-3">
                <Link
                  href="/favorites"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-semibold transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Favoris
                </Link>
                <Link
                  href="/messages"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-semibold transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Messages
                </Link>
                <Link
                  href="/notifications"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-semibold transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Notifications
                </Link>
                <Link
                  href="/reservations"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-semibold transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Réservations
                </Link>
              </div>

              <div className="border-t border-gray-200 my-2" />

              <div className="flex flex-col space-y-1 pt-1">
                <Link
                  href="/profile"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-medium transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Profil
                </Link>
                <Link
                  href="/help"
                  className="block text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1 text-xl font-medium transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  Centre d'aide
                </Link>
                <button
                  className="cursor-pointer text-left text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg px-2 py-1 text-xl font-medium transition-colors"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default MobileHeader;
