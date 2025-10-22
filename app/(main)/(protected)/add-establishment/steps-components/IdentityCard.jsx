import { useEffect, useState } from "react";
import StepTitle from "../ui/StepTitle";
import { LucideImagePlus } from "lucide-react";
import { handlePhotoUpload } from "@/utils";
import Image from "next/image";

const IdentityCard = ({
  handleFormDataUpdate,
  initialState,
  allowNextStep,
}) => {
  const [identityPhoto, setIdentityPhoto] = useState(initialState || {});
  const [uploadError, setUploadError] = useState("");
  const allowedExtensions = ["jpg", "jpeg", "png"];

  function handleFileChange(e) {
    const { fileError, media, message } = handlePhotoUpload(e.target.files);
    if (fileError) {
      setUploadError(message);
    } else setUploadError("");
    const savedCard = { ...identityPhoto, [e.target.name]: media[0] };
    setIdentityPhoto(savedCard);
    handleFormDataUpdate(savedCard);
  }

  useEffect(() => {
    //will allow publishing only if recto photo and verso photo have been uploaded
    if (Object.keys(identityPhoto).length === 2) allowNextStep();
    else allowNextStep(false);
  }, [Object.keys(identityPhoto).length]);

  return (
    <article>
      <StepTitle>Veuillez nous fournir votre pièce d'identité</StepTitle>
      <p className="empty:hidden font-sans text-danger text-sm text-center">
        {" "}
        {uploadError}{" "}
      </p>

      <section className="flex flex-col items-center justify-center md:flex-row gap-4">
        <div className="w-[280px] md:w-sm">
          <p className="font-montserrat-bold mb-4 text-gray-800 text-md">
            Pièce d'identité (Recto)
          </p>
          <label
            className="relative flex flex-col items-center justify-center border border-gray-200 hover:bg-gray-50 transition rounded-xl p-5 h-[180px] cursor-pointer"
            htmlFor="identity-card-recto"
          >
            <LucideImagePlus className="w-10 h-12" />
            <strong className="font-montserrat-bold text-gray-700">
              Ajouter une photo
            </strong>
            {identityPhoto?.["identity-card-recto"] && (
              <Image
                className="w-full h-full rounded-lg absolute object-cover"
                width={150}
                height={150}
                alt=""
                src={identityPhoto?.["identity-card-recto"].url}
              />
            )}
          </label>
          <input
            id="identity-card-recto"
            name="identity-card-recto"
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="w-[280px] md:w-sm">
          <p className="font-montserrat-bold mb-4 text-gray-800 text-md">
            Pièce d'identité (Verso)
          </p>
          <label
            className="relative flex flex-col items-center justify-center border border-gray-200 hover:bg-gray-50 transition rounded-xl p-5 h-[180px] cursor-pointer"
            htmlFor="identity-card-verso"
          >
            <LucideImagePlus className="w-10 h-12" />
            <strong className="font-montserrat-bold text-gray-700">
              Ajouter une photo
            </strong>
            {identityPhoto?.["identity-card-verso"] && (
              <Image
                className="w-full h-full rounded-lg absolute object-cover"
                width={150}
                alt=""
                height={150}
                src={identityPhoto?.["identity-card-verso"].url}
              />
            )}
          </label>
          <input
            id="identity-card-verso"
            name="identity-card-verso"
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </div>
      </section>
    </article>
  );
};

export default IdentityCard;
