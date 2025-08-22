import propertyBanner from "@/public/images/add-etablishment/room-banner.png";
import hotelBanner from "@/public/images/add-etablishment/hotel-banner.png";
import HomeTypeDetails from "./HomeTypeDetails";

const PropertyInformations = ({
  formValues,
  initialState,
  allowNextStep,
  handleFormDataUpdate,
}) => {

  //retrieve the hebergement type
  const hebergementType = formValues.find(
    (step) => step.stepName === "Hébergement"
  ).data;

  const alternatifInfo =
    hebergementType === "Hôtel"
      ? { label: "l'hôtel", img: hotelBanner }
      : { label: "la propriété", img: propertyBanner };

  const formLayout = {
    top: {
      disposition: "row",
      fields: [
        {
          name: "name",
          label: "Nom",
          type: "text",
          placeholder: `Entrez le nom de ${alternatifInfo.label}`,
        },
        {
          name: "description",
          label: "description",
          type: "textarea",
          placeholder: `Entrez la description de ${alternatifInfo.label}`,
        },
      ],
    },
    middle: {
      fields: [
        {
          name: "country",
          label: "Pays",
          type: "select",
        },
        {
          name: "city",
          label: "Ville",
          type: "text",
          placeholder: "Entrez le nom de la ville",
        },
        {
          name: "address",
          label: "",
          type: "text",
          placeholder: "Adresse",
        },
        {
          name: "map",
          label: "",
          type: "text",
          placeholder: "Entrez la localisation google maps",
        },
      ],
    },
  };

  const proprietesBottom = {
    fields: [
      {
        name: "price_per_night",
        label: "Prix par nuit",
        type: "number",
        placeholder: "Prix par nuit",
      },
      {
        name: "capacity",
        label: "Nombre de personnes",
        type: "number",
        placeholder: "Entrez la capacité d'accueil",
      },
      {
        name: "area",
        label: "La superficie de la propriété",
        type: "number",
        placeholder: "Entrez la superficie de la propriété",
      },
    ],
  };

  const hotelsBottom = {
    fields: [
      {
        name: "rooms_number",
        label: "Nombre de chambres",
        type: "number",
        placeholder: "Entrez le nombre de chambres",
      },
      {
        name: "floor_number",
        label: "Nombre d'étages",
        type: "number",
        placeholder: "Entrez la superficie",
      },
    ],
  };

  formLayout.bottom =
    hebergementType === "Hôtel" ? hotelsBottom : proprietesBottom;

  return (
    <HomeTypeDetails
      initialState={initialState}
      bannerImg={alternatifInfo.img}
      formLayout={formLayout}
      allowNextStep={allowNextStep}
      handleFormDataUpdate={handleFormDataUpdate}
      formStepTitle={`Ajouter quelques informations concernant votre ${hebergementType}`}
    />
  );
};

export default PropertyInformations;
