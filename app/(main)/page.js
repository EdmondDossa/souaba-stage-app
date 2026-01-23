"use client";
import { SearchBar } from "@/components/ui/common";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import getAxiosInstance from "@/lib/request";
import { useGeolocation } from "@/utils/useGeolocalisation";
import PropertyList from "@/components/ui/common/PropertyList";

export default function Home() {
  const [property, setProperty] = useState("Tout voir");
  const [properties, setProperties] = useState();
  const [nearby, setNearby] = useState();
  const [featured, setFeatured] = useState();
  const [recent, setRecent] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useGeolocation();
  const http = getAxiosInstance();
  const hasFetchedRef = useRef(false);

  const normalizePropertiesResponse = (data) => {
    if (Array.isArray(data)) return data;
    if (data?.data && Array.isArray(data.data)) return data.data;
    return [];
  };

  useEffect(() => {
    if (!location || location.loading || hasFetchedRef.current) {
      return;
    }

    const fetchAllData = async () => {
      hasFetchedRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const nearbyPromise =
          location.latitude && location.longitude
            ? http.get(
                `/search/properties/nearby?latitude=${location.latitude}&longitude=${location.longitude}&radius=10`,
              )
            : Promise.resolve({ data: [] });

        const [
          nearbyResponse,
          featuredResponse,
          recentResponse,
          propertiesResponse,
        ] = await Promise.all([
          nearbyPromise,
          http.get("/search/properties/featured"),
          http.get("/search/properties/recent"),
          http.get("/search/properties"),
        ]);

        setNearby(nearbyResponse.data);
        setFeatured(featuredResponse.data);
        setRecent(recentResponse.data);
        setProperties(normalizePropertiesResponse(propertiesResponse.data));
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

  const filterPropertiesByType = (properties, selectedType) => {
    if (!properties || !Array.isArray(properties)) return [];

    if (selectedType === "Tout voir") {
      return properties;
    }

    return properties.filter((property) => {
      const isHotel = !!property.hotel_id;
      const accommodationType = property.type; // APARTMENT, STUDIO, VILLA

      switch (selectedType) {
        case "Hôtels":
          return isHotel;
        case "Résidences":
          return !isHotel && property.name?.toLowerCase().includes("résidence");
        case "Appartements":
          return !isHotel && accommodationType === "APARTMENT";
        case "Villas":
          return !isHotel && accommodationType === "VILLA";
        case "Studio":
          return !isHotel && accommodationType === "STUDIO";
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

  const combinedProperties = [
    ...normalizePropertiesResponse(recent),
    ...normalizePropertiesResponse(nearby),
    ...normalizePropertiesResponse(featured),
    ...normalizePropertiesResponse(properties),
  ];

  const uniqueCombinedProperties = [];
  const seenIds = new Set();

  combinedProperties.forEach((item) => {
    const id = item?.accommodation_id ?? item?.hotel_id ?? item?.id;
    if (!id || seenIds.has(id)) return;
    seenIds.add(id);
    uniqueCombinedProperties.push(item);
  });

  const topRatedProperties = filterPropertiesByType(
    uniqueCombinedProperties
      .slice()
      .sort((a, b) => (b?.avgRating ?? 0) - (a?.avgRating ?? 0)),
    property,
  ).slice(0, 8);

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
      <div className="relative bg-[url('/images/acceuil-first-image.webp')] bg-cover bg-center h-[450px] w-full flex items-center justify-center text-center">
        <div className="relative h-full w-full bg-black/50 z-10 flex flex-col items-center justify-center text-white space-y-10 px-10">
          <div className="hidden md:block px-4 max-lg:mt-10">
            <h2 className="font-black font-montserrat-bold  text-white text-[25px] leading-[26px] md:text-4xl lg:text-6xl md:leading-tight mt-10">
              Trouvez l&apos;hébergement parfait
            </h2>
            <h2 className="font-extrabold font-montserrat-bold text-white text-[25px] leading-[26px] md:text-4xl lg:text-6xl mt-1 md:mt-2 md:leading-tight">
              pour votre prochain séjour.
            </h2>
          </div>
          <div className="block md:hidden px-4 max-lg:mt-10">
            <h2 className="font-black whitespace-nowrap font-montserrat-bold  text-white text-xl sm:text-3xl leading-[26px]  md:leading-tight mt-10">
              Trouvez l&apos;hébergement
            </h2>
            <h2 className="font-black whitespace-nowrap font-montserrat-bold text-white text-xl sm:text-3xl leading-[26px]  mt-2 md:mt-2 md:leading-tight">
              parfait pour votre
            </h2>
            <h2 className="font-black whitespace-nowrap font-montserrat-bold text-white text-xl sm:text-3xl leading-[26px]  mt-2 md:mt-2 md:leading-tight">
              prochain séjour.
            </h2>
          </div>
          <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto mt-5">
            <ul className="flex items-center justify-start md:justify-center space-x-3 md:space-x-8 overflow-x-auto px-2 w-full">
              {subNavItems.map((item) => {
                return (
                  <li
                    key={item}
                    className={`
                relative font-montserrat-medium font-bold whitespace-nowrap text-[15px] lg:text-md cursor-pointer pb-1 md:font-montserrat-bold}
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
          <SearchBar />
        </div>
      </div>
      <section className="w-full mt-14 lg:max-w-[95%] mx-auto">
        <PropertyList
          sectionTitleFirstBloc="Dernières nouvelles"
          sectionTitleLastBloc="sur les propriétés"
          showOnMap={false}
          propertyList={newPoperties}
          isLoading={loading}
          cardFullWidth={false}
        />
        <PropertyList
          sectionTitleFirstBloc="Propriétés répertoriées"
          sectionTitleLastBloc="à proximité"
          showOnMap={true}
          propertyList={nearbyProperties}
          isLoading={loading}
          cardFullWidth={false}
        />

        <PropertyList
          sectionTitleFirstBloc="Propriétés les"
          sectionTitleLastBloc="mieux notées"
          showOnMap={true}
          showRating={true}
          propertyList={topRatedProperties}
          isLoading={loading}
          cardFullWidth={false}
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
          isLoading={loading}
          cardFullWidth={false}
        />
      </section>
    </>
  );
}
