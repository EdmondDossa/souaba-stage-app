import hotelRoomBanner from "@/public/images/add-etablishment/hotel-room-banner.png";
import HomeTypeDetails from "./HomeTypeDetails";

const HotelsRoom = ({ initialState, allowNextStep, handleFormDataUpdate }) => {
  const formLayout = {
    top: {
      disposition: "grid",
      fields: [
        {
          name: "room_type",
          label: "Type de chambre",
          type: "text",
          placeholder: "Standard",
        },
        {
          name: "room_name",
          label: "Nom de la chambre",
          type: "text",
          placeholder: "Entrez le nom de la chambre",
        },
        {
          name: "capacity_acc",
          label: "Capacité d'accueil",
          type: "number",
          placeholder: "Entrez la capacité d'accueil",
        },
        {
          name: "room_type_number",
          label: "Nombre de chambres de ce type",
          type: "number",
          placeholder: "Entrez le nombre de chambres",
        },
      ],
    },

    middle: {
      fields: [
        {
          name: "description_rooms",
          label: "description",
          type: "textarea",
          placeholder: `Entrez la description de la chambre`,
        },
      ],
    },

    bottom: {
      fields: [
        {
          name: "room_price_per_night",
          label: "Prix par nuit",
          type: "number",
          placeholder: "Entrez le prix par nuit",
        },
        {
          name: "number_of_bathrooms",
          label: "Nombre de salles de bains",
          type: "number",
          placeholder: "Entrez le nombre salles de bains",
        },
      ],
    },
  };

  return (
    <HomeTypeDetails
      initialState={initialState}
      bannerImg={hotelRoomBanner}
      formLayout={formLayout}
      allowNextStep={allowNextStep}
      handleFormDataUpdate={handleFormDataUpdate}
      formStepTitle={`Ajouter quelques informations concernant les chambres`}
    />
  );
};

export default HotelsRoom;
