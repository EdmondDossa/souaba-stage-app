"use client";
import { useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { ReservationRow } from "./ui";
import Image from "next/image";
import Paginator from "@/components/ui/common/Paginator";
import getAxiosInstance from "@/lib/request";
import useAuthContext from "@/context/auth";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const Reservation = () => {
  const http = getAxiosInstance();

  const { user } = useAuthContext();

  const MOBILE_MAX_RESERVATION_ITEM_PER_PAGE = 3;

  const ref = useRef();

  const categories = [
    {
      text: "Prochain",
      value: "CONFIRMED",
    },
    {
      text: "En attente",
      value: "PENDING",
    },
    {
      text: "Refuser",
      value: "CANCELLED",
    },
    {
      text: "Passé",
      value: "CONFIRMED",
    },
  ];
  const [currentCategory, setCurrentCategory] = useState(0);

  const [cancelReason, setCancelReason] = useState("");
  const MAX_CANCEL_REASON_LENGTH = 255;

  const initReservationCancellation = (id) => setReservationToCancel(id);
  const abortReservationCancellation = () => setReservationToCancel(null);

  async function handleCancel(e) {
    try {
      e.preventDefault();
      await http.patch(`/reservations/${reservationToCancel}/status`, {
        status: "CANCELLED",
      });
      toast.success("Réservation annulée");
      setReservationToCancel(null);
      await fetchData("CANCELLED");
    } catch (error) {
      toast.error("Une erreur est survenue");
    }
  }

  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [reservations, setReservations] = useState([]);

  const [isLoading, setLoading] = useState(false);

  function handleChange(e) {
    if (e.target.value.length <= MAX_CANCEL_REASON_LENGTH)
      setCancelReason(e.target.value);
  }

  useEffect(() => {
    fetchData(categories[currentCategory].value);
  }, [categories[currentCategory].value]);

  async function fetchData(status) {
    try {
      setLoading(true);
      const { data } = await http.get(
        `/reservations?userId=${user.user_id}&status=${status}`
      );
      if (!data) return;
      setReservations(data.data);
    } catch (error) {
      console.log(error);
      toast.error(
        "Une erreur est survenue lors de la récupération des réservations"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={`max-w-6xl mx-auto mt-32 md:mt-10 md:w-full w-[90%]`}>
        <h1 className="text-2xl text-center md:text-4xl font-montserrat-bold text-gray-700">
          Mes réservations
        </h1>
        <div className="md:hidden flex flex-col items-center justify-center">
          <Image
            alt=""
            src="/images/reservation-hotel-illustration.png"
            width={590}
            height={394}
          />
        </div>
        <section className="mt-8">
          <nav>
            <ul className="flex items-center justify-between w-full md:w-[50%] relative">
              {categories.map((category, i) => (
                <li
                  onClick={() => setCurrentCategory(i)}
                  className={`text-gray-700 text-[13px] md:text-md font-montserrat-bold py-2 border-b-[4px] px-4 cursor-pointer transition-all ease-in duration-300 whitespace-nowrap ${
                    currentCategory === i
                      ? "border-primary bg-primary/15"
                      : "border-b-white"
                  }`}
                  key={category.text}
                >
                  {category.text}
                </li>
              ))}
            </ul>
          </nav>
          <section className="border-t border-t-gray-200 min-h-screen">
            {!isLoading ? (
              reservations.length > 0 ? (
                reservations.map((reservation) => {
                  return (
                    <div
                      key={reservation.reservation_id}
                      className="my-5 p-4 md:hover:bg-gray-100 transition"
                    >
                      <ReservationRow
                        initReservationCancellation={
                          initReservationCancellation
                        }
                        reservation={reservation}
                      />
                    </div>
                  );
                })
              ) : (
                <h2 className="md:text-3xl text-xl text-gray-400 text-center mt-10 font-montserrat-bold">
                  Aucune réservation classée «{" "}
                  {categories[currentCategory].text} » <span> </span>
                </h2>
              )
            ) : (
              <div className={`flex items-center mt-15 justify-center`}>
                <div>
                  <LoaderCircle
                    size={40}
                    className={`animate-spin text-primary`}
                  />
                </div>
              </div>
            )}
          </section>
          <Paginator
            defaultPage={1}
            onPageChange={() => {}}
            nextPageTitle="Voir plus"
            totalPages={Math.ceil(
              reservations.length / MOBILE_MAX_RESERVATION_ITEM_PER_PAGE
            )}
          />
        </section>
      </div>

      {reservationToCancel && (
        <>
          <form
            ref={ref}
            className="fixed inset-0 text-sm translate-y-1/2 pt-8 left-[calc(100vw/2-314px/2)] md:left-[calc(100vw/2-512px/2)] w-[314px] md:w-lg z-50 h-80 md:h-96 bg-white border border-gray-200 rounded-lg p-3"
          >
            <div className="h-full mx-auto w-[80%] ">
              <label className="text-[12px] md:text-sm" htmlFor="cancel-reason">
                Entrer le motif de votre annulation
              </label>
              <textarea
                className="w-full block mt-2 bg-[#FBFBFB] border border-gray-200 rounded-lg  resize-none p-3 ring-2 ring-white outline-0 focus:ring-primary  h-[140px] md:h-2/3"
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
              <div className="flex items-center justify-center md:justify-end gap-x-5 mt-5">
                <button
                  type="reset"
                  onClick={abortReservationCancellation}
                  className="font-montserrat-medium py-1 px-3 rounded-md text-white bg-[#C94C4C] hover:bg-red-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  onClick={handleCancel}
                  className="font-montserrat-medium py-1 px-3 rounded-md text-white bg-primary hover:bg-amber-500"
                >
                  Envoyer
                </button>
              </div>
            </div>
            <button className="absolute m-2 top-0 right-0 text-red-500">
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
