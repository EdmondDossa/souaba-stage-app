import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import OverviewModal from "./OverviewModal";
import SvgIcon from "./SvgIcon";
import MobileRoomType from "./MobileRoomType";

export default function HotelRooms({
  hotelRooms,
  onBook,
  availabilityState = "available",
  availabilityLoading = false,
}) {
  // États pour gérer l'overview
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [selection, setSelection] = useState({});
  const [isTotalRowVisible, setIsTotalRowVisible] = useState(false);
  const totalRowRef = useRef(null);
  const hasRooms = (hotelRooms || []).length > 0;

  // Fonction pour ouvrir l'overview
  const openOverview = (room) => {
    setSelectedRoom(room);
    setIsOverviewOpen(true);
  };

  // Fonction pour fermer l'overview
  const closeOverview = () => {
    setSelectedRoom(null);
    setIsOverviewOpen(false);
  };

  // Utiliser les données de l'API ou un tableau vide par défaut
  const rooms = hotelRooms || [];
  const isSelectionEnabled = availabilityState === "available";

  useEffect(() => {
    setSelection({});
  }, [hotelRooms]);

  const handleSelectChange = (room, count) => {
    setSelection((prev) => ({
      ...prev,
      [room.room_category_id]: count,
    }));
  };

  const totalAmount = useMemo(() => {
    return rooms.reduce((sum, room) => {
      const count = selection[room.room_category_id] || 0;
      const price = Number(room.price_per_night) || 0;
      return sum + count * price;
    }, 0);
  }, [rooms, selection]);

  const handleReserve = () => {
    if (!onBook) return;
    if (!isSelectionEnabled) return;
    const selectedRooms = rooms
      .map((room) => {
        const quantity = selection[room.room_category_id] || 0;
        if (!quantity) return null;
        return {
          roomCategoryId: String(room.room_category_id),
          quantity,
          pricePerNight: Number(room.price_per_night) || 0,
          capacity: Number(room.capacity) || 0,
        };
      })
      .filter(Boolean);

    if (!selectedRooms.length) return;
    onBook({ selectedRooms, totalPerNight: totalAmount });
  };

  useEffect(() => {
    if (!totalRowRef.current) {
      setIsTotalRowVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsTotalRowVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.1 }
    );

    observer.observe(totalRowRef.current);
    return () => observer.disconnect();
  }, [hasRooms]);

  return (
    <div>
      {/* Version web */}
      <div className="hidden md:block relative">
        <div className="space-y-6">
          <div className="w-full">
            {availabilityState === "idle" && !availabilityLoading && (
              <div className="mb-4 rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700">
                Sélectionnez vos dates pour afficher les disponibilités.
              </div>
            )}
            {availabilityState === "empty" && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                Aucune chambre disponible pour ces dates.
              </div>
            )}
            {availabilityLoading && (
              <div className="mb-4 rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-600">
                Chargement des disponibilités...
              </div>
            )}
            <div className="overflow-x-auto border border-white">
              <table className="min-w-full bg-white table-auto">
                <thead className="bg-primary text-white">
                  <tr className="text-sm font-semibold">
                    {[
                      "Type de chambre",
                      "Description",
                      "Capacité d'accueil",
                      "Prix par nuit",
                      "Nombre de salle de bain",
                      "Sélectionnez des chambres",
                    ].map((title, i) => {
                      return (
                        <th
                          key={i}
                          scope="col"
                          className="text-left px-6  py-4 font-montserrat-medium"
                        >
                          {" "}
                          {title}{" "}
                        </th>
                      );
                    })}
                    <th></th>
                  </tr>
                </thead>

                <tbody className="text-sm text-gray-700">
                  {rooms.map((room, i) => {
                    // Récupérer l'image principale ou utiliser une image par défaut
                    const roomImage =
                      room.HotelRoomCategoryMedia?.find(
                        (media) => media.is_primary
                      )?.media?.file_path ||
                      room.HotelRoomCategoryMedia?.[0]?.media?.file_path ||
                      "/images/default-room.jpg";
                    const availableRooms = Number(
                      room.availableRooms ?? room.number_of_rooms
                    );
                    const maxSelectable = Math.min(
                      Number.isFinite(availableRooms) ? availableRooms : 0,
                      5
                    );
                    const selectedCount = selection[room.room_category_id] || 0;
                    const rowTotal =
                      (Number(room.price_per_night) || 0) * selectedCount;

                    return (
                      <tr
                        key={room.room_category_id}
                        className="border-b w-1 border-gray-200 bg-white"
                      >
                        {/* Type de chambre */}
                        <td className="px-6 py-4 align-middle">
                          <div className="text-sm  mb-3 text-gray-700">
                            {room.name}
                          </div>
                          <div className="flex flex-col items-start space-y-2">
                            <button
                              type="button"
                              onClick={() => openOverview(room)}
                              className="w-20 h-20 rounded-md overflow-hidden relative flex-shrink-0 focus:outline-none"
                              aria-label={`Aperçu ${room.name}`}
                            >
                              <Image
                                src={roomImage}
                                alt={room.name}
                                width={80}
                                height={64}
                                className="object-cover"
                              />
                            </button>

                            <div className="text-xs font-montserrat-medium mt-2 text-gray-800">
                              <span className="block">
                                {" "}
                                {Number.isFinite(availableRooms)
                                  ? availableRooms
                                  : 0}{" "}
                                chambre(s) disponible(s){" "}
                              </span>
                              <span className="block">
                                {" "}
                                {room.number_of_bathrooms} salle(s) de bain{" "}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description (image + texte) */}
                        <td className="px-6 py-4 align-middle">
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 font-montserrat-medium">
                              {room.description}
                            </p>
                          </div>
                        </td>

                        {/* Capacité d'accueil */}
                        <td className="px-6 py-4 align-middle text-center">
                          <div className="font-bold text-gray-900">
                            {room.capacity}
                          </div>
                        </td>

                        {/* Prix par nuit */}
                        <td className="px-6 py-4 align-middle text-center whitespace-nowrap">
                          <div className="font-bold text-gray-900">
                            {Number(room.price_per_night).toLocaleString(
                              "fr-FR"
                            )}{" "}
                            FCFA
                          </div>
                        </td>

                        {/* Nombre de salle de bain */}
                        <td className="px-6 py-4 align-middle text-center">
                          <div className="font-bold text-gray-900">
                            {room.number_of_bathrooms}
                          </div>
                        </td>

                        {/* Sélectionnez des chambres */}
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-between space-x-4">
                            {/* Select pour choisir le nombre de chambres */}
                            <select
                              value={selectedCount}
                              onChange={(e) =>
                                handleSelectChange(
                                  room,
                                  Number(e.target.value)
                                )
                              }
                              disabled={!isSelectionEnabled || maxSelectable === 0}
                              className="px-3 py-2 border border-gray-300 rounded text-sm"
                              aria-label={`Sélectionner le nombre de chambres pour ${room.name}`}
                            >
                              <option value={0}>0 (0FCFA)</option>
                              {[...Array(maxSelectable)].map((_, idx) => (
                                <option key={idx + 1} value={idx + 1}>
                                  {idx + 1} (
                                  {(
                                    (idx + 1) *
                                    (Number(room.price_per_night) || 0)
                                  ).toLocaleString("fr-FR")}{" "}
                                  FCFA)
                                </option>
                              ))}
                            </select>
                            <div className="text-xs text-gray-600 mt-1">
                              Sous-total:{" "}
                              <span className="font-semibold">
                                {rowTotal.toLocaleString("fr-FR")} FCFA
                              </span>
                            </div>

                            {/* Voir plus de détails (icône œil + texte) */}
                            <button
                              type="button"
                              onClick={() => openOverview(room)}
                              className="flex flex-col items-center text-xs text-primary "
                            >
                              {/* simple icône œil svg */}
                              <SvgIcon
                                name="eye 1 1"
                                size={16}
                                className="mb-1"
                              />
                              Voir plus de détails
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {rooms.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Aucune chambre disponible.
                      </td>
                    </tr>
                  )}
                  {rooms.length > 0 && (
                    <tr
                      ref={totalRowRef}
                      className="bg-gray-50 font-montserrat-bold"
                    >
                      <td colSpan={4} className="px-6 py-4 text-right">
                        Total sélectionné
                      </td>
                      <td className="px-6 py-4 text-center">
                        {totalAmount.toLocaleString("fr-FR")} FCFA
                      </td>
                      <td className="px-6 py-4 text-right" colSpan={2}>
                        <button
                          onClick={handleReserve}
                          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={totalAmount === 0 || !isSelectionEnabled}
                        >
                          Je réserve
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {hasRooms && !isTotalRowVisible && (
            <div className="fixed bottom-6 right-6 bg-white shadow-2xl border border-gray-200 rounded-xl px-5 py-4 space-y-2 z-30">
              <div className="text-sm text-gray-600">Total sélectionné</div>
              <div className="text-xl font-montserrat-bold text-gray-800">
                {totalAmount.toLocaleString("fr-FR")} FCFA
              </div>
              <button
                onClick={handleReserve}
                className="w-full bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={totalAmount === 0 || !isSelectionEnabled}
              >
                Je réserve
              </button>
            </div>
          )}
          {/* Overview Modal */}

          <OverviewModal
            isOpen={isOverviewOpen}
            selectedRoom={selectedRoom}
            onClose={closeOverview}
            hotelRooms={hotelRooms}
          />
        </div>
      </div>
      {/* Version mobile */}
      <div className="block md:hidden">
        <MobileRoomType
          rooms={hotelRooms}
          selection={selection}
          onSelectChange={handleSelectChange}
          onReserve={handleReserve}
          isSelectionEnabled={isSelectionEnabled}
        />
      </div>
    </div>
  );
}
