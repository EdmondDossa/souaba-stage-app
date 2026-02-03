"use client";
import { Minus, Plus } from "lucide-react";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { SvgIcon } from "@/components/ui/common";
import CalendarPicker from "./Calendar";
import { dateToLetters } from "@/utils/dateToLetters";

export default function PropertyReservationForm({
  price,
  currency = "FCFA",
  period = "nuit",
  onBook,
}) {
  const [reservationData, setReservationData] = useState({
    checkIn: "",
    checkOut: "",
    adults: 1,
    children: 0,
    babies: 0,
  });

  const [isVisible, setIsVisible] = useState(true);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [previewEndDate, setPreviewEndDate] = useState(null);
  const componentRef = useRef(null);
  const datePickerRef = useRef(null);
  const dateInputRef = useRef(null);
  const calendarRef = useRef(null);
  const minCheckIn = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);
  const startOfDay = (value) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate());

  useEffect(() => {
    const handleScroll = () => {
      if (!componentRef.current) return;
      if (window.innerWidth >= 1024) {
        setIsVisible(true);
        return;
      }

      const scrollY = window.scrollY;
      const componentTop = componentRef.current.offsetTop;
      const componentHeight = componentRef.current.offsetHeight;
      const passedPoint = componentTop + componentHeight + 200;

      if (scrollY > passedPoint) {
        setIsVisible(false);
      } else if (scrollY < passedPoint - 100) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const closeCalendar = useCallback(() => {
    setShowDateDropdown(false);
    setPreviewEndDate(null);
    setIsSelectingEnd(
      Boolean(reservationData.checkIn && reservationData.checkOut)
    );
  }, [reservationData.checkIn, reservationData.checkOut]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateInputRef.current?.contains(event.target) ||
        calendarRef.current?.contains(event.target)
      ) {
        return;
      }
      closeCalendar();
    };

    if (showDateDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDateDropdown, closeCalendar]);

  const updateGuestCount = (type, operation) => {
    setReservationData((prev) => ({
      ...prev,
      [type]:
        operation === "increment"
          ? prev[type] + 1
          : Math.max(type === "adults" ? 1 : 0, prev[type] - 1),
    }));
  };

  const toIsoDate = (value) => {
    const selectedDate = startOfDay(
      value instanceof Date ? value : new Date(value)
    );
    if (Number.isNaN(selectedDate.getTime())) return null;
    return `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`;
  };

  const isBeforeToday = (value) => {
    const date = startOfDay(value instanceof Date ? value : new Date(value));
    const today = startOfDay(new Date());
    return date < today;
  };

  const handleRangeSelect = (date) => {
    if (isBeforeToday(date)) return;
    const isoDate = toIsoDate(date);
    if (!isoDate) return;

    setReservationData((prev) => {
      const hasCheckIn = Boolean(prev.checkIn);
      const hasCheckOut = Boolean(prev.checkOut);

      if (!hasCheckIn || (hasCheckIn && hasCheckOut) || !isSelectingEnd) {
        setPreviewEndDate(null);
        setIsSelectingEnd(true);
        return { ...prev, checkIn: isoDate, checkOut: "" };
      }

      const checkInDate = startOfDay(new Date(prev.checkIn));
      if (startOfDay(new Date(isoDate)) < checkInDate) {
        setPreviewEndDate(null);
        setIsSelectingEnd(true);
        return { ...prev, checkIn: isoDate, checkOut: "" };
      }

      setPreviewEndDate(null);
      setIsSelectingEnd(false);
      return {
        ...prev,
        checkOut: isoDate,
      };
    });
  };

  const handleDateHover = (date) => {
    if (!reservationData.checkIn || reservationData.checkOut) return;
    const iso = toIsoDate(date);
    if (!iso) return;
    const checkInDate = startOfDay(new Date(reservationData.checkIn));
    if (startOfDay(new Date(iso)) < checkInDate) {
      setPreviewEndDate(reservationData.checkIn);
      return;
    }
    setPreviewEndDate(iso);
  };

  const handleDateHoverEnd = () => {
    setPreviewEndDate(null);
  };

  useEffect(() => {
    if (reservationData.checkIn && reservationData.checkOut) {
      setIsSelectingEnd(false);
    }
  }, [reservationData.checkIn, reservationData.checkOut]);


  return (
    <div
      ref={componentRef}
      className={`
        bg-white border border-gray-200 rounded-2xl p-5 shadow-lg sticky top-4 
        transition-all duration-500 ease-in-out flex flex-col
        ${
          isVisible
            ? "opacity-100 transform translate-y-0"
            : "opacity-0 transform translate-y-8 pointer-events-none"
        }
      `}
    >
      {/* Prix total */}
      <div className="mb-6">
        <div className="text-xl font-bold mb-1 text-gray-800">
          Prix par nuit: {price} {currency}
        </div>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="relative" ref={datePickerRef}>
          <label className="block text-sm font-bold text-black mb-2">
            Dates de séjour
          </label>
          <div
            ref={dateInputRef}
            className="flex items-center gap-2 px-3 py-3 border border-gray-300 rounded-lg cursor-pointer focus-within:border-primary focus-within:ring-0 focus-within:outline-none transition-all"
            onClick={() =>
              setShowDateDropdown((prev) => {
                if (prev) setPreviewEndDate(null);
                return !prev;
              })
            }
          >
            <SvgIcon
              name="Timeline Week"
              size={20}
              className="text-gray-400"
            />
            <span className="text-sm leading-tight text-gray-600">
              {reservationData.checkIn && reservationData.checkOut
                ? `${dateToLetters(reservationData.checkIn)} - ${dateToLetters(
                    reservationData.checkOut
                  )}`
                : reservationData.checkIn
                ? `${dateToLetters(reservationData.checkIn)} - Ajouter une date de départ`
                : "Ajouter vos dates"}
            </span>
          </div>
          {showDateDropdown && (
            <div ref={calendarRef} className="absolute z-50 mt-2 left-0">
              <CalendarPicker
                selectedDate={reservationData.checkIn || new Date()}
                minDate={new Date()}
                rangeStart={reservationData.checkIn || null}
                rangeEnd={reservationData.checkOut || null}
                previewRangeEnd={previewEndDate}
                onDateSelect={handleRangeSelect}
                onDateHover={handleDateHover}
                onDateHoverLeave={handleDateHoverEnd}
              />
            </div>
          )}
        </div>

        <div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-black mb-3">
                Nombre d&apos;invités
              </label>

              <div className="space-y-2">
                <div className="flex justify-between items-center p-3">
                  <div>
                    <div className="font-montserrat-bold text-black">Adultes</div>
                    <div className="text-sm text-gray-500">18 ans ou plus</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateGuestCount("adults", "decrement")}
                      className="w-8 h-8 rounded-sm border border-gray-300 flex items-center justify-center"
                      disabled={reservationData.adults <= 1}
                    >
                      <Minus
                        size={16}
                        className={
                          reservationData.adults <= 1
                            ? "text-black"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">
                      {reservationData.adults}
                    </span>
                    <button
                      onClick={() => updateGuestCount("adults", "increment")}
                      className="w-8 h-8 rounded-sm border border-primary flex items-center justify-center bg-primary"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <hr className="border border-gray-200" />
                <div className="flex justify-between items-center p-3">
                  <div>
                    <div className="font-montserrat-bold text-black">Enfants</div>
                    <div className="text-sm text-gray-500">2-17 ans</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateGuestCount("children", "decrement")}
                      className="w-8 h-8 rounded-sm border border-gray-300 flex items-center justify-center"
                      disabled={reservationData.children <= 0}
                    >
                      <Minus
                        size={16}
                        className={
                          reservationData.children <= 0
                            ? "text-black"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">
                      {reservationData.children}
                    </span>
                    <button
                      onClick={() => updateGuestCount("children", "increment")}
                      className="w-8 h-8 rounded-sm border border-primary flex items-center justify-center bg-primary"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <hr className="border border-gray-200" />
                <div className="flex justify-between items-center p-3">
                  <div>
                    <div className="font-montserrat-bold text-black">Bébés</div>
                    <div className="text-sm text-gray-500">Moins de 2 ans</div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateGuestCount("babies", "decrement")}
                      className="w-8 h-8 rounded-sm border border-gray-300 flex items-center justify-center"
                      disabled={reservationData.babies <= 0}
                    >
                      <Minus
                        size={16}
                        className={
                          reservationData.babies <= 0
                            ? "text-black"
                            : "text-gray-600"
                        }
                      />
                    </button>
                    <span className="font-semibold min-w-[2rem] text-center">
                      {reservationData.babies}
                    </span>
                    <button
                      onClick={() => updateGuestCount("babies", "increment")}
                      className="w-8 h-8 rounded-sm border border-primary flex items-center justify-center bg-primary"
                    >
                      <Plus size={16} className="text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center">
        <button
          onClick={() => onBook && onBook(reservationData)}
          className="w-[200px] bg-red-500 text-white py-4 rounded-3xl font-bold text-sm hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          Réserver maintenant
        </button>
      </div>
    </div>
  );
}
