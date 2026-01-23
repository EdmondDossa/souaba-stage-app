import Image from "next/image";
import { Button } from "@/components/ui/common";
import { format, differenceInDays } from "date-fns";
import { useRouter } from "next/navigation";

function ReservationRow({ reservation, initReservationCancellation }) {
  const router = useRouter();
  const variants = {
    PENDING: {
      color: "text-primary",
      text: "En attente de validation",
    },
    CANCELLED: {
      color: "text-danger",
      text: "Refusée",
    },
    CONFIRMED: {
      color: "text-green",
      text: "Confirmée",
    },
    COMPLETED: {
      color: "text-gray-500",
      text: "Passée",
    }
  };
  
  const roomDetail =
    reservation.roomDetails?.[0] ||
    reservation.room_details?.[0] ||
    reservation.room_detail?.[0];

  // Normalize reservation data to handle both Accommodations and Hotels (rooms or hotel object)
  const accommodation =
    reservation.accommodation ||
    reservation.Accommodation ||
    reservation.accommodation_details;

  const hotelRoom =
    reservation.hotelRoom ||
    reservation.HotelRoomCategory ||
    reservation.hotel_room_category ||
    reservation.hotel_room ||
    reservation.hotelRoomCategory ||
    roomDetail?.hotelRoomCategory ||
    roomDetail?.HotelRoomCategory ||
    roomDetail?.hotel_room_category;

  const hotel =
    reservation.hotel ||
    reservation.Hotel ||
    hotelRoom?.hotel ||
    hotelRoom?.Hotel ||
    reservation.hotelRoom?.hotel ||
    reservation.hotel_room?.hotel ||
    roomDetail?.hotel ||
    roomDetail?.Hotel ||
    reservation.hotel_details;

  const isHotel = Boolean(hotel || hotelRoom);
  const hotelId =
    hotel?.hotel_id ||
    hotel?.id ||
    hotelRoom?.hotel_id ||
    hotelRoom?.hotel?.hotel_id ||
    roomDetail?.hotel?.hotel_id ||
    roomDetail?.Hotel?.hotel_id;
  const accommodationId =
    accommodation?.accommodation_id ||
    accommodation?.id ||
    reservation.accommodation_id;
  const targetId = isHotel ? hotelId : accommodationId;

  const listing = accommodation || hotelRoom || hotel || {};

  const pricePerNight =
    listing?.price_per_night ||
    hotelRoom?.price_per_night ||
    accommodation?.price_per_night ||
    reservation.price_per_night;

  const ownerPhoto =
    reservation.owner?.photo ||
    reservation.owner?.profileImage ||
    reservation.owner?.profile_image ||
    listing?.owner?.photo;

  const extractImageFromMedia = (mediaArray = []) => {
    if (!Array.isArray(mediaArray)) return null;
    const primary =
      mediaArray.find((m) => m?.is_primary)?.media?.file_path ||
      mediaArray.find((m) => m?.is_primary)?.file_path;
    if (primary) return primary;
    const first = mediaArray[0];
    return first?.media?.file_path || first?.file_path || null;
  };

  const listingImage =
    extractImageFromMedia(
      hotelRoom?.HotelRoomCategoryMedia ||
        hotelRoom?.HotelRoomMedia ||
        reservation.hotelRoom?.HotelRoomCategoryMedia ||
        reservation.hotel_room_category?.HotelRoomCategoryMedia ||
        roomDetail?.hotelRoomCategory?.HotelRoomCategoryMedia ||
        roomDetail?.HotelRoomCategory?.HotelRoomCategoryMedia ||
        roomDetail?.hotel_room_category?.HotelRoomCategoryMedia
    ) ||
    extractImageFromMedia(
      accommodation?.AccommodationMedia ||
        reservation.accommodation?.AccommodationMedia ||
        reservation.accommodation_media
    ) ||
    extractImageFromMedia(
      hotel?.HotelMedia ||
        hotelRoom?.Hotel?.HotelMedia ||
        roomDetail?.hotelRoomCategory?.Hotel?.HotelMedia ||
        roomDetail?.HotelRoomCategory?.Hotel?.HotelMedia ||
        reservation.hotel?.HotelMedia ||
        reservation.hotel_media ||
        listing?.media
    ) ||
    reservation.cover_image ||
    reservation.image ||
    ownerPhoto ||
    "/images/placeholder.png"; // Fallback image
  
  let numberOfNights = 0;
  if (reservation.check_in_date && reservation.check_out_date) {
    numberOfNights = differenceInDays(new Date(reservation.check_out_date), new Date(reservation.check_in_date));
  } else if (pricePerNight && reservation.total_price) {
    numberOfNights = Math.round(reservation.total_price / pricePerNight);
  }
  // Ensure minimum 1 night if dates are same day
  if (numberOfNights === 0) numberOfNights = 1;

  const status = reservation.status;
  const statusInfo = variants[status] || { color: 'text-gray-500', text: 'Indéfini' };

  // Adjust text for past confirmed reservations
  if (status === 'CONFIRMED' && new Date(reservation.check_in_date) < new Date()) {
    statusInfo.text = "Passée";
    statusInfo.color = "text-gray-500";
  }


  const listingName =
    listing?.name ||
    listing?.title ||
    listing?.room_category_name ||
    listing?.roomName ||
    (hotel && hotelRoom
      ? `${hotel?.name || "Hôtel"} - ${hotelRoom?.name || listing?.room_category_name || ""}`.trim()
      : hotel?.name) ||
    reservation.accommodation_name ||
    reservation.hotel_name ||
    "Détails de la réservation";

  const locationText = [
    accommodation?.address || hotel?.address,
    accommodation?.city || hotel?.city,
    accommodation?.country || hotel?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const canContact =
    (status === "PENDING" || status === "CONFIRMED") && Boolean(targetId);

  const handleContact = () => {
    if (!targetId) return;
    const typeParam = isHotel ? "HOTEL" : "ACCOMMODATION";
    const params = new URLSearchParams({
      reservationId: reservation.reservation_id,
      type: typeParam,
      targetId: targetId,
    });
    router.push(`/messages?${params.toString()}`);
  };

  return (
    <div className="flex gap-x-8 flex-col  justify-center items-center md:flex-row md:justify-between ">
      <div className="flex flex-col justify-center md:flex-row  md:justify-between items-center gap-x-4">
        <div className="w-60 h-60 self-start md:w-24 md:h-24">
          <Image
            className="w-full h-full rounded-lg object-cover"
            src={listingImage || "/images/placeholder.png"}
            alt={listingName}
            width={400}
            height={400}
            onError={(e) => (e.currentTarget.src = "/images/placeholder.png")}
          />
        </div>
        <div>
          <h2 className="font-montserrat-bold text-lg my-5 md:my-1 text-gray-900">
            {listingName}
          </h2>
          {locationText && (
            <p className="text-gray-500 text-sm font-montserrat-medium mb-2">
              {locationText}
            </p>
          )}
          <ul className="flex flex-col md:flex-row justify-between gap-x-5 text-sm [&_li]:mb-3 ">
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Date d'arrivée:
              </strong>
              {reservation.check_in_date ? format(new Date(reservation.check_in_date), "dd/MM/yyyy") : 'N/A'}
            </li>
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Nombre de nuits:
              </strong>
              {numberOfNights > 0 ? numberOfNights : 'N/A'}
            </li>
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Nombre d'invités:
              </strong>
              {reservation.number_of_guests} personnes
            </li>
          </ul>
          <div className="font-montserrat-bold text-lg text-primary mt-1 mb-3 md:mb-1">
            {" "}
            {reservation.total_price} FCFA{" "}
          </div>
        </div>
      </div>
      <div className="min-w-24 ms-10 lg:ms-0 self-start md:self-center mt-4 md:mt-0 flex flex-col items-start md:items-end gap-3">
        {canContact && (
          <button
            onClick={handleContact}
            className="text-sm px-4 py-2 border border-primary text-primary rounded-3xl hover:bg-primary/10 transition"
          >
            Contacter l&apos;hôte
          </button>
        )}
        {status === "PENDING" ||
        (status === "CONFIRMED" && new Date(reservation.check_in_date) > new Date()) ? (
          <div>
            <Button
              onClick={() =>
                initReservationCancellation(reservation.reservation_id)
              }
              className="py-2 px-15 text-sm bg-danger rounded-3xl hover:bg-red-500 transition"
            >
              Annuler
            </Button>
          </div>
        ) : (
          <span
            className={`font-montserrat-bold font-bold text-sm  ${
              statusInfo.color
            }`}
          >
            {" "}
            {statusInfo.text}{" "}
          </span>
        )}
      </div>
    </div>
  );
}

export { ReservationRow };
