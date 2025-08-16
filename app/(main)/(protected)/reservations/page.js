"use client";
import { Button } from "@/components/ui/common";
import propertyOne from "@/public/images/new-property1.jpg";
import propertyTwo from "@/public/images/new-property2.jpg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";

const Reservation = () => {
  const dumpReservations = [
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
      category: "Prochain",
    },
  ];

  const categories = ["Prochain", "En attente", "Refuser", "Passé"];
  const [currentCategory, setCurrentCategory] = useState("En attente");
  const [cancelReason, setCancelReason] = useState("");
  const ref = useRef();

  const [reservations, setReservations] = useState(dumpReservations);
  const [isCancellingReservation, setCancellingReservation] = useState(false);
  const MAX_CANCEL_REASON_LENGTH = 255;

  function handleCancel(reservationId) {
    //
  }

  function handleChange(e) {
    if (e.target.value.length <= MAX_CANCEL_REASON_LENGTH)
      setCancelReason(e.target.value);
  }

  const cancelReservationCancelling = () => setCancellingReservation(false);

  // useEffect(() => {
  //   function handleClickOutside(e) {
  //    if(ref?.current && !ref.current.contains(e.target)){
  //       cancelReservationCancelling();
  //    }
  //   }
  //   window.addEventListener("click", handleClickOutside);
  //   return () => window.removeEventListener("click", handleClickOutside);
  // }, []);

  return (
    <>
      <div className={`max-w-5xl mx-auto mt-10 `}>
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
                <div
                  key={reservation.id}
                  className="even:bg-gray-100 flex items-center justify-between my-5 p-4"
                >
                  <div className="flex gap-x-8 items-center">
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
                        <li>
                          <strong className="text-gray-600 font-montserrat-medium font-bold">
                            Date d'arrivée :
                          </strong>
                          {reservation.arrival_date}
                        </li>
                        <li>
                          <strong className="text-gray-600 font-montserrat-medium font-bold">
                            Nombre de nuits :
                          </strong>
                          {reservation.night_number}
                        </li>
                        <li>
                          <strong className="text-gray-600 font-montserrat-medium font-bold">
                            Nombre d'invités :
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
                  <div>
                    <Button
                      onClick={() => setCancellingReservation(true)}
                      className="py-2 px-6 bg-danger rounded-3xl hover:bg-red-500 transition"
                    >
                      Annuler
                    </Button>
                  </div>
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
            className="fixed inset-0 ext-sm translate-y-1/2 pt-8  left-[calc(100vw/2-512px/2)] w-lg z-50 h-96 bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="h-full mx-auto w-[80%] ">
              <label
                className="text-sm font-montserrat-medium"
                htmlFor="cancel-reason"
              >
                Entrer le motif de votre annulation
              </label>
              <textarea
                className="w-full block bg-[#FBFBFB] border  border-gray-200 rounded-lg  resize-none p-3 ring-2 ring-white outline-0 focus:ring-primary h-2/3"
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
