"use client";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useSearchParams } from "next/navigation";
import { IoMdCloseCircle } from "react-icons/io";
import { ReservationRow } from "./ui";
import Image from "next/image";
import Paginator from "@/components/ui/common/Paginator";
import getAxiosInstance from "@/lib/request";
import useAuthContext from "@/context/auth";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { isPast, isFuture } from "date-fns";

function ReservationsContent() {
  const http = useMemo(() => getAxiosInstance(), []);
  const { user } = useAuthContext();
  const searchParams = useSearchParams();

  const MOBILE_MAX_RESERVATION_ITEM_PER_PAGE = 3;

  const ref = useRef();

  const categories = useMemo(
    () => [
      {
        text: "Prochain",
        value: "CONFIRMED",
        filter: (r) => isFuture(new Date(r.check_in_date)),
      },
      {
        text: "En attente",
        value: "PENDING",
      },
      {
        text: "Refusé",
        value: "CANCELLED",
      },
      {
        text: "Passé",
        value: "CONFIRMED",
        filter: (r) => isPast(new Date(r.check_in_date)),
      },
    ],
    []
  );
  const [currentCategory, setCurrentCategory] = useState(0);

  const [cancelReasonType, setCancelReasonType] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [reasonSearch, setReasonSearch] = useState("");
  const MAX_CANCEL_REASON_LENGTH = 255;
  const CANCELLATION_REASONS = [
    { value: "change_of_plan", label: "Changement de programme" },
    { value: "health_issue", label: "Soucis de santé" },
    { value: "family_emergency", label: "Urgence familiale" },
    { value: "natural_disaster", label: "Catastrophe naturelle" },
    { value: "travel_restriction", label: "Restriction gouvernementale" },
    { value: "payment_issue", label: "Problème de paiement" },
    { value: "work_commitment", label: "Imprévu professionnel" },
    { value: "documentation_loss", label: "Documents perdus (passeport)" },
    { value: "military_deployment", label: "Mobilisation / service militaire" },
    { value: "transport_disruption", label: "Grève ou annulation du transport" },
    { value: "home_damage", label: "Dégâts à domicile" },
    { value: "legal_obligation", label: "Obligation judiciaire" },
    { value: "budget_issue", label: "Problème budgétaire" },
    { value: "other", label: "Autre raison" },
  ];

  const [reservationToCancel, setReservationToCancel] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const initReservationCancellation = (id) => setReservationToCancel(id);
  const abortReservationCancellation = () => {
    setReservationToCancel(null);
    setCancelReasonType("");
    setCustomCancelReason("");
    setReasonError(false);
  };
  const handleReasonSelect = (value) => {
    setCancelReasonType(value);
    setReasonSearch("");
    if (value !== "other") {
      setCustomCancelReason("");
    }
    if (reasonError) {
      setReasonError(false);
    }
  };

  const filteredReasons = useMemo(() => {
    const term = reasonSearch.trim().toLowerCase();
    if (!term) return CANCELLATION_REASONS;
    return CANCELLATION_REASONS.filter((reason) =>
      reason.label.toLowerCase().includes(term)
    );
  }, [reasonSearch]);

  const fetchData = useCallback(
    async (page = 1) => {
      if (!user?.user_id) return;

      const selectedCategory = categories[currentCategory];
      const params = new URLSearchParams();

      params.set("userId", user.user_id);
      params.set("status", selectedCategory.value);
      params.set("page", page);

      // Add other search params from URL
      searchParams.forEach((value, key) => {
        if (key !== "page") {
          params.set(key, value);
        }
      });

      try {
        setLoading(true);
        const { data } = await http.get(`/reservations?${params.toString()}`);
        setReservations(data?.data || []);
        setTotalPages(data?.meta?.totalPages || 1);
        setCurrentPage(page);
      } catch (error) {
        console.log(error);
        toast.error(
          "Une erreur est survenue lors de la récupération des réservations"
        );
        setReservations([]);
      } finally {
        setLoading(false);
      }
    },
    [user?.user_id, currentCategory, categories, searchParams, http]
  );

  async function handleCancel(e) {
    try {
      e.preventDefault();
      const isOther = cancelReasonType === "other";
      const reason = isOther
        ? customCancelReason.trim()
        : cancelReasonType;
      if (!reason) {
        setReasonError(true);
        toast.error("Veuillez préciser un motif d'annulation.");
        return;
      }
      setReasonError(false);
      setLoading(true);
      await http.patch(`/reservations/${reservationToCancel}/status`, {
        status: "CANCELLED",
        reason,
    });
      toast.success("Réservation annulée");
      setReservationToCancel(null);
      await fetchData(currentPage);
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    if (e.target.value.length <= MAX_CANCEL_REASON_LENGTH) {
      setCustomCancelReason(e.target.value);
      if (reasonError) setReasonError(false);
    }
  }

  useEffect(() => {
    fetchData(1); // Fetch page 1 when category changes
  }, [currentCategory, fetchData]);

  const displayedReservations = useMemo(() => {
    const selectedCategory = categories[currentCategory];
    if (selectedCategory.filter) {
      return reservations.filter(selectedCategory.filter);
    }
    return reservations;
  }, [reservations, currentCategory, categories]);

  const handlePageChange = (page) => {
    fetchData(page);
  };

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
              displayedReservations.length > 0 ? (
                displayedReservations.map((reservation) => {
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            nextPageTitle="Voir plus"
          />
        </section>
      </div>

      {reservationToCancel && (
        <>
          <form
            ref={ref}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="relative w-[314px] md:w-[512px] max-h-[90vh-4rem] bg-white border border-gray-200 rounded-lg p-3 overflow-hidden">
              <div className="max-h-full overflow-y-auto space-y-4 text-sm">
              <label className="text-[12px] md:text-sm mb-2 block">
                Sélectionnez le motif
              </label>
              <input
                type="search"
                value={reasonSearch}
                onChange={(e) => setReasonSearch(e.target.value)}
                placeholder="Rechercher un motif..."
                className="w-full mb-3 bg-[#FBFBFB] border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition"
              />
              <div className="max-h-40 overflow-y-auto space-y-2 mb-3 rounded-lg">
                {filteredReasons.length ? (
                  filteredReasons.map((reason) => (
                    <button
                      key={reason.value}
                      type="button"
                      onClick={() => handleReasonSelect(reason.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg border transition ${
                        cancelReasonType === reason.value
                          ? "border-primary bg-primary/10 text-primary font-semibold"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      {reason.label}
                    </button>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    Aucun motif ne correspond à votre recherche.
                  </p>
                )}
              </div>
              {cancelReasonType === "other" && (
                <>
                  <textarea
                    className="w-full block mt-3 bg-[#FBFBFB] border border-gray-200 rounded-lg resize-none p-3 ring-2 ring-white outline-0 focus:ring-primary h-[140px] md:h-2/3"
                    name="cancel-reason"
                    id="cancel-reason"
                    value={customCancelReason}
                    onChange={handleChange}
                    maxLength={MAX_CANCEL_REASON_LENGTH}
                  />
                  <span className="block text-sm text-end mt-2">
                    {`${customCancelReason.length}/${MAX_CANCEL_REASON_LENGTH} caractères`}
                  </span>
                </>
              )}
              {reasonError && cancelReasonType !== "other" && (
                <p className="text-xs text-red-600 mt-1">
                  Merci de choisir un motif.
                </p>
              )}
              {reasonError && cancelReasonType === "other" && (
                <p className="text-xs text-red-600 mt-1">
                  Merci de décrire votre motif.
                </p>
              )}
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
              <IoMdCloseCircle className="w-5 h-5" />
            </button>
            </div>
          </form>
          <div className="min-h-screen transition-all ease-in-out z-40 w-screen fixed top-0 h-full border-gray-200 backdrop-brightness-60"></div>
        </>
      )}
    </>
  );
}

export default function Reservation() {
  return (
    <Suspense fallback={<div className="text-center mt-10"><LoaderCircle size={40} className="animate-spin text-primary mx-auto" /></div>}>
      <ReservationsContent />
    </Suspense>
  );
}
