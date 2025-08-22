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
    <div className="flex gap-x-8 items-center justify-between">
      <div className="flex justify-between items-center gap-x-4">
        <div className="w-24 h-24">
          <Image
            className="w-full h-full rounded-lg object-cover"
            src={reservation.img}
            alt=""
          />
        </div>
        <div>
          <h2 className="font-montserrat-bold mb-1 text-gray-700">
            {reservation.name}
          </h2>
          <ul className="flex justify-between gap-x-5 text-sm">
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
          <div className="font-montserrat-medium mt-1 text-gray-700">
            {" "}
            {reservation.cost.toLocaleString("FR-fr")} FCFA{" "}
          </div>
        </div>
      </div>
      <div className="min-w-24">
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
