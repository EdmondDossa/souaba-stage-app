import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-6">
              <Image
                src="/images/logo-secondary.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            {/* App Store Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="bg-white hover:bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <div className="w-6 h-6  rounded-sm flex items-center justify-center">
                  <Image
                    src="/images/playstore.png"
                    alt="Google Play"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-sm text-black font-bold">PlayStore</span>
              </button>
              <button className="bg-white hover:bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2 transition-colors">
                <div className="w-6 h-6  rounded-sm flex items-center justify-center">
                  <Image
                    src="/images/appstore.png"
                    alt="App Store"
                    width={24}
                    height={24}
                  />
                </div>
                <span className="text-sm text-black font-bold">AppStore</span>
              </button>
            </div>
          </div>

          {/* Entreprise Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6">ENTREPRISE</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link
                  href="/legal"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Informations légales
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Centre d'aide Section */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6">CENTRE D'AIDE</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/find-room"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Trouver une chambre
                </Link>
              </li>
              <li>
                <Link
                  href="/how-to-host"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Comment héberger ?
                </Link>
              </li>
              <li>
                <Link
                  href="/why-us"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Pourquoi nous ?
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-6">
              INFORMATIONS DE CONTACT
            </h3>
            <div className="space-y-4">
              <div className="text-sm">
                <span className="text-gray-400">Téléphone : </span>
                <span className="text-white">1234567890</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Email : </span>
                <span className="text-white">company@gmail.com</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-400">Emplacement : </span>
                <span className="text-white">
                  100 Smart Street, LA, États-Unis
                </span>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 mt-6">
                <Link
                  href="#"
                  className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5 text-primary" />
                </Link>
                <Link
                  href="#"
                  className="w-10 h-10 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400">
            © 2025 <span className="text-orange-500">souaba.com</span> | Tous
            droits réservés
          </div>
          <div className="text-sm text-gray-400 mt-4 md:mt-0">
            Créé avec amour par{" "}
            <span className="text-orange-500">souaba.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
