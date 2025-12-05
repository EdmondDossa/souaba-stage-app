import Image from "next/image";
import { Bath, Car, Bed, ChevronLeft } from "lucide-react";
import renderStars from "@/utils/render-star";
import { Button, SvgIcon } from "@/components/ui/common";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import toast from "react-hot-toast";
import { format } from "date-fns";
import Modal from "@/components/ui/common/Modal";

const ReservationResume = ({ goToNextStep, goToPrevStep }) => {
  const http = getAxiosInstance();
  const [openModal, setOpenModal] = useState(false);

  const [accomodationDetails, setAccommodationsDetails] = useState();
  const [currentReservation, setCurrentReservation] = useState();

  const searchParams = useSearchParams();

  const accomodationId = searchParams.get("h");
  const reservationId = searchParams.get("r");

  useEffect(() => {
    async function fetchData() {
      try {
        const accommodation = await http.get(
          `/accommodations?accommodation_id=${accomodationId}`
        );

        let foundAccomodation = accommodation.data?.data?.[0];
        if (foundAccomodation) {
          setAccommodationsDetails(foundAccomodation);

          const reservationUrl = `/reservations/${reservationId}`;

          const reservation = await http.get(reservationUrl);

          if (reservation.data) {
            setCurrentReservation(reservation.data);
          }
        }
      } catch (error) {
        toast.error("Une erreur est survenue");
        console.log(error);
      }
    }
    fetchData();
  }, [accomodationId]);

  if (!accomodationDetails || !currentReservation) return;

  async function onFinalSubmission(e) {
    const paymentMethod = searchParams.get("payment") ?? "portefeuille";
    console.log(paymentMethod);

    if (paymentMethod === "portefeuille") {
      setOpenModal(true);
    } else goToNextStep();
  }

  return (
    <div className="flex flex-col justify-between items-center">
      <section>
        <h1 className="font-bold text-xl sm:text-2xl text-center text-gray-600 -mt-5 md:mt-10 font-montserrat-bold mb-8">
          Résumé de la réservation
        </h1>

        <div className="md:border  border-gray-200 w-full flex flex-col items-center md:flex-row justify-between rounded-xl">
          <div className="p-0 rounded-lg z-10 md:w-full h-72 w-72 md:h-48">
            <Image
              width={800}
              height={800}
              className="w-full rounded-lg  h-full"
              src={accomodationDetails.AccommodationMedia[0]?.media.file_path}
              alt={accomodationDetails.name ?? ""}
            />
          </div>
          <div className="md:px-4 md:py-4 px-4 py-5 w-full border-2 relative md:top-0 -top-2 md:border-0 border-gray-200 rounded-xl">
            <h2 className="font-montserrat-bold whitespace-nowrap mt-2 md:mt-0 text-lg text-gray-700">
              {accomodationDetails.name}
            </h2>
            <p className="text-gray-500 mt-2 md:mt-0 capitalize text-sm font-bold">
              {`${accomodationDetails.city} ${accomodationDetails.district},${accomodationDetails.country}`}
            </p>
            <div className="flex justify-center md:justify-between items-center gap-4 text-gray-600 mt-1">
              {/* Bedrooms */}
              <div className="mt-2 flex items-center gap-x-4 font-montserrat-bold">
                <div className="flex items-center gap-1 ">
                  <SvgIcon name="bed" size={20} />
                  <span className="text-sm font-medium">
                    {accomodationDetails.number_of_bathrooms ?? 1}
                  </span>
                </div>

                {/* Bathrooms */}
                <div className="flex items-center gap-1">
                  <SvgIcon name="bathtub" size={20} />
                  <span className="text-sm font-medium">
                    {accomodationDetails.number_of_bathrooms ?? 1}
                  </span>
                </div>

                {/* Parking */}
                <div className="flex items-center gap-1">
                  <SvgIcon name="parking" size={20} />
                  <span className="text-sm font-medium">
                    {accomodationDetails.number_of_parking ?? 1}
                  </span>
                </div>
              </div>
            </div>
            <div className="font-montserrat-bold text-center md:text-left text-gray-700 text-[16px] md:text-sm mt-2">
              {(+accomodationDetails.price_per_night).toLocaleString("FR-fr") +
                " FCFA / Nuit"}
            </div>
            <div className="flex  items-center justify-center md:justify-start gap-x-1 mt-3">
              {renderStars(accomodationDetails.rating ?? 5)}{" "}
              <span className="text-gray-600">
                {" "}
                {accomodationDetails?.rating?.toFixed?.(1)}{" "}
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
                  {format(currentReservation.createdAt, "dd/MM/yyyy")}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Date d'arrivée</th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {format(currentReservation.check_in_date, "dd/MM/yyyy")}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Date de départ </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {format(currentReservation.check_out_date, "dd/MM/yyyy")}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Nombre de nuits </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {currentReservation.total_price /
                    accomodationDetails.price_per_night}{" "}
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3 border-b border-gray-100 pb-8">
                <th className="font-bold text-gray-500">Nombre d'invités </th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {currentReservation.number_of_guests} personnes
                </td>
              </tr>

              <tr className="flex justify-between items-center mb-3">
                <th className="font-bold text-gray-500">Montant</th>
                <td className="font-bold font-montserrat-medium text-gray-700">
                  {" "}
                  {+currentReservation.total_price.toLocaleString("FR-fr")} FCFA
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
      <div className="px-10 mt-20">
        <Button
          onClick={onFinalSubmission}
          className="w-full bg-primary hover:!bg-amber-400 py-3 font-montserrat-bold rounded-lg mb-5"
        >
          Continuer
        </Button>

        <button
          onClick={() => goToPrevStep()}
          className="font-montserrat-bold group text-gray-800 flex items-center gap-x-2 mx-auto"
        >
          <ChevronLeft className="group-hover:-translate-x-2 transition" />{" "}
          Retour
        </button>
      </div>
      <Modal onClose={() => setOpenModal(false)} isOpen={openModal}>
        <span className="p-10">Cinet Pay Payment</span>
      </Modal>
    </div>
  );
};

export default ReservationResume;
