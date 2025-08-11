import React, { useState } from "react";
import Image from "next/image";
import propertyInfoImage from "@/public/images/add-etablishment/room-banner.png";
import Wrapper from "./Wrapper";
import StepTitle from "./StepTitle";
import { Asterisk, ImagePlus, X } from "lucide-react";
import countryList from "@/data/country-in-fr.json";
import { handlePhotoUpload } from "@/utils";

const PropertyInformations = ({ handleFormDataUpdate, initialState }) => {
  const [previewPhotos, setPreviewPhotos] = useState(initialState || []);
  const [uploadError, setUploadError] = useState("");
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];

  function removeUploadedPhoto(key) {
    const filteredResults = previewPhotos.filter(
      (preview, index) => `${preview.file.filename}-${index}` !== key
    );
    setPreviewPhotos(filteredResults);
  }

  function handleFileChange(e) {
    const { fileError, media } = handlePhotoUpload(e, allowedExtensions);
    if (fileError) {
      setUploadError(
        `Taille MAX:5MB. Extensions autorisées ${allowedExtensions.join(",")}.`
      );
    } else setUploadError("");
    setPreviewPhotos([...previewPhotos, ...media]);
    handleFormDataUpdate([...previewPhotos, ...media]);
  }

  return (
    <div className="space-y-10">
      {/* main banner */}
      <div className="mb-5">
        <Image src={propertyInfoImage} width={2000} height={472} alt="" />
      </div>
      <Wrapper>
        <StepTitle>
          Ajouter quelques informations concernant cette propriété.
        </StepTitle>
        <div>
          <form action="">
            <div className="mb-3">
              <Label id={"property-name"} displayName="Nom" />
              <Input
                id="property-name"
                placeholder="Entrer le nom de la propriété"
              />
            </div>
            <div>
              <Label id="description" displayName="Description" />
              <textarea
                name="description"
                id="description"
                placeholder="Entrez la description de la propriété"
                className="w-full outline-0 p-4 rounded-lg border border-gray-200 resize-none font-montserrat-medium placeholder-black text-black placeholder:text-md"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 space-y-3">
              <div>
                <Label displayName="Pays" id="country" />
                <select
                  name="coutry"
                  id="country"
                  className="w-full border border-gray-200 p-4 rounded-lg font-montserrat-medium"
                >
                  <option value="">Sélectionnez un pays</option>
                  {countryList.map((country) => (
                    <option key={country}> {country} </option>
                  ))}
                </select>
              </div>
              <div>
                <Label displayName="Ville" id="ville" />
                <Input placeholder="Nom de la ville" />
              </div>
              <Input placeholder="Adresse" id="adresse" name="adresse" />
              <Input
                placeholder="Entrer la localisation google map"
                id="localisation"
                name="localisation"
              />
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-4">
              <div className="w-full md:w-1/2">
                <Label id={"photos"} displayName="Photos" />
                <p className="empty:hidden text-danger text-sm">
                  {" "}
                  {uploadError}{" "}
                </p>
                <div className="p-4 flex flex-col  border border-gray-200 rounded-lg">
                  <label htmlFor="photos" className="block hover:bg-gray-100">
                    <span className="cursor-pointer font-montserrat-bold flex flex-col items-center justify-center">
                      <ImagePlus className="w-14 h-14 mb-4" />
                      Ajouter des photos
                    </span>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      className="hidden"
                      id="photos"
                      accept="image/*"
                      multiple
                    />
                  </label>
                  {/* for choosen images */}
                  {previewPhotos.length > 0 ? (
                    <ul className="h-1/2 flex flex-wrap gap-2 overflow-y-auto  mt-5 p-1">
                      {previewPhotos.map((preview, index) => {
                        return (
                          <li
                            key={`${preview.file.filename}-${index}`}
                            className="w-[100px] h-[60px] border border-gray-200 relative group"
                          >
                            <Image
                              className="w-full h-full object-cover"
                              width={120}
                              height={120}
                              src={preview.url}
                              alt=""
                            />
                            <span
                              onClick={() =>
                                removeUploadedPhoto(
                                  `${preview.file.filename}-${index}`
                                )
                              }
                              className="z-10 absolute top-0 right-0 w-4 h-4 text-white bg-red-500 rounded-sm group-hover:flex hidden  flex-col justify-center items-center m-1 transition cursor-pointer"
                            >
                              {" "}
                              <X className="w-3 h-3" />{" "}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-600 text-center m-4 font-sans">
                      Aucune photo ajoutée pour le moment
                    </p>
                  )}
                </div>
              </div>
              <div className="[&_div]:mb-5 w-full md:w-1/2 space-y-4">
                <div>
                  <Label displayName="Prix par nuit" id="night-price" />
                  <Input placeholder="Entrer le prix par nuit" />
                </div>
                <div>
                  <Label displayName="Nombre de personnes" id="capacity" />
                  <Input
                    placeholder="Entrer la capacité d'accueil"
                    id="capacity"
                  />
                </div>
                <div>
                  <Label
                    displayName="La superficie de la propriété"
                    id="area"
                  />
                  <Input placeholder="Entrer la superficie" id="area" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

function Label({ displayName, id }) {
  return (
    <label
      className="font-montserrat-bold text-gray-800 font-bold text-md  flex items-center mb-2"
      htmlFor={id}
    >
      {" "}
      {displayName} <Asterisk className="w-4 h-4 text-danger" />
    </label>
  );
}

function Input({ type = "text", ...props }) {
  return (
    <div>
      <input
        type={type}
        className="border border-gray-200 rounded-lg outline-0 w-full p-4 placeholder:text-md  placeholder-black font-montserrat-medium"
        {...props}
      />
    </div>
  );
}

export default PropertyInformations;
