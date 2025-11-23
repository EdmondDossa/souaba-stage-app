import { Focus, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MapDisplayContainer from "./MapDisplayContainer";
import { InputRow } from ".";
import { GOOGLE_MAP_URL_REGEX } from "@/utils/regex";
import toast from "react-hot-toast";
import { useGeolocation } from "@/utils/useGeolocalisation";

const InputWithMap = ({ className, name, value, onChange, ...props }) => {
  const [showMap, setShowMap] = useState(false);

  const openMapModal = () => setShowMap(true);
  const closeMapModal = () => setShowMap(false);

  const { longitude, latitude } = useGeolocation(); //user location info
  const [position, setPosition] = useState([
    latitude ?? 6.3562425,
    longitude ?? 2.4277995,
  ]);

  const [googleUrl, setGoogleUrl] = useState("");
  const mapRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    function hideOnEchap(e) {
      if (e.key === "Escape") closeMapModal();
    }

    function handleOutsideClick(e) {}

    window.addEventListener("click", handleOutsideClick);
    window.addEventListener("keydown", hideOnEchap);

    return () => {
      window.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("keyword", hideOnEchap);
    };
  }, []);

  useEffect(() => {
    //quand le user fait precedent ou suivant et revient sur cette page, il faut mettre les donnes en ordre
    if (value && !googleUrl) {
      const [lt, ln] = new URLSearchParams(new URL(value).search)
        .get?.("q")
        ?.trim?.()
        ?.split?.(",");
      setPosition([lt, ln]);
      setGoogleUrl(`https://maps.google.com?q=${position[0]},${position[1]}`);
    } else {
      setGoogleUrl(`https://maps.google.com?q=${position[0]},${position[1]}`);
      const e = {
        target: {
          name,
          value: `https://maps.google.com?q=${position[0]},${position[1]}`,
        },
      };
      onChange(e);
    }
  }, [JSON.stringify(position)]);

  function handleLocationValidate() {
    closeMapModal();
  }

  function handleSearchForLocation(e) {
    const query = e.target.value.trim();
    if (query.length >= 24) {
      if (GOOGLE_MAP_URL_REGEX.test(query)) {
        const [latitude, longitude] = new URLSearchParams(new URL(query).search)
          .get?.("q")
          ?.trim?.()
          ?.split?.(",");
        setPosition([latitude, longitude]);
      } else {
        toast.error("Format de l'url non valide");
      }
    }
    if (query.trim() === "") {
      setPosition([latitude ?? 6.3562425, longitude ?? 2.4277995]);
    }
  }

  return (
    <>
      <div>
        <input
          id={name}
          name={name}
          ref={inputRef}
          type="text"
          readOnly={true}
          value={googleUrl}
          onFocus={openMapModal}
          className={className}
          {...props}
        />
      </div>
      {showMap && (
        <div
          ref={mapRef}
          className="fixed  z-50 inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white w-[340px] sm:w-[370px] md:w-[650px]  rounded-xl shadow-xl  relative">
            <div className="h-[450px]">
              <div className="-mb-5 mx-2 gap-x-2 flex items-center justify-center">
                <div className="w-full">
                  <InputRow
                    required={false}
                    onChange={handleSearchForLocation}
                    placeholder="Rechercher une url: https://maps.google.com?q=latitude,longitude"
                    className="border focus:ring-0 ps-10 h-[35px]  border-gray-200 py-0 rounded-[5px]"
                  />
                  <div>
                    {" "}
                    <Search
                      size={15}
                      className="text-gray-400 text-[12px] mb-0 -translate-y-9 translate-x-2"
                    />{" "}
                  </div>
                  <div></div>
                </div>
                <div>
                  <Focus
                    onClick={handleLocationValidate}
                    className="mb-4 cursor-pointer text-primary"
                  />
                </div>
              </div>
              <MapDisplayContainer
                position={position}
                setPosition={setPosition}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InputWithMap;
