"use client";
import { PropertyCard, SearchBar } from "@/app/ui/common";
import { useState } from "react";
import Header from "./ui/layout/Header";
import Footer from "./ui/layout/Footer";

export default function Home() {
  const [property, setProperty] = useState("tout voir");

  return (
    <>
      <Header />
      <div>
        <div className="relative bg-[url('/images/acceuil-first-image.webp')] bg-cover bg-center h-[100vh] w-full flex items-center justify-center text-center">
          <div className="relative h-full w-full bg-black/50 z-10 flex flex-col items-center justify-center text-white space-y-4 px-10">
            <h2 className="font-montserrat-bold text-white text-7xl w-[85%] -tracking-wide">
              Trouvez l'hébergement parfait pour votre prochain séjour.
            </h2>
            <div className="w-full flex flex-col lg:flex-row items-center justify-evenly mt-10 mb-5">
              <h4 className="font-montserrat-bold text-5xl">Trouver</h4>
              <ul className="flex items-center justify-between space-x-10 font-montserrat-medium font-bold">
                {/* Tout voir */}
                <li
                  className={`
                relative cursor-pointer pb-1 font-semibold
                ${property === "tout voir" ? "active-border" : ""}
              `}
                  onClick={() => setProperty("tout voir")}
                >
                  Tout voir
                </li>
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
        <section className="p-8 w-full md:w-[90%] mx-auto mt-10">
          <h1 className="text-4xl leading-12 property-card-title inline-block mb-15 font-montserrat-bold font-bold text-gray-700">
            Dernières nouvelles <br /> sur les propriétés
          </h1>
          <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide w-full">
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="620 000 FCFA"
              title="Appartement bien meublé"
              location="100 Smart Street, LA, États-Unis"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="450 000 FCFA"
              title="Studio cosy en ville"
              location="123 Main Avenue, Paris, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="750 000 FCFA"
              title="Maison spacieuse"
              location="200 Park Ave, NY, États-Unis"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
            <PropertyCard
              imageUrl="/images/acceuil-first-image.webp"
              price="300 000 FCFA"
              title="Petite chambre"
              location="50 Rue de la Paix, Lyon, France"
              className="flex-shrink-0"
            />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
