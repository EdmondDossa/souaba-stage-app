"use client";
import residenceMini from "@/public/images/add-etablishment/residence-mini.png";
import textFileIcon from "@/public/images/add-etablishment/list-en-blanc.png";
import infoIcon from "@/public/images/add-etablishment/info-icon.png";
import Image from "next/image";
import StepTitle from "../ui/StepTitle";
import { useEffect } from "react";
import { Edit, Trash2Icon } from "lucide-react";
import useAuthContext from "@/context/auth";
import { FaTrashAlt } from "react-icons/fa";

const Resume = ({ formValues, allowNextStep, setCurrentStep }) => {
  const roomsProperty = [
    {
      label: "Type de chambre",
      key: "room_type",
    },
    {
      label: "Description",
      key: "description_rooms",
    },
    {
      label: "Nombre de chambres",
      key: "room_type_number",
    },
    {
      label: "Capacité d'accueil",
      key: "capacity_acc",
    },
    {
      label: "Prix par nuit",
      key: "room_price_per_night",
    },
    {
      label: "Nombre de salles de bains",
      key: "number_of_bathrooms",
    },
  ];

  const equipementsList = [
    {
      label: "Nombre de chambres",
      key: "rooms",
    },
    {
      label: "Nombre de salles de bains",
      key: "bathrooms",
    },
    {
      label: "Nombre de parking",
      key: "parking",
    },
  ];

  //transform the array of formValues into an object like stepName:stepData
  const formData = Object.fromEntries(
    formValues.map((step) => [step.stepName, step.data])
  );

  //check either the type of hebergement
  const isHotel = formData["Hébergement"] === "Hôtel";

  const { user } = useAuthContext();

  useEffect(() => {
    // this component do not need any validation
    allowNextStep();
  }, []);

  return (
    <article>
      {/* Hébergements sections */}
      <section className="mb-10">
        <StepTitle>Récapitulatif de votre hébergement</StepTitle>
        <p className="font-sans font-light text-lg text-center text-gray-800 -mt-8 mb-8">
          Vérifiez que toutes les informations sont correctes avant de publier.
        </p>
        <div className="flex items-center justify-between">
          <ResumeHead title="Type d'hébergement" icon={residenceMini} />
          <div className="font-montserrat-bold text-gray-700 text-lg">
            {formData["Hébergement"]}
          </div>
        </div>

        {/* Uploaded photo */}
        <section className="flex center items-center mb-10">
          <ul className="flex items-center content-start gap-4 flex-wrap w-full mt-8">
            {formData["Informations"]?.photos?.map((photo, index) => {
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
            })}
          </ul>

          {/* make update on uploaded photos */}
          <div className="w-10 flex flex-col items-center justify-center gap-y-7 mt-8">
            <button>
              <Edit
                className="text-blue-600 w-4 h-4"
                onClick={() => setCurrentStep(2)}
              />
            </button>
            <button>
              <FaTrashAlt
                onClick={() => setCurrentStep(2)}
                className="text-red-600 w-4 h-4"
              />
            </button>
          </div>
        </section>

        {/* General informations */}
        <section className="mb-10">
          <ResumeHead icon={infoIcon} title="Informations générales" />
          <TableWrapper>
            <TableRow
              label="Nom"
              content={formData["Informations"].formContent?.name}
            />
            <TableRow
              label="Adresse"
              content={formData["Informations"].formContent?.address}
            />

            {/* Some tr are specific to  hôtel or others types of hebergement */}
            {!isHotel ? (
              <TableRow
                label="Prix par nuit"
                content={
                  formData["Informations"].formContent?.price_per_night +
                  " FCFA"
                }
              />
            ) : (
              <TableRow
                label="Nombre de chambres"
                content={formData["Informations"].formContent?.rooms_number}
              />
            )}
            <TableRow
              label="Description"
              content={formData["Informations"].formContent?.description}
            />
            <TableRow
              label="Equipements"
              content={formData["Commodités"].join(",")}
            />
            <TableRow
              label="Sécurités"
              content={formData["Sécurités"].join(",")}
            />
          </TableWrapper>
        </section>

        {/* Section details pieces */}
        {!isHotel && (
          <section className="mb-10">
            <ResumeHead icon={textFileIcon} title="Détails des pièces" />
            <TableWrapper>
              {equipementsList.map((item) => (
                <tr
                  key={item.label}
                  className="flex items-center justify-between gap-8 p-3"
                >
                  <th>{item.label}:</th>
                  <td className="capitalize w-sm">
                    {formData["Equipements"]?.[item.key]}
                  </td>
                </tr>
              ))}

              <tr className="flex items-center justify-between gap-8 p-3">
                <th>Capacité d'accueil:</th>
                <td className="capitalize w-sm">
                  {formData["Informations"].formContent.capacity + " personnes"}
                </td>
              </tr>
            </TableWrapper>
          </section>
        )}

        {/* Section about rooms details */}
        {isHotel && (
          <section className="mb-10 text-sm">
            <ResumeHead icon={textFileIcon} title="Les chambres ajoutées" />
            <TableWrapper className="mt-15">
              <tr className="flex justify-between items-center">
                {roomsProperty.map((property, i) => (
                  <th
                    className={`w-[150px] text-gray-800 pb-4 font-sans ${
                      i > 1 ? "text-center" : "text-start"
                    } `}
                    key={property.label}
                  >
                    {property.label}
                  </th>
                ))}
                <th className="w-[150px]"></th>
              </tr>

              <tr className="flex text-gray-600">
                {roomsProperty.map(({ key }, i) => (
                  <td
                    className={`w-[150px] border-y-2 py-5 border-gray-200 wrap-break-word ${
                      i > 1 ? "text-center" : "text-start"
                    }`}
                    key={key}
                  >
                    {/* when it is the key for the room price then convert to a human readable format */}
                    {key === "room_price_per_night"
                      ? Number(
                          formData["Chambres"].formContent[key]
                        ).toLocaleString("FR-fr") + " FCFA"
                      : formData["Chambres"].formContent[key]}{" "}
                  </td>
                ))}

                <td className="w-[150px] space-x-2  py-5 wrap-break-word">
                  <button>
                    <Edit
                      onClick={() => setCurrentStep(3)}
                      className="text-blue-600 w-4 h-4"
                    />
                  </button>
                  <button>
                    <Trash2Icon
                      onClick={() => setCurrentStep(3)}
                      className="text-red-600 w-4 h-4"
                    />
                  </button>
                </td>
              </tr>
            </TableWrapper>
          </section>
        )}

        <section>
          <ResumeHead icon={textFileIcon} title="Coordonnées" />
          <TableWrapper>
            <TableRow
              label="Nombre du propriétaire/gestionnaire"
              content={user.firstname || user.lastname || "NA"}
            />
            <TableRow
              label="Numéro de téléphone"
              content={user.phone || "NA"}
            />
            <TableRow label="Email" content={formData["Mes infos"].email} />
          </TableWrapper>
        </section>
        {/* Footer */}
        <hr className="h-4 my-10 text-gray-200" />
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

function TableWrapper({ children, className }) {
  return (
    <div className={`mt-5 ${className}`}>
      <table>
        <tbody className="[&_th]:font-montserrat-bold">{children}</tbody>
      </table>
    </div>
  );
}

function TableRow({ content, label }) {
  return (
    <tr className="flex justify-between gap-8 p-3">
      <th>{label} :</th>
      <td className="w-sm"> {content} </td>
    </tr>
  );
}

export default Resume;
