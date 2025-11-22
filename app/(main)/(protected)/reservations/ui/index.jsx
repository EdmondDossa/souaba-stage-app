import Image from "next/image";
import { Button } from "@/components/ui/common";

function ReservationRow({ reservation, cancelReservation }) {
  const variants = {
    "En attente": {
      color: "text-primary",
      text: "En attente de validation",
    },
    Refuser: {
      color: "text-danger",
      text: "Refuser",
    },
    Passé: {
      color: "text-green",
      text: "Passé",
    },
  };

  return (
    <div className="flex gap-x-8 flex-col justify-center md:flex-row md:justify-between items-center">
      <div className="flex flex-col justify-center md:flex-row  md:justify-between items-center gap-x-4">
        <div className="w-60 h-60 self-start md:w-24 md:h-24">
          <Image
            className="w-full h-full rounded-lg object-cover"
            src={reservation.img}
            alt=""
          />
        </div>
        <div>
          <h2 className="font-montserrat-bold text-lg my-5 md:my-1 text-gray-900">
            {reservation.name}
          </h2>
          <ul className="flex flex-col md:flex-row justify-between gap-x-5 text-sm [&_li]:mb-3 ">
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Date d'arrivée:
              </strong>
              {reservation.arrival_date}
            </li>
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Nombre de nuits:
              </strong>
              {reservation.night_number}
            </li>
            <li className="text-gray-400 font-montserrat-medium">
              <strong className="text-gray-600 font-montserrat-medium font-bold me-1">
                Nombre d'invités:
              </strong>
              {reservation.guests} personnes
            </li>
          </ul>
          <div className="font-montserrat-bold text-lg text-primary mt-1 mb-3 md:mb-1">
            {" "}
            {reservation.cost.toLocaleString("FR-fr")} FCFA{" "}
          </div>
        </div>
      </div>
      <div className="min-w-24 self-start md:self-center mt-4 md:mt-0">
        {reservation.category === "Prochain" ? (
          <div>
            <Button
              onClick={cancelReservation}
              className="py-2 px-15 text-sm bg-danger rounded-3xl hover:bg-red-500 transition"
            >
              Annuler
            </Button>
          </div>
        ) : (
          <span
            className={`font-montserrat-bold font-bold text-sm  ${
              variants[reservation.category].color
            }`}
          >
            {" "}
            {variants[reservation.category].text}{" "}
          </span>
        )}
      </div>
    </div>
  );
}

export { ReservationRow };
