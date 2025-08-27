import Image from "next/image";
import { Bath, Car, Bed, ChevronLeft } from "lucide-react";
import renderStars from "@/utils/render-star";
import { Button } from "@/components/ui/common";

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
    <div className="flex flex-col justify-between">
      <section>
        <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-600 mt-10 font-montserrat-bold mb-8">
          Résumé de la réservation
        </h1>

        <div className="border border-gray-200 w-full flex flex-col sm:flex-row sm:justify-between rounded-xl">
          <div>
            <Image
              width={1000}
              height={1000}
              className="rounded-lg w-full sm:w-52 h-48"
              src={reservationData.images[0]}
              alt={reservationData.title}
            />
          </div>
          <div className="p-4">
            <h2 className="font-montserrat-bold whitespace-nowrap text-lg text-gray-700">
              {reservationData.title}
            </h2>
            <p className="text-gray-500 capitalize text-sm font-bold">
              {reservationData.location}
            </p>
            <div className="flex items-center gap-4 text-gray-600 mt-1">
              {/* Bedrooms */}
              <div className="mt-2 flex items-center gap-x-2 font-montserrat-bold">
                <div className="flex items-center gap-1 ">
                  <Bed size={18} className="text-gray-700" />
                  <span className="text-sm font-medium">
                    {reservationData.bedrooms}
                  </span>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center gap-1">
                  <Bath size={18} className="text-gray-700" />
                  <span className="text-sm font-medium">
                    {reservationData.bathrooms}
                  </span>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-1">
                  <Car size={18} className="text-gray-700" />
                  <span className="text-sm font-medium">
                    {reservationData.parking}
                  </span>
                </div>
              </div>
            </div>
            <div className="font-montserrat-bold text-gray-700 text-sm mt-2">
              {(+reservationData.reservation.cost).toLocaleString("FR-fr") +
                " FCFA / Nuit"}
            </div>
            <div className="flex gap-x-1 mt-3 items-center">
              {renderStars(reservationData.rating)}{" "}
              <span className="text-gray-600">
                {" "}
                {reservationData.rating.toFixed(1)}{" "}
              </span>
            </div>
          </div>
        </div>
        <section className="mt-7">
          <table className="w-full">
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
