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
import useAuthContext from "@/context/auth";
import { submitReservation } from "./reservationApi";

const ReservationResume = ({
  goToNextStep,
  goToPrevStep,
  formValues,
  completeFlow,
}) => {
  const http = getAxiosInstance();
  const [openModal, setOpenModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingGeniusPayPayment, setIsCreatingGeniusPayPayment] =
    useState(false);

  const [listingDetails, setListingDetails] = useState();
  const [currentReservation, setCurrentReservation] = useState();
  const [pendingReservation, setPendingReservation] = useState(null);

  const { user, fetchUser } = useAuthContext();
  const searchParams = useSearchParams();

  const identityFrontPath =
    user?.profile?.identity_card_front || user?.identity_card_front;
  const identityBackPath =
    user?.profile?.identity_card_back || user?.identity_card_back;
  const hasIdentity = Boolean(identityFrontPath && identityBackPath);

  const normalizeMediaArray = (mediaArray = []) => {
    const list = Array.isArray(mediaArray) ? mediaArray : [];
    if (!list.length) {
      return [
        {
          media: { file_path: "/images/acceuil-first-image.webp" },
          is_primary: true,
        },
      ];
    }
    return list.map((item) => {
      if (item?.media?.file_path) return item;
      const filePath =
        item?.file_path || (typeof item === "string" ? item : undefined);
      return {
        ...item,
        media: {
          ...(item?.media || {}),
          file_path: filePath || "/images/acceuil-first-image.webp",
        },
        is_primary: item?.is_primary ?? false,
      };
    });
  };

  const buildListingDetailsFromReservation = (reservation) => {
    if (!reservation) return null;

    const roomDetail =
      reservation.roomDetails?.[0] ||
      reservation.room_details?.[0] ||
      reservation.room_detail?.[0];

    const accommodation =
      reservation.accommodation ||
      reservation.Accommodation ||
      reservation.accommodation_details;

    const hotelRoomCategory =
      reservation.hotelRoomCategory ||
      reservation.HotelRoomCategory ||
      reservation.hotel_room_category ||
      reservation.hotelRoom ||
      reservation.hotel_room ||
      roomDetail?.hotelRoomCategory ||
      roomDetail?.HotelRoomCategory ||
      roomDetail?.hotel_room_category;

    const hotel =
      reservation.hotel ||
      reservation.Hotel ||
      hotelRoomCategory?.Hotel ||
      hotelRoomCategory?.hotel ||
      roomDetail?.hotel ||
      roomDetail?.Hotel ||
      reservation.hotel_details;

    const mediaSource =
      accommodation?.AccommodationMedia ||
      accommodation?.accommodation_media ||
      hotelRoomCategory?.HotelRoomCategoryMedia ||
      hotelRoomCategory?.hotel_room_category_media ||
      hotel?.HotelMedia ||
      hotel?.hotel_media ||
      [];

    return {
      name:
        accommodation?.name ||
        hotelRoomCategory?.name ||
        hotel?.name ||
        "Hébergement",
      description:
        accommodation?.description ||
        hotelRoomCategory?.description ||
        hotel?.description ||
        "",
      AccommodationMedia: normalizeMediaArray(mediaSource),
      amenities:
        accommodation?.amenities ||
        hotelRoomCategory?.amenities ||
        hotel?.amenities ||
        [],
      price_per_night:
        accommodation?.price_per_night ||
        hotelRoomCategory?.price_per_night ||
        reservation?.price_per_night ||
        0,
      number_of_rooms:
        accommodation?.number_of_rooms ||
        hotelRoomCategory?.number_of_rooms ||
        0,
      number_of_bathrooms:
        accommodation?.number_of_bathrooms ||
        hotelRoomCategory?.number_of_bathrooms ||
        0,
      number_of_parking: accommodation?.number_of_parking || 0,
      address: accommodation?.address || hotel?.address || "",
      city: accommodation?.city || hotel?.city || "",
      country: accommodation?.country || hotel?.country || "",
      district: accommodation?.district || hotel?.district || "",
      rating:
        accommodation?.avgRating ||
        hotel?.avgRating ||
        hotelRoomCategory?.avgRating ||
        5,
    };
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pending = sessionStorage.getItem("pendingReservation");
    if (pending) {
      try {
        setPendingReservation(JSON.parse(pending));
      } catch (error) {
        console.error("Invalid pending reservation payload", error);
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!pendingReservation) return;
      const type = pendingReservation.type;
      const checkIn = pendingReservation.checkInDate;
      const checkOut = pendingReservation.checkOutDate;
      const numberOfGuests = pendingReservation.numberOfGuests;
      const totalPrice = pendingReservation.totalPrice;
      setCurrentReservation({
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: numberOfGuests,
        total_price: totalPrice,
        createdAt: new Date().toISOString(),
      });

      try {
        if (type === "accommodation" && pendingReservation.accommodationId) {
          const accommodation = await http.get(
            `/accommodations?accommodation_id=${pendingReservation.accommodationId}`,
          );
          const foundAccomodation = accommodation.data?.data?.[0];
          if (foundAccomodation) {
            setListingDetails(foundAccomodation);
            return;
          }
        }

        if (type === "hotel" && pendingReservation.hotelId) {
          const hotelResponse = await http.get(
            `/hotels?hotel_id=${pendingReservation.hotelId}&limit=1`,
          );
          const payload = hotelResponse?.data || {};
          const hotel =
            payload?.data?.[0] || payload?.data || payload?.hotel || null;
          if (hotel) {
            setListingDetails({
              ...hotel,
              price_per_night:
                pendingReservation.totalPerNight ??
                pendingReservation.totalPrice ??
                hotel?.price_per_night,
            });
            return;
          }
        }
      } catch (error) {
        toast.error("Une erreur est survenue");
        console.log(error);
      }
    }
    fetchData();
  }, [pendingReservation]);

  useEffect(() => {
    fetchUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedPaymentMethod = (
    formValues?.paymentMethod ||
    searchParams.get("payment") ||
    "WALLET"
  ).toUpperCase();
  const isGeniusPaySelected = selectedPaymentMethod === "WALLET";

  const nights = useMemo(() => {
    if (
      !currentReservation?.check_in_date ||
      !currentReservation?.check_out_date
    )
      return 1;
    const diff = differenceInDays(
      new Date(currentReservation.check_out_date),
      new Date(currentReservation.check_in_date),
    );
    return Math.max(diff, 1);
  }, [currentReservation?.check_in_date, currentReservation?.check_out_date]);

  if (!listingDetails || !currentReservation) return null;

  async function onFinalSubmission() {
    if (!hasIdentity) {
      goToNextStep();
      return;
    }
    if (isGeniusPaySelected) {
      setOpenModal(true);
      return;
    }

    if (!pendingReservation) {
      goToNextStep();
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitReservation(
        http,
        pendingReservation,
        formValues?.guest,
        selectedPaymentMethod,
      );
      if (result) {
        completeFlow();
      }
    } catch (error) {
      console.log(error);
      toast.error("Une erreur est survenue lors de la réservation!");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCreateGeniusPayPayment = async () => {
    if (!pendingReservation || !currentReservation || !listingDetails) {
      toast.error("Impossible de créer le paiement GeniusPay.");
      return;
    }

    const reservationResult = await submitReservation(
      http,
      pendingReservation,
      formValues?.guest,
      selectedPaymentMethod
    );
    if (!reservationResult) {
      toast.error("Impossible de créer la réservation GeniusPay.");
      return;
    }

    const reservationPayload =
      reservationResult?.data ||
      reservationResult?.reservation ||
      reservationResult ||
      {};

    const serverReservationId =
      reservationPayload?.reservation_id ||
      reservationPayload?.id ||
      reservationPayload?.reservation?.reservation_id ||
      reservationPayload?.reservation?.id ||
      pendingReservation?.reservationId;

    const amount = Number(
      reservationPayload?.total_price ??
        reservationPayload?.totalPrice ??
        currentReservation?.total_price ??
        pendingReservation?.totalPrice ??
        0
    );
    if (!amount) {
      toast.error("Montant invalide pour le paiement GeniusPay.");
      return;
    }

    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL || "";

    const baseReturnParams = new URLSearchParams({
      geniuspay_status: "success",
      reservationId: serverReservationId,
    });
    const successUrl = `${origin}/make-reservation?${baseReturnParams.toString()}`;

    const failureParams = new URLSearchParams({
      geniuspay_status: "failed",
      reservationId: serverReservationId,
    });
    const errorUrl = `${origin}/make-reservation?${failureParams.toString()}`;

    const metadata = {
      reservation_id: serverReservationId,
    };
    const partnerId =
      pendingReservation?.partnerId ||
      listingDetails?.partner_id ||
      listingDetails?.partnerId;
    if (partnerId) {
      metadata.partner_id = partnerId;
    }

    const customerEmail = formValues?.guest?.email || user?.email || "";
    const customerPhone =
      formValues?.guest?.phone || user?.phone || user?.contact || "";

    const currency = "XOF";
    const description = `Réservation Souaba #${serverReservationId ?? ""}`;

    const successUrlWithStatus = successUrl;
    const errorUrlWithStatus = errorUrl;

    const payload = {
      amount,
      currency,
      description,
      reservationId: serverReservationId,
      metadata,
      customer: {
        email: customerEmail,
        phone: customerPhone,
      },
      successUrl: successUrlWithStatus,
      errorUrl: errorUrlWithStatus,
    };

    let checkoutWindow;
    if (typeof window !== "undefined") {
      checkoutWindow = window.open("", "_blank", "noopener,noreferrer");
    }

    try {
      setIsCreatingGeniusPayPayment(true);
      const response = await http.post("/payments", payload, {
        headers: { "Content-Type": "application/json" },
      });
      const transaction =
        response?.data?.data || response?.data || response?.paymentTransaction;
      const paymentUrl =
        transaction?.payment_url ||
        transaction?.checkout_url ||
        transaction?.paymentUrl ||
        transaction?.checkoutUrl;
      const reference =
        transaction?.reference ||
        transaction?.payment_reference ||
        transaction?.paymentReference ||
        response?.data?.reference;

      if (!paymentUrl) {
        throw new Error("Aucune URL de paiement GeniusPay n’a été renvoyée.");
      }

      const savedReference = reference || pendingReservation?.reservationId;
      if (typeof window !== "undefined" && savedReference) {
        sessionStorage.setItem("pendingPaymentReference", savedReference);
      }
      setOpenModal(false);
      if (checkoutWindow) {
        checkoutWindow.location.href = paymentUrl;
      } else if (typeof window !== "undefined") {
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
      }
    } catch (error) {
      console.error("Créer GeniusPay Payment", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Impossible de créer le paiement GeniusPay.";
      toast.error(errorMessage);
    } finally {
      setIsCreatingGeniusPayPayment(false);
    }
  };

  const listingRating = listingDetails?.rating ?? listingDetails?.avgRating;
  const pickPrimaryImage = (items = []) => {
    const list = Array.isArray(items) ? items : [];
    if (!list.length) return "";
    const primary = list.find((item) => item?.is_primary);
    return (
      primary?.media?.file_path ||
      primary?.file_path ||
      list[0]?.media?.file_path ||
      list[0]?.file_path ||
      ""
    );
  };
  const listingImage =
    listingDetails?.AccommodationMedia?.[0]?.media?.file_path ||
    pickPrimaryImage(listingDetails?.HotelMedia) ||
    pickPrimaryImage(listingDetails?.hotel_media) ||
    listingDetails?.images?.[0]?.file_path ||
    listingDetails?.primaryImage ||
    "/images/placeholder.png";

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
              {(+listingDetails.price_per_night || 0).toLocaleString("fr-FR")}{" "}
              FCFA / nuit
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="relative">
            <Image
              width={1600}
              height={900}
              className="w-full h-[260px] sm:h-[320px] md:h-[520px] object-cover"
              src={listingImage}
              alt={listingDetails.name ?? ""}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute top-4 right-4">
              <div className="bg-white/90 backdrop-blur rounded-2xl px-5 py-4 text-right shadow-md">
                <div className="text-2xl md:text-3xl font-montserrat-bold text-gray-900 leading-none">
                  {(+currentReservation.total_price || 0).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {nights} nuit{nights > 1 ? "s" : ""} •{" "}
                  {(+listingDetails.price_per_night || 0).toLocaleString(
                    "fr-FR",
                  )}{" "}
                  FCFA / nuit
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin size={16} />
                <span className="line-clamp-1">
                  {`${listingDetails.city} ${
                    listingDetails.district ?? ""
                  }, ${listingDetails.country}`}
                </span>
              </div>
              <h2 className="font-montserrat-bold text-xl md:text-2xl">
                {listingDetails.name}
              </h2>
              <div className="flex items-center gap-2">
                {renderStars(listingRating ?? 5)}{" "}
                <span className="text-sm">
                  {listingRating?.toFixed?.(1) ?? "5.0"}
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
                value={`${(+listingDetails.price_per_night || 0).toLocaleString(
                  "fr-FR",
                )} FCFA`}
              />
              <SummaryItem
                label="Montant total"
                value={`${(+currentReservation.total_price || 0).toLocaleString(
                  "fr-FR",
                )} FCFA`}
                highlight
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 border-t pt-4">
              <Badge
                icon={<Bed size={16} />}
                text={`${listingDetails.number_of_rooms ?? 1} chambres`}
              />
              <Badge
                icon={<Bath size={16} />}
                text={`${listingDetails.number_of_bathrooms ?? 1} bains`}
              />
              <Badge
                icon={<Car size={16} />}
                text={`${listingDetails.number_of_parking ?? 0} parking`}
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
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full bg-primary hover:!bg-amber-400 py-3 font-montserrat-bold rounded-xl"
            >
              Continuer
            </Button>
          </div>
        </div>
      </div>
      <Modal onClose={() => setOpenModal(false)} isOpen={openModal}>
        <div className="p-6 md:p-8 space-y-4">
          <div>
            <h3 className="text-xl font-montserrat-bold text-gray-900">
              Paiement GeniusPay
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Finalisez votre paiement via notre agrégateur GeniusPay.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleCreateGeniusPayPayment}
              isLoading={isCreatingGeniusPayPayment}
              disabled={isCreatingGeniusPayPayment}
              className="bg-primary hover:!bg-amber-400 py-2.5 font-montserrat-bold rounded-xl w-full"
            >
              Payer avec GeniusPay
            </Button>
            <Button
              onClick={() => setOpenModal(false)}
              variant="secondary"
              disabled={isCreatingGeniusPayPayment}
              className="border border-gray-200 py-2.5 font-montserrat-bold rounded-xl w-full"
            >
              Annuler
            </Button>
          </div>
        </div>
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
