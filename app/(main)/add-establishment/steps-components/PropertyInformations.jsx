import React, { useEffect, useState } from "react";
import Image from "next/image";
import propertyInfoImage from "@/public/images/add-etablishment/room-banner.png";
import Wrapper from "../ui/Wrapper";
import StepTitle from "../ui/StepTitle";
import { ImagePlus, X } from "lucide-react";
import { handlePhotoUpload } from "@/utils";
import { TEXT_INPUT_REGEX } from "@/utils/regex";
import { Input, Label, CountrySelect } from "../ui";

const PropertyInformations = ({
  handleFormDataUpdate,
  initialState,
  allowNextStep,
}) => {
  const formFields = {
    name: "",
    description: "",
    city: "",
    address: "",
    country: "",
    city: "",
    price_per_night: "",
    capacity: "",
    area: "",
  };

  //upload states
  const [previewPhotos, setPreviewPhotos] = useState(
    initialState?.photos || []
  );
  const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  const [uploadError, setUploadError] = useState("");

  //form fields
  const [formContent, setFormContent] = useState(
    initialState?.formContent || { ...formFields }
  );

  const [formContentError, setFormContentError] = useState({ ...formFields });

  function removeUploadedPhoto(key) {
    const filteredResults = previewPhotos.filter(
      (preview, index) => `${preview.file.filename}-${index}` !== key
    );
    setPreviewPhotos(filteredResults);
    handleFormDataUpdate({ formContent, photos: filteredResults });
  }

  function handleFileChange(e) {
    const { fileError, media, message } = handlePhotoUpload(
      e.target.files,
      allowedExtensions
    );
    if (fileError) {
      setUploadError(message);
    } else setUploadError("");
    setPreviewPhotos([...previewPhotos, ...media]);
    handleFormDataUpdate({ formContent, photos: [...previewPhotos, ...media] });
    verifyAvailabilityForNextStep();
  }

  function handleFormInput(e) {
    const { name, value } = e.target;
    setFormContent({ ...formContent, [name]: value });
  }

  function addFormError(field, error) {
    setFormContentError({ ...formContentError, [field]: error });
  }

  const validator = {
    string: (field) => {
      if (!formContent[field] || !TEXT_INPUT_REGEX.test(formContent[field]))
        addFormError(
          field,
          "Ce champ est invalide. Il doit faire 3 caractères au moins."
        );
      else addFormError(field, "");
    },
    number: (field) => {
      if (!Number(formContent[field]))
        addFormError(field, "Ce champ doit être un nombre.");
      else addFormError(field, "");
    },
  };

  function verifyAvailabilityForNextStep() {
    const everyFieldHasContent = Object.values(formContent).every(
      (fieldValue) => Boolean(fieldValue)
    );
    const isFormContentError = Object.values(formContentError).some((field) =>
      Boolean(field)
    );
    const imagesHasBeenUploaded = previewPhotos.length > 0;
    if (everyFieldHasContent && imagesHasBeenUploaded && !isFormContentError)
      allowNextStep();
    else allowNextStep(false);
  }

  useEffect(() => {
    verifyAvailabilityForNextStep();
  }, [
    JSON.stringify(formContent),
    JSON.stringify(formContentError),
    previewPhotos.length,
  ]);

  useEffect(() => {
    //update the state in the parent component
    handleFormDataUpdate({ formContent, photos: previewPhotos });
  }, [JSON.stringify(formContent)]);

  return (
    <div>
      {/* main banner */}
      <div className="mb-2">
        <Image src={propertyInfoImage} width={2000} height={472} alt="" />
      </div>
      <Wrapper>
        <StepTitle>
          Ajouter quelques informations concernant cette propriété.
        </StepTitle>
        <div className="space-y-10">
          <form action="">
            <div className="mb-3">
              <Label id="name" displayName="Nom" />
              <Input
                name="name"
                onChange={handleFormInput}
                error={formContentError.name}
                value={formContent.name}
                onBlur={() => validator.string("name")}
                placeholder="Entrer le nom de la propriété"
              />
            </div>
            <div>
              <Label id="description" displayName="Description" />
              <textarea
                id="description"
                name="description"
                value={formContent.description}
                error={formContentError.description}
                onBlur={() => validator.string("description")}
                onChange={handleFormInput}
                placeholder="Entrez la description de la propriété"
                className="w-full outline-0 p-4 rounded-lg border border-gray-200 resize-none font-montserrat-medium placeholder-black text-black placeholder:text-md"
              />
              <p className="empty:hidden text-red-500 text-sm font-sans">
                {formContentError.description}
              </p>
            </div>
            <div className="grid grid-cols-1 items-center md:grid-cols-2 gap-4 mt-2 space-y-3">
              <div>
                <Label displayName="Pays" id="country" />
                <CountrySelect
                  value={formContent.country}
                  onChange={handleFormInput}
                />
              </div>
              <div>
                <Label displayName="Ville" id="ville" />
                <Input
                  name="city"
                  error={formContentError.city}
                  value={formContent.city}
                  onChange={handleFormInput}
                  onBlur={() => validator.string("city")}
                  placeholder="Nom de la ville"
                />
              </div>
              <Input
                name="address"
                onChange={handleFormInput}
                error={formContentError.address}
                placeholder="Adresse"
                onBlur={() => validator.string("address")}
                value={formContent.address}
              />
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
                  <label
                    htmlFor="photos"
                    className="block hover:bg-gray-100 p-5"
                  >
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
                  <Label displayName="Prix par nuit (FCFA)" id="night-price" />
                  <Input
                    name="price_per_night"
                    type="number"
                    onChange={handleFormInput}
                    error={formContentError.price_per_night}
                    onBlur={() => validator.number("price_per_night")}
                    value={formContent.price_per_night}
                    placeholder="Entrer le prix par nuit"
                  />
                </div>
                <div>
                  <Label displayName="Nombre de personnes" id="capacity" />
                  <Input
                    name="capacity"
                    type="number"
                    onChange={handleFormInput}
                    error={formContentError.capacity}
                    onBlur={() => validator.number("capacity")}
                    value={formContent.capacity}
                    placeholder="Entrer la capacité d'accueil"
                  />
                </div>
                <div>
                  <Label
                    displayName="La superficie de la propriété (km²)"
                    id="area"
                  />
                  <Input
                    name="area"
                    onChange={handleFormInput}
                    type="number"
                    error={formContentError.area}
                    onBlur={() => validator.number("area")}
                    value={formContent.area}
                    placeholder="Entrer la superficie"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </Wrapper>
    </div>
  );
};

export default PropertyInformations;
