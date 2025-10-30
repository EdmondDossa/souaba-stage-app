"use client";
import { MainLayout } from "@/components/Layout";
import { Button, PropertyCard, SearchBar } from "@/components/ui/common";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import getAxiosInstance from "@/lib/request";
import { useGeolocation } from "@/utils/useGeolocalisation";
import NoResults from "@/components/ui/common/NotFoundResults";

export default function Home() {
  const [property, setProperty] = useState("Tout voir");
  const [properties, setProperties] = useState();
  const [nearby, setNearby] = useState();
  const [featured, setFeatured] = useState();
  const [recent, setRecent] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const location = useGeolocation();
  const http = getAxiosInstance();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (
      !location ||
      !location.latitude ||
      !location.longitude ||
      location.loading ||
      hasFetchedRef.current
    ) {
      return;
    }

    const fetchAllData = async () => {
      hasFetchedRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const [
          nearbyResponse,
          featuredResponse,
          recentResponse,
          propertiesResponse,
        ] = await Promise.all([
          http.get(
            `/properties/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=10`
          ),
          http.get("/properties/featured"),
          http.get("/properties/recent"),
          http.get("/properties"),
        ]);

        setNearby(nearbyResponse.data);
        setFeatured(featuredResponse.data);
        setRecent(recentResponse.data);
        setProperties(propertiesResponse.data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur de chargement");
        hasFetchedRef.current = false;
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [location]);
  console.log({ nearby, featured, recent, properties });

  const filterPropertiesByType = (properties, selectedType) => {
    if (!properties || !Array.isArray(properties)) return [];

    if (selectedType === "Tout voir") {
      return properties;
    }

    return properties.filter((property) => {
      const isHotel = property.type === "hotel";

      switch (selectedType) {
        case "Hôtels":
          return isHotel;
        case "Résidences":
          return !isHotel && property.name?.toLowerCase().includes("résidence");
        case "Appartements":
          return (
            !isHotel &&
            (property.name?.toLowerCase().includes("appartement") ||
              property.description?.toLowerCase().includes("appartement"))
          );
        case "Villas":
          return !isHotel && property.name?.toLowerCase().includes("villa");
        case "Studio":
          return !isHotel && property.name?.toLowerCase().includes("studio");
        default:
          return true;
      }
    });
  };

  let newPoperties = [];
  let nearbyProperties = [];
  let featuredProperties = [];

  if (recent && nearby && featured) {
    newPoperties = filterPropertiesByType(recent, property);
    nearbyProperties = filterPropertiesByType(nearby, property);
    featuredProperties = filterPropertiesByType(featured, property);
  }

  const bestPoperties = filterPropertiesByType(
    [
      {
        imageUrl: "/images/new-property1.jpg",
        price: "620 000 FCFA",
        title: "Appartement bien meublé",
        location: "100 Smart Street, LA, États-Unis",
        rating: 2,
        showRate: true,
        isFavorite: false,
        type: "accommodation",
        name: "Appartement bien meublé",
      },
      {
        imageUrl: "/images/new-property2.jpg",
        price: "720 000 FCFA",
        title: "Appartement Familial Confortable",
        location: "100 Smart Street, LA, États-Unis",
        rating: 3,
        showRate: true,
        isFavorite: true,
        type: "accommodation",
        name: "Appartement Familial Confortable",
      },
      {
        imageUrl: "/images/new-property3.jpg",
        price: "820 000 FCFA",
        title: "Maison de plage d'été",
        location: "100 Smart Street, LA, États-Unis",
        isFavorite: false,
        rating: 4,
        showRate: true,
        type: "accommodation",
        name: "Villa de plage d'été",
      },
      {
        imageUrl: "/images/new-property4.jpg",
        price: "920 000 FCFA",
        title: "Chambre double",
        location: "100 Smart Street, LA, États-Unis",
        rating: 5,
        showRate: true,
        isFavorite: false,
        type: "hotel",
        name: "Chambre double",
      },
    ],
    property
  );

  const subNavItems = [
    "Tout voir",
    "Hôtels",
    "Résidences",
    "Appartements",
    "Villas",
    "Studio",
  ];

  return (
    <>
      <div className="relative bg-[url('/images/acceuil-first-image.webp')] bg-cover bg-center h-[65vh] w-full flex items-center justify-center text-center">
        <div className="relative h-full w-full bg-black/50 z-10 flex flex-col items-center justify-center text-white space-y-10 px-10">
          <div>
            <h2 className="font-[800] font-montserrat-bold text-white text-6xl mt-4">
              Trouvez l'hébergement parfait
            </h2>
            <h2 className="font-[800] font-montserrat-bold text-white text-6xl mt-3">
              pour votre prochain séjour.
            </h2>
          </div>
          <div className="w-full flex flex-col lg:flex-row items-center justify-between max-w-4xl mx-auto mt-5">
            <h4 className="font-[800] font-montserrat-bold text-5xl uppercase">
              Trouver
            </h4>
            <ul className="flex items-center justify-between space-x-8">
              {subNavItems.map((item) => {
                return (
                  <li
                    key={item}
                    className={`
                relative cursor-pointer pb-1 font-montserrat-medium
                ${property === item ? "active-border" : "active-border-hover"}
              `}
                    onClick={() => setProperty(item)}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
          <SearchBar
            searchState={searchActive}
            searchResult={searchResult}
            setSearchActive={setSearchActive}
            setSearchResult={setSearchResult}
          />
          {searchActive && (
            <Button
              size="sm"
              onClick={() => setSearchActive(false)}
              className="bg-red-500 hover:bg-red-400 mb-3  rounded-md"
            >
              Annuler la recherche
            </Button>
          )}
        </div>
      </div>
      {!searchActive ? (
        <section className="max-w-[95%] mx-auto">
          <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
            <div className="py-2 space-y-2 w-fit ">
              <h1 className="font-bold text-xl lg:text-3xl">
                Dernières nouvelles{" "}
              </h1>
              <h1 className="font-bold text-xl lg:text-3xl mb-5">
                sur les propriétés
              </h1>
              <div className="w-1/3 h-1 bg-primary mt-2"></div>
            </div>
            {/* Pour la section "Dernières nouvelles sur les propriétés" */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide -mb-16 w-full">
              {newPoperties.length > 0 ? (
                newPoperties.map((property, index) => {
                  // Déterminer le type et extraire les informations appropriées
                  const isHotel = property.type === "hotel";
                  const mediaArray = isHotel
                    ? property.HotelMedia
                    : property.AccommodationMedia;
                  const primaryImage =
                    mediaArray?.find((media) => media.is_primary)?.media
                      ?.file_path || mediaArray?.[0]?.media?.file_path;

                  return (
                    <Link
                      key={index}
                      href={"/appartementdetails/{property.id}"}
                    >
                      <PropertyCard
                        key={index}
                        imageUrl={
                          primaryImage || "/images/default-property.jpg"
                        }
                        price={
                          isHotel
                            ? "Prix sur demande"
                            : `${property.price_per_night} FCFA`
                        }
                        title={property.name}
                        location={`${property.address}, ${property.city}, ${property.country}`}
                        rating={property.avgRating || 0}
                        isFavorite={false}
                        className="flex-shrink-0"
                      />
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 text-lg">
                    Aucun {property.toLowerCase()} trouvé pour le moment.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
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
                <h4 className="font-semibold text-[15px]">
                  Afficher sur la carte
                </h4>
              </div>
            </div>
            {/* Propriétés répertoriées à proximité */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide -mb-16 w-full">
              {nearbyProperties.map((property, index) => (
                <PropertyCard
                  key={index}
                  imageUrl={
                    property.images && property.images.length > 0
                      ? property.images[0].file_path
                      : "/images/default-property.jpg"
                  }
                  price={property.price_per_night}
                  title={property.name}
                  location={
                    property.address +
                    "," +
                    property.city +
                    ", " +
                    property.country
                  }
                  rating={property.rating}
                  isFavorite={property.isFavorite}
                  className="flex-shrink-0"
                />
              ))}
            </div>
          </div>

          <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
            <div className="flex justify-between items-center">
              <div className="py-2 space-y-2 w-fit">
                <h1 className="font-bold text-xl lg:text-3xl">
                  Propriétés les{" "}
                </h1>
                <h1 className="font-bold text-xl lg:text-3xl">mieux notées</h1>
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
                <h4 className="font-semibold text-[15px]">
                  Afficher sur la carte
                </h4>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide -mb-16 w-full">
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
            <div className="rounded-xl bg-black/40 bg-blend-darken bg-[url('/images/home-illustration.png')] bg-cover bg-center w-full">
              <div className="rounded-xl py-12  relative h-full w-full z-10 flex flex-col  text-white space-y-4 px-10">
                <div className="space-y-3">
                  <div className="w-fit h-52 font-montserrat-bold text-4xl  flex flex-col justify-start space-y-2">
                    <h4 className="font-bold  text-start">
                      Essayez d'héberger{" "}
                    </h4>
                    <h4 className="font-bold text-start">avec nous </h4>
                  </div>
                  <p className="text-white text-md text-start">
                    Gagnez plus simplement en louant votre propriété...
                  </p>
                  <div className="flex justify-start items-center mt-10">
                    <Link
                      href="/add-establishment"
                      className="hidden sm:inline-flex items-center px-5 py-3.5 font-montserrat-bold bg-green text-white rounded-full text-sm font-bold hover:opacity-80 transition-colors shadow-sm"
                    >
                      Ajouter votre établissement
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
            <div className="flex justify-between items-center">
              <div className="py-2 space-y-2 w-fit">
                <h1 className="font-bold text-xl lg:text-3xl">
                  Propriétés en vedette{" "}
                </h1>
                <h1 className="font-bold text-xl lg:text-3xl">
                  sur notre liste
                </h1>
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
                <h4 className="font-semibold text-[15px]">
                  Afficher sur la carte
                </h4>
              </div>
            </div>
            {/* Pour la section "Propriétés en vedette" */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-4 scrollbar-hide w-full mb-10">
              {featuredProperties.map((property, index) => (
                <PropertyCard
                  key={index}
                  imageUrl={
                    property.images && property.images.length > 0
                      ? property.images[0].file_path
                      : "/images/default-property.jpg"
                  }
                  price={property.price_per_night}
                  title={property.name}
                  location={
                    property.address +
                    "," +
                    property.city +
                    ", " +
                    property.country
                  }
                  showRate={false}
                  rating={property.rating}
                  isFavorite={property.isFavorite}
                  className="max-w-full w-1/3"
                  showAmenities={true}
                />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          <div className="flex  flex-col items-center mt-3 justify-center">
            <div>
              <h1 className="text-4xl  font-montserrat-bold text-gray-600 mt-2 text-center">
                {searchResult.length} élément(s) trouvé(s)
              </h1>
            </div>
          </div>
          {searchResult.length === 0 ? (
            <NoResults />
          ) : (
            <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
              <div className="flex justify-between items-center">
                <div className="py-2 space-y-2 w-fit">
                  <div className="w-1/3 h-1 bg-primary mt-2"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-4 scrollbar-hide -mb-16 w-full">
                {searchResult.map((property, index) => (
                  <PropertyCard
                    key={index}
                    imageUrl={property.AccommodationMedia[0].media.file_path}
                    price={property.price_per_night + " FCFA"}
                    title={property.name}
                    location={`${property.address}, ${property.city}, ${property.country}`}
                    rating={property.avgRating || 0}
                    isFavorite={false}
                    className="flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
