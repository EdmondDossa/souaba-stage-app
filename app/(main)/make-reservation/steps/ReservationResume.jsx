import Image from "next/image";
import {
  Bath,
  Car,
  Bed,
  ChevronLeft,
  CalendarRange,
  Users,
  MapPin,
} from "lucide-react";
import renderStars from "@/utils/render-star";
import { Button } from "@/components/ui/common";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import getAxiosInstance from "@/lib/request";
import toast from "react-hot-toast";
import { format, differenceInDays } from "date-fns";
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

        const foundAccomodation = accommodation.data?.data?.[0];
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

  const nights = useMemo(() => {
    if (
      !currentReservation?.check_in_date ||
      !currentReservation?.check_out_date
    )
      return 1;
    const diff = differenceInDays(
      new Date(currentReservation.check_out_date),
      new Date(currentReservation.check_in_date)
    );
    return Math.max(diff, 1);
  }, [currentReservation?.check_in_date, currentReservation?.check_out_date]);

  if (!accomodationDetails || !currentReservation) return null;

  async function onFinalSubmission() {
    const paymentMethod = (
      searchParams.get("payment") || "WALLET"
    ).toUpperCase();
    if (paymentMethod === "WALLET") {
      setOpenModal(true);
    } else goToNextStep();
  }

  return (
    <div className="flex flex-col items-center pb-16">
      <section className="w-full max-w-6xl mx-auto px-4 md:px-6 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.12em] text-primary font-semibold">
              Étape 2 / Résumé
            </p>
            <h1 className="font-bold text-2xl lg:text-3xl text-gray-900 font-montserrat-bold mt-1">
              Vérifiez vos informations
            </h1>
            <p className="text-gray-500 text-sm mt-1 max-w-xl">
              Ajustez si besoin avant de confirmer votre paiement.
            </p>
          </div>
          <div className="bg-white shadow-sm border border-gray-100 rounded-2xl px-6 py-4 text-right w-full lg:w-auto">
            <div className="text-3xl font-montserrat-bold text-gray-900 leading-none">
              {(+currentReservation.total_price || 0).toLocaleString("fr-FR")}{" "}
              FCFA
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {nights} nuit{nights > 1 ? "s" : ""} •{" "}
              {(+accomodationDetails.price_per_night || 0).toLocaleString(
                "fr-FR"
              )}{" "}
              FCFA / nuit
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative">
            <Image
              width={1600}
              height={900}
              className="w-full h-[420px] md:h-[520px] object-cover"
              src={
                accomodationDetails.AccommodationMedia?.[0]?.media?.file_path ||
                "/images/placeholder.png"
              }
              alt={accomodationDetails.name ?? ""}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur rounded-2xl px-5 py-4 text-right shadow-md">
                <div className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 leading-none">
                  {(+currentReservation.total_price || 0).toLocaleString(
                    "fr-FR"
                  )}{" "}
                  FCFA
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {nights} nuit{nights > 1 ? "s" : ""} •{" "}
                  {(+accomodationDetails.price_per_night || 0).toLocaleString(
                    "fr-FR"
                  )}{" "}
                  FCFA / nuit
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} />
                <span className="line-clamp-1">
                  {`${accomodationDetails.city} ${
                    accomodationDetails.district ?? ""
                  }, ${accomodationDetails.country}`}
                </span>
              </div>
              <h2 className="font-montserrat-bold text-xl md:text-2xl">
                {accomodationDetails.name}
              </h2>
              <div className="flex items-center gap-2">
                {renderStars(accomodationDetails.rating ?? 5)}{" "}
                <span className="text-sm">
                  {accomodationDetails?.rating?.toFixed?.(1) ?? "5.0"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-7">
            <div className="flex flex-wrap gap-3">
              <div className="px-3 py-2 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2">
                <CalendarRange size={16} />
                {format(currentReservation.check_in_date, "dd/MM/yyyy")} -{" "}
                {format(currentReservation.check_out_date, "dd/MM/yyyy")}
              </div>
              <div className="px-3 py-2 rounded-full bg-gray-100 text-gray-700 text-sm flex items-center gap-2">
                <Users size={16} />
                {currentReservation.number_of_guests} invité
                {currentReservation.number_of_guests > 1 ? "s" : ""}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SummaryItem
                label="Date de réservation"
                value={format(currentReservation.createdAt, "dd/MM/yyyy")}
              />
              <SummaryItem label="Nombre de nuits" value={nights} />
              <SummaryItem
                label="Prix / nuit"
                value={`${(
                  +accomodationDetails.price_per_night || 0
                ).toLocaleString("fr-FR")} FCFA`}
              />
              <SummaryItem
                label="Montant total"
                value={`${(+currentReservation.total_price || 0).toLocaleString(
                  "fr-FR"
                )} FCFA`}
                highlight
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 border-t pt-4">
              <Badge
                icon={<Bed size={16} />}
                text={`${accomodationDetails.number_of_rooms ?? 1} chambres`}
              />
              <Badge
                icon={<Bath size={16} />}
                text={`${accomodationDetails.number_of_bathrooms ?? 1} bains`}
              />
              <Badge
                icon={<Car size={16} />}
                text={`${accomodationDetails.number_of_parking ?? 0} parking`}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 mt-10 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button
            onClick={() => goToPrevStep()}
            className="font-montserrat-bold group text-gray-800 flex items-center gap-x-2"
          >
            <ChevronLeft className="group-hover:-translate-x-2 transition" />{" "}
            Retour
          </button>
          <div className="md:w-1/2">
            <Button
              onClick={onFinalSubmission}
              className="w-full bg-primary hover:!bg-amber-400 py-3 font-montserrat-bold rounded-xl"
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
      <Modal onClose={() => setOpenModal(false)} isOpen={openModal}>
        <span className="p-10">Cinet Pay Payment</span>
      </Modal>
    </div>
  );
};

export default ReservationResume;

const SummaryItem = ({ label, value, highlight = false }) => (
  <div
    className={`rounded-xl border ${
      highlight ? "border-primary/40 bg-primary/5" : "border-gray-100"
    } p-3`}
  >
    <p className="text-xs uppercase tracking-[0.08em] text-gray-500">{label}</p>
    <p
      className={`text-base font-montserrat-bold mt-1 ${
        highlight ? "text-primary" : "text-gray-800"
      }`}
    >
      {value}
    </p>
  </div>
);

const Badge = ({ icon, text }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-100 text-gray-700">
    {icon}
    <span className="text-sm font-semibold">{text}</span>
  </div>
);
