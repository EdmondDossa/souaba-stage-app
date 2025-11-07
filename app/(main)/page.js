"use client";
import { MainLayout } from "@/components/Layout";
import { Button, PropertyCard, SearchBar } from "@/components/ui/common";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import getAxiosInstance from "@/lib/request";
import { useGeolocation } from "@/utils/useGeolocalisation";
import NoResults from "@/components/ui/common/NotFoundResults";
import PropertyList from "@/components/ui/common/PropertyList";

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
  }, [location, http]);
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
        price_per_night: "620 000 FCFA",
        title: "Appartement bien meublé",
        city: "100 Smart Street",
        address: "LA",
        country: "États-Unis",
        rating: 2,
        showRate: true,
        isFavorite: false,
        type: "accommodation",
        name: "Appartement bien meublé",
      },
      {
        imageUrl: "/images/new-property2.jpg",
        price_per_night: "720 000 FCFA",
        title: "Appartement Familial Confortable",
        city: "100 Smart Street",
        address: "LA",
        country: "États-Unis",
        rating: 3,
        showRate: true,
        isFavorite: true,
        type: "accommodation",
        name: "Appartement Familial Confortable",
      },
      {
        imageUrl: "/images/new-property3.jpg",
        price_per_night: "820 000 FCFA",
        title: "Maison de plage d'été",
        city: "100 Smart Street",
        address: "LA",
        country: "États-Unis",
        isFavorite: false,
        rating: 4,
        showRate: true,
        type: "accommodation",
        name: "Villa de plage d'été",
      },
      {
        imageUrl: "/images/new-property4.jpg",
        price_per_night: "920 000 FCFA",
        title: "Chambre double",
        city: "100 Smart Street",
        adress: "LA",
        country: "États-Unis",
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
          <div className="px-4 max-lg:mt-10">
            <h2 className="font-[900] font-montserrat-bold  text-white text-[25px] leading-[26px] md:text-4xl lg:text-6xl md:leading-tight mt-10">
              Trouvez l&apos;hébergement parfait
            </h2>
            <h2 className="font-[800] font-montserrat-bold text-white text-[25px] leading-[26px] md:text-4xl lg:text-6xl mt-1 md:mt-2 md:leading-tight">
              pour votre prochain séjour.
            </h2>
          </div>
          <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto mt-5">
            <ul className="flex justify-center break-words items-center md:justify-center space-x-3 md:space-x-8">
              {subNavItems.map((item, i) => {
                return (
                  <li
                    key={item}
                    className={`
                relative  whitespace-nowrap text-[15px] lg:text-md cursor-pointer pb-1 md:font-montserrat-medium}
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
              className="bg-red-500 hover:bg-red-400 rounded-md"
            >
              Annuler la recherche
            </Button>
          )}
        </div>
      </div>
      {!searchActive ? (
        <section className="w-full mt-14 lg:max-w-[95%] mx-auto">
          <PropertyList
            sectionTitleFirstBloc="Dernières nouvelles"
            sectionTitleLastBloc="sur les propriétés"
            showOnMap={false}
            propertyList={newPoperties}
          />
          <PropertyList
            sectionTitleFirstBloc="Propriétés répertoriées"
            sectionTitleLastBloc="à proximité"
            showOnMap={true}
            propertyList={nearbyProperties}
          />

          <PropertyList
            sectionTitleFirstBloc="Propriétés les"
            sectionTitleLastBloc="mieux notées"
            showOnMap={true}
            propertyList={bestPoperties}
          />
          {/* CTA Section - Essayez d'héberger avec nous */}
          <div className="mt-10 md:py-8 md:px-12 relative flex items-center justify-center text-center">
            <div className="rounded-none md:rounded-xl bg-black/40 bg-blend-darken bg-[url('/images/home-illustration.png')] bg-cover bg-center w-full">
              <div className="rounded-xl py-8 md:py-12 relative h-full w-full z-10 flex flex-col text-white space-y-3 md:space-y-4 px-6 md:px-10">
                <div className="space-y-2 md:space-y-3">
                  <div className="w-fit h-auto md:h-52 font-montserrat-bold text-[26px] md:text-4xl flex flex-col justify-start space-y-1 md:space-y-2">
                    <h4 className="font-bold text-start leading-tight">
                      Essayez d&apos;héberger{" "}
                    </h4>
                    <h4 className="font-bold text-start leading-tight">
                      avec nous{" "}
                    </h4>
                  </div>
                  <p className="text-white text-[13px] md:text-md text-start">
                    Gagnez plus simplement en louant votre propriété...
                  </p>
                  <div className="flex justify-start items-center mt-6 md:mt-10">
                    <Link
                      href="/add-establishment"
                      className="inline-flex items-center px-4 md:px-5 py-2.5 md:py-3.5 font-montserrat-bold bg-green text-white rounded-full text-[12px] md:text-sm font-bold hover:opacity-80 transition-colors shadow-sm"
                    >
                      Ajouter votre établissement
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PropertyList
            sectionTitleFirstBloc="Propriétés en vedette"
            sectionTitleLastBloc="sur notre liste"
            showOnMap={true}
            propertyList={featuredProperties}
          />
        </section>
      ) : (
        <>
          {searchResult.length === 0 ? (
          <div className="flex w-full col-span-4 justify-center items-center mx-auto bg-gray-50 my-2 roundd-md" ><NoResults /></div>
          ) : (
            <div className="py-8 px-12 space-y-5 font-montserrat-bold text-gray-700">
              <div className="flex justify-between items-center">
                <div className="py-2 space-y-2 w-fit">
                  <div className="w-1/3 h-1 bg-primary mt-2"></div>
                </div>
              </div>
              <PropertyList
                sectionTitleFirstBloc="Résultats de la recherche"
                sectionTitleLastBloc={`${searchResult.length} résultat(s) trouvé(s)`}
                showOnMap={false}
                propertyList={searchResult}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}
