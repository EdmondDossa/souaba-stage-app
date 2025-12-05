import Image from "next/image";
import { Button } from "@/components/ui/common";
import { format } from "date-fns";

function ReservationRow({ reservation, initReservationCancellation }) {
  const variants = {
    PENDING: {
      color: "text-primary",
      text: "En attente de validation",
    },
    CANCELLED: {
      color: "text-danger",
      text: "Refuser",
    },
    CONFIRMED: {
      color: "text-green",
      text: "Passé",
    },
  };

  console.log(reservation.reservation_id);
  

  const accommodationImage =
    reservation.accommodation.AccommodationMedia[0].media.file_path;

  return (
    <div className="flex gap-x-8 flex-col  justify-center items-center md:flex-row md:justify-between ">
      <div className="flex flex-col justify-center md:flex-row  md:justify-between items-center gap-x-4">
        <div className="w-60 h-60 self-start md:w-24 md:h-24">
          <Image
            className="w-full h-full rounded-lg object-cover"
            src={accommodationImage}
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div>
          <h2 className="font-montserrat-bold text-lg my-5 md:my-1 text-gray-900">
            {reservation.accommodation.name}
          </h2>
          <ul className="flex flex-col md:flex-row justify-between gap-x-5 text-sm [&_li]:mb-3 ">
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Date d'arrivée:
              </strong>
              {format(reservation.check_in_date, "dd/MM/yyyy")}
            </li>
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Nombre de nuits:
              </strong>
              {reservation.total_price /
                reservation.accommodation.price_per_night}
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
      <div className="min-w-24 ms-10 lg:ms-0 self-start md:self-center mt-4 md:mt-0">
        {reservation.status === "PENDING" ? (
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
              variants[reservation.status].color
            }`}
          >
            {" "}
            {variants[reservation.status].text}{" "}
          </span>
        )}
      </div>
    </div>
  );
}

export { ReservationRow };
