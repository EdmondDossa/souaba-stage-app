"use client";
import { PropertyCard, SearchBar } from "@/components/common";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header from "./ui/layout/Header";
import Footer from "./ui/layout/Footer";

export default function Home() {
  const [property, setProperty] = useState("hotels");
  const newPoperties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: true,
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
    },
  ];
  const bestPoperties = [
    {
      imageUrl: "/images/new-property1.jpg",
      price: "620 000 FCFA",
      title: "Appartement bien meublé",
      location: "100 Smart Street, LA, États-Unis",
      rating: 2,
      showRate: true,
      isFavorite: false,
    },
    {
      imageUrl: "/images/new-property2.jpg",
      price: "720 000 FCFA",
      title: "Appartement Familial Confortable",
      location: "100 Smart Street, LA, États-Unis",
      rating: 3,
      showRate: true,
      isFavorite: true,
    },
    {
      imageUrl: "/images/new-property3.jpg",
      price: "820 000 FCFA",
      title: "Maison de plage d'été",
      location: "100 Smart Street, LA, États-Unis",
      isFavorite: false,
      rating: 4,
      showRate: true,
    },
    {
      imageUrl: "/images/new-property4.jpg",
      price: "920 000 FCFA",
      title: "Chambre double",
      location: "100 Smart Street, LA, États-Unis",
      rating: 5,
      showRate: true,
      isFavorite: false,
    },
  ];
  return (
    <div>
      <div className="relative bg-[url('/images/acceuil-first-image.webp')] bg-cover bg-center h-[60vh] w-full flex items-center justify-center text-center">
        <div className="relative h-full w-full bg-black/50 z-10 flex flex-col items-center justify-center text-white space-y-10 px-10">
          <div>
            <h2 className="font-bold text-white text-5xl">
              Trouvez l'hébergement parfait
            </h2>
            <h2 className="font-bold text-white text-5xl">
              pour votre prochain séjour.
            </h2>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-evenly">
            <h4 className="font-bold text-4xl">Trouver</h4>
            <ul className="flex items-center justify-between space-x-10">
              {/* Hôtels */}
              <li
                className={`
                relative cursor-pointer pb-1 font-semibold
                ${property === "hotels" ? "active-border" : ""}
              `}
                onClick={() => setProperty("hotels")}
              >
                Hôtels
              </li>
              {/* Résidences */}
              <li
                className={`
                relative cursor-pointer pb-1 font-semibold
                ${property === "residences" ? "active-border" : ""}
              `}
                onClick={() => setProperty("residences")}
              >
                Résidences
              </li>
              {/* Appartements */}
              <li
                className={`
                relative cursor-pointer pb-1 font-semibold
                ${property === "appartments" ? "active-border" : ""}
              `}
                onClick={() => setProperty("appartments")}
              >
                Appartements
              </li>
              {/* Villas */}
              <li
                className={`
                relative cursor-pointer pb-1 font-semibold
                ${property === "villa" ? "active-border" : ""}
              `}
                onClick={() => setProperty("villa")}
              >
                Villas
              </li>
            </ul>
          </div>
          <SearchBar />
        </div>
      </div>
      <div className="py-8 px-12 space-y-5">
        <div className="py-2 space-y-2 w-fit">
          <h1 className="font-bold text-xl lg:text-3xl">
            Dernières nouvelles{" "}
          </h1>
          <h1 className="font-bold text-xl lg:text-3xl">sur les propriétés</h1>
          <div className="w-1/3 h-1 bg-primary mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide w-full">
          {newPoperties.map((property, index) => (
            <PropertyCard
              key={index}
              imageUrl={property.imageUrl}
              price={property.price}
              title={property.title}
              location={property.location}
              isFavorite={property.isFavorite}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
      <div className="py-8 px-12 space-y-5">
        <div className="flex justify-between items-center">
          <div className="py-2 space-y-2 w-fit">
            <h1 className="font-bold text-xl lg:text-3xl">
              Propriétés répertoriées{" "}
            </h1>
            <h1 className="font-bold text-xl lg:text-3xl">à proximité</h1>
            <div className="w-1/3 h-1 bg-primary mt-2"></div>
          </div>
          <div className="flex items-center space-x-2 justify-center">
            <Image
              src="/icons/ic_map.svg"
              width={20}
              height={20}
              alt=""
              className=""
            />
            <h4 className="font-semibold text-[15px]">Afficher sur la carte</h4>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide w-full">
          {bestPoperties.map((property, index) => (
            <PropertyCard
              key={index}
              imageUrl={property.imageUrl}
              price={property.price}
              title={property.title}
              location={property.location}
              showRate={property.showRate}
              rating={property.rating}
              isFavorite={property.isFavorite}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
      <div className="py-8 px-12 relative  flex items-center justify-center text-center">
        <div className="rounded-xl bg-[url('/images/acceuil-first-image.webp')] bg-cover bg-center w-full">
          <div className="rounded-xl py-12  relative h-full w-full bg-black/50 z-10 flex flex-col  text-white space-y-4 px-10">
            <div className="space-y-3">
              <div className="w-fit h-fit flex flex-col justify-start space-y-2">
                <h4 className="font-bold text-2xl  text-start">
                  Essayez d'héberger{" "}
                </h4>
                <h4 className="font-bold text-2xl text-start">avec nous </h4>
              </div>
              <p className="text-white text-md text-start">
                Gagnez plus simplement en louant votre propriété...
              </p>
              <div className="flex justify-start items-center mt-10">
                <Link
                  href="/add-establishment"
                  className="hidden sm:inline-flex items-center px-5 py-2.5 bg-green text-white rounded-full text-sm font-bold hover:opacity-80 transition-colors shadow-sm"
                >
                  Ajouter votre établissement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 px-12 space-y-5">
        <div className="flex justify-between items-center">
          <div className="py-2 space-y-2 w-fit">
            <h1 className="font-bold text-xl lg:text-3xl">
              Propriétés répertoriées{" "}
            </h1>
            <h1 className="font-bold text-xl lg:text-3xl">à proximité</h1>
            <div className="w-1/3 h-1 bg-primary mt-2"></div>
          </div>
          <div className="flex items-center space-x-2 justify-center">
            <Image
              src="/icons/ic_map.svg"
              width={20}
              height={20}
              alt=""
              className=""
            />
            <h4 className="font-semibold text-[15px]">Afficher sur la carte</h4>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4 scrollbar-hide w-full">
          {bestPoperties.map((property, index) => (
            <PropertyCard
              key={index}
              imageUrl={property.imageUrl}
              price={property.price}
              title={property.title}
              location={property.location}
              showRate={false}
              rating={property.rating}
              isFavorite={property.isFavorite}
              className="flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
