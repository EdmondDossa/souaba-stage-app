"use client";
import propertyOne from "@/public/images/new-property1.jpg";
import propertyTwo from "@/public/images/new-property2.jpg";
import { useEffect, useMemo, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { ReservationRow } from "./ui";

const Reservation = () => {
  
  const dumpReservations = useMemo(() => [
    {
      id: 1,
      name: "Appartement entièrement meublé",
      img: propertyOne,
      arrival_date: "12 Mars 2021",
      night_number: 3,
      guests: 5,
      cost: 900_000,
      category: "Prochain",
    },
    {
      id: 2,
      name: "Appartement double avec 3 pièces",
      img: propertyTwo,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 900_000,
      category: "Prochain",
    },
    {
      id: 3,
      name: "Appartement rouge avec 8 salons",
      img: propertyOne,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 900_000,
      category: "Prochain",
    },
    {
      id: 4,
      name: "Appartement double avec 3 pièces",
      img: propertyTwo,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 1_900_000,
      category: "Refuser",
    },
    {
      id: 5,
      name: "Appartement double avec 3 pièces",
      img: propertyTwo,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 1_900_000,
      category: "En attente",
    },
    {
      id: 6,
      name: "Appartement double avec 3 pièces",
      img: propertyTwo,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 1_900_000,
      category: "Passé",
    },
    {
      id: 7,
      name: "Appartement double avec 3 pièces",
      img: propertyTwo,
      arrival_date: "12 Mars 2024",
      night_number: 3,
      guests: 5,
      cost: 1_900_000,
      category: "Refuser",
    },
  ], []);
  
  const ref = useRef();

  const categories = ["Prochain", "En attente", "Refuser", "Passé"];
  const [currentCategory, setCurrentCategory] = useState("Prochain");

  const [cancelReason, setCancelReason] = useState("");
  const MAX_CANCEL_REASON_LENGTH = 255;
  
  const [isCancellingReservation, setCancellingReservation] = useState(false);
  const cancelReservation = () => setCancellingReservation(true);
  const cancelReservationCancelling = () => setCancellingReservation(false);

  const [reservations, setReservations] = useState(dumpReservations);


  function handleCancel(reservationId) {
    //
  }

  function handleChange(e) {
    if (e.target.value.length <= MAX_CANCEL_REASON_LENGTH)
      setCancelReason(e.target.value);
  }
  useEffect(() => {
    const filteredReservations = dumpReservations.filter(
      (reservation) => reservation.category === currentCategory
    );
    setReservations(filteredReservations);
  }, [currentCategory, dumpReservations]);

  return (
    <>
      <div className={`max-w-6xl mx-auto mt-10 `}>
        <h1 className="text-4xl font-montserrat-bold text-gray-700">
          Réservations
        </h1>
        <section className="mt-8">
          <nav>
            <ul className="flex items-center justify-between w-[50%] relative">
              {categories.map((category) => (
                <li
                  onClick={() => setCurrentCategory(category)}
                  className={`text-gray-700 font-montserrat-bold py-4 border-b-[3px] px-4 cursor-pointer transition-all ease-in duration-300 whitespace-nowrap ${
                    currentCategory === category
                      ? "border-b-gray-800"
                      : "border-b-white"
                  }`}
                  key={category}
                >
                  {category}
                </li>
              ))}
            </ul>
          </nav>
          <section className="border-t border-t-gray-200">
            {reservations.map((reservation) => {
              return (
                <div key={reservation.id} className="my-5 p-4 hover:bg-gray-100 transition">
                  <ReservationRow
                    cancelReservation={cancelReservation}
                    reservation={reservation}
                  />
                </div>
              );
            })}
          </section>
        </section>
      </div>
      {isCancellingReservation && (
        <>
          <form
            ref={ref}
            className="fixed inset-0 text-sm translate-y-1/2 pt-8  left-[calc(100vw/2-512px/2)] w-lg z-50 h-96 bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="h-full mx-auto w-[80%] ">
              <label
                className="text-sm"
                htmlFor="cancel-reason"
              >
                Entrer le motif de votre annulation
              </label>
              <textarea
                className="w-full block mt-1 bg-[#FBFBFB] border  border-gray-200 rounded-lg  resize-none p-3 ring-2 ring-white outline-0 focus:ring-primary h-2/3"
                name="cancel-reason"
                id="cancel-reason"
                value={cancelReason}
                onChange={handleChange}
                maxLength={MAX_CANCEL_REASON_LENGTH}
              />
              <span className="block text-sm text-end mt-2">
                {" "}
                {`${cancelReason.length}/${MAX_CANCEL_REASON_LENGTH} caractères`}
              </span>
              <div className="flex items-center justify-end gap-x-5 mt-5">
                <button
                  type="reset"
                  onClick={cancelReservationCancelling}
                  className="font-montserrat-medium py-1 px-3 rounded-md text-white bg-[#C94C4C] hover:bg-red-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="font-montserrat-medium py-1 px-3 rounded-md text-white bg-primary hover:bg-amber-500"
                >
                  Envoyer
                </button>
              </div>
            </div>
            <button
              onClick={cancelReservationCancelling}
              className="absolute m-2 top-0 right-0 text-red-500"
            >
              {" "}
              <IoMdCloseCircle className="w-5 h-5" />{" "}
            </button>
          </form>
          <div className="min-h-screen transition-all ease-in-out z-40 w-screen fixed top-0 h-full border-gray-200 backdrop-brightness-60"></div>
        </>
      )}
    </>
  );
};

export default Reservation;
