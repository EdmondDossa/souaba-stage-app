import Image from "next/image";
import { Bath, Car, Bed, ChevronLeft } from "lucide-react";
import renderStars from "@/utils/render-star";
import { Button, SvgIcon } from "@/components/ui/common";

const ReservationResume = ({ goToNextStep, goToPrevStep }) => {
  const reservationData = {
    id: "1",
    title: "Appartement bien meublé",
    location: "100 Smart Street, LA, États-Unis",
    price: "300 000",
    currency: "FCFA",
    period: "Nuit",
    images: [
      "/images/new-property2.jpg",
      "/images/new-property1.jpg",
      "/images/new-property2.jpg",
      "/images/new-property1.jpg",
    ],
    bedrooms: 3,
    bathrooms: 2,
    parking: 5,
    rating: 5.0,
    reservation: {
      reservation_date: "24 Août 2023 | 10h00",
      arrival_date: "4 Octobre 2023",
      departure_date: "3 Novembre 2023",
      night_number: 3,
      guests_number: 5,
      cost: "900000",
    },
  };

  return (
    <div className="flex flex-col justify-between items-center">
      <section>
        <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-600 -mt-5 md:mt-10 font-montserrat-bold mb-8">
          Résumé de la réservation
        </h1>

        <div className="md:border border-gray-200 w-full flex flex-col items-center md:flex-row justify-between rounded-xl">
          <div className="p-0 rounded-lg z-10 md:w-full h-72 w-72 md:h-48">
            <Image
              width={800}
              height={800}
              className="w-full rounded-lg  h-full"
              src={reservationData.images[0]}
              alt={reservationData.title}
            />
          </div>
          <div className="md:px-4 md:py-4 px-4 py-5 border-2 relative md:top-0 -top-2 md:border-0 border-gray-200 rounded-xl">
            <h2 className="font-montserrat-bold whitespace-nowrap mt-2 md:mt-0 text-lg text-gray-700">
              {reservationData.title}
            </h2>
            <p className="text-gray-500 mt-2 md:mt-0 capitalize text-sm font-bold">
              {reservationData.location}
            </p>
            <div className="flex justify-center md:justify-between items-center gap-4 text-gray-600 mt-1">
              {/* Bedrooms */}
              <div className="mt-2 flex items-center gap-x-4 font-montserrat-bold">
                <div className="flex items-center gap-1 ">
                  <SvgIcon name="bed" size={20} />
                  <span className="text-sm font-medium">
                    {reservationData.bedrooms}
                  </span>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center gap-1">
                  <SvgIcon name="bathtub" size={20} />
                  <span className="text-sm font-medium">
                    {reservationData.bathrooms}
                  </span>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-1">
                   <SvgIcon name="parking" size={20} />
                  <span className="text-sm font-medium">
                    {reservationData.parking}
                  </span>
                </div>
              </div>
            </div>
            <div className="font-montserrat-bold text-center md:text-left text-gray-700 text-[16px] md:text-sm mt-2">
              {(+reservationData.reservation.cost).toLocaleString("FR-fr") +
                " FCFA / Nuit"}
            </div>
            <div className="flex  items-center justify-center md:justify-start gap-x-1 mt-3">
              {renderStars(reservationData.rating)}{" "}
              <span className="text-gray-600">
                {" "}
                {reservationData.rating.toFixed(1)}{" "}
              </span>
            </div>
          </div>
        </div>
        <section className="mt-7">
          <table className="w-full text-sm">
            <tbody>
              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Date de réservation</th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {reservationData.reservation.reservation_date}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Date d'arrivée</th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {reservationData.reservation.arrival_date}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Date de départ </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {reservationData.reservation.departure_date}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Nombre de nuits </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {reservationData.reservation.night_number}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3 border-b border-gray-100 pb-8">
                <th className="font-bold text-gray-500">Nombre d'invités </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {reservationData.reservation.guests_number} personnes
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Montant</th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {
                    +reservationData.reservation.cost.toLocaleString("FR-fr")
                  }{" "}
                  FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <div className="px-10 mt-20">
        <Button
          onClick={goToNextStep}
          className="w-full bg-primary hover:!bg-amber-400 py-3 font-montserrat-bold rounded-lg mb-5"
        >
          Continuer
        </Button>

        <button
          onClick={() => goToPrevStep()}
          className="font-montserrat-bold group text-gray-800 flex items-center gap-x-2 mx-auto"
        >
          <ChevronLeft className="group-hover:-translate-x-2 transition" /> Retour
        </button>
      </div>
    </div>
  );
};

export default ReservationResume;
