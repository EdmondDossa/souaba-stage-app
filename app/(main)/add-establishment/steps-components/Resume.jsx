"use client";
import residenceMini from "@/public/images/add-etablishment/residence-mini.png";
import textFileIcon from "@/public/images/add-etablishment/list-en-blanc.png";
import infoIcon from "@/public/images/add-etablishment/info-icon.png";
import Image from "next/image";
import StepTitle from "../ui/StepTitle";
import { useEffect } from "react";
import { Edit, Trash2Icon } from "lucide-react";
import useAuthContext from "@/context/auth";

const Resume = ({ formValues, allowNextStep, setCurrentStep }) => {
  const steps = {
    hebergement: 1,
    informations: 2,
    equipements: 3,
    commodites: 4,
    securites: 5,
    resume: 6,
    "identity-card": 7,
  };

  const { user } = useAuthContext();

  useEffect(() => {
    // this component do not need any validation
    allowNextStep();
  }, []);

  return (
    <article>
      <section className="mb-10">
        <StepTitle>Récapitulatif de votre hébergement</StepTitle>
        <p className="font-montserrat-medium text-lg text-center text-gray-600 -mt-8 mb-8">
          Vérifiez que toutes les informations sont correctes avant de publier.
        </p>
        {/* Hébergements sections */}
        <div className="flex items-center justify-between">
          <ResumeHead title="Type d'hébergement" icon={residenceMini} />
          <div className="font-montserrat-bold text-gray-700 text-lg">
            {formValues[steps.hebergement].data}
          </div>
        </div>

        {/* Uploaded photo */}
        <section className="flex center items-center mb-10">
          <ul className="flex items-center content-start gap-4 flex-wrap w-full mt-8">
            {formValues[steps.informations]?.data?.photos?.map(
              (photo, index) => {
                return (
                  <li key={index} className="w-[210px] h-[130px] bg-gray-200">
                    <Image
                      src={photo.url}
                      width={400}
                      height={500}
                      className="object-cover rounded-md h-full w-full"
                      alt=""
                    />
                  </li>
                );
              }
            )}
          </ul>
          {/* make update on uploaded photos */}
          <div className="w-10 flex flex-col items-center justify-center gap-y-10 mt-8">
            <button className="cursor-pointer">
              <Edit
                className="text-blue-600 w-4 h-4"
                onClick={() => setCurrentStep(steps.informations)}
              />
            </button>
            <button className="cursor-pointer">
              <Trash2Icon className="text-red-600 w-4 h-4" />
            </button>
          </div>
        </section>

        {/* General informations */}
        <section className="mb-10">
          <ResumeHead icon={infoIcon} title="Informations générales" />
          <div className="mt-10 capitalize">
            <table className="text-lg">
              <tbody className="[&_th]:font-montserrat-bold [&_tr]:mb-5">
                <tr className="flex justify-between gap-8">
                  <th>Nom:</th>
                  <td className="w-sm">
                    {formValues[steps.informations].data.formContent?.name}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Adresse:</th>
                  <td className="w-sm">
                    {formValues[steps.informations].data.formContent?.address}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Prix par nuit:</th>
                  <td className="w-sm">
                    {formValues[steps.informations].data.formContent
                      ?.price_per_night + " FCFA"}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Description:</th>
                  <td className="w-sm">
                    {
                      formValues[steps.informations].data.formContent
                        ?.description
                    }
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Equipements:</th>
                  <td className="capitalize w-sm">
                    {formValues[steps.commodites].data.join(",")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section details pieces */}
        <section className="mb-10">
          <ResumeHead icon={textFileIcon} title="Détails des pièces" />
          <div className="mt-5">
            <table>
              <tbody className="[&_th]:font-montserrat-bold  [&_tr]:mb-5 text-lg">
                <tr className="flex justify-between gap-8">
                  <th>Nombre de chambres:</th>
                  <td className="capitalize w-sm">
                    {formValues[steps.equipements].data.rooms}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Nombre de salles de bain:</th>
                  <td className="capitalize w-sm">
                    {formValues[steps.equipements].data.bathrooms}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Nombre de parking:</th>
                  <td className="capitalize w-sm">
                    {formValues[steps.equipements].data.parking}
                  </td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Capacité d'accueil:</th>
                  <td className="capitalize w-sm">
                    {formValues[steps.informations].data.formContent.capacity +
                      " personnes"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <ResumeHead icon={textFileIcon} title="Coordonnées" />
          <div className="mt-5">
            <table>
              <tbody className="[&_th]:font-montserrat-bold  [&_tr]:mb-5 text-lg">
                <tr className="flex justify-between gap-8">
                  <th>Nombre du propriétaire/gestionnaire:</th>
                  <td className="capitalize w-sm">{user.username}</td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Numéro de téléphone:</th>
                  <td className=" w-sm">{user.phone || "NA"}</td>
                </tr>
                <tr className="flex justify-between gap-8">
                  <th>Email:</th>
                  <td className=" w-sm">{user.email}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* Footer */}
        <hr className="h-3 my-10 text-gray-200" />
        <p className="text-lg font-light">
          Merci de vérifier les informations ci-dessus. Vous pourrez toujours
          modifier votre annonce après publication.
        </p>
      </section>
    </article>
  );
};

function ResumeHead({ icon, title }) {
  return (
    <div className="flex items-center gap-x-10">
      <div className="bg-primary p-3 inline-block rounded-lg">
        <Image
          src={icon}
          width={30}
          height={30}
          alt=""
          className="object-cover"
        />
      </div>
      <div className="text-lg font-montserrat-bold text-gray-800">{title}</div>
    </div>
  );
}

export default Resume;
