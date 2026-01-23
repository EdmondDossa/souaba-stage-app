import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const MobileRoomType = ({ rooms }) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);

  const onRoomChange = (action) => {
    if (!hasRooms) return;
    if (action === "next")
      setCurrentRoomIndex(Math.min(rooms.length - 1, currentRoomIndex + 1));
    else setCurrentRoomIndex(Math.max(0, currentRoomIndex - 1));
  };

  const hasRooms = Array.isArray(rooms) && rooms.length > 0;
  const currentRoom = hasRooms ? rooms[currentRoomIndex] : null;

  const roomImage = currentRoom
    ? currentRoom.HotelRoomCategoryMedia?.find((media) => media?.is_primary)?.media?.file_path ||
      currentRoom.HotelRoomCategoryMedia?.[0]?.media?.file_path ||
      currentRoom.HotelRoomCategoryMedia?.[0] ||
      "/images/new-property1.jpg"
    : "/images/new-property1.jpg";

  if (!hasRooms) return null;

  return (
    <div>
      <h2 className="font-montserrat-bold rounded-t-xl bg-primary p-4 text-center text-white text-[20px]">
        Chambres
      </h2>
      <div className="border text-[14px] border-gray-300 p-3 rounded-b-xl">
        <div className="flex gap-x-3">
          <div>
            <Image
              width={150}
              height={150}
              className="w-28 h-20 rounded-md"
              alt={currentRoom?.name || "Room image"}
              src={roomImage || "/images/new-property1.jpg"}
            />
          </div>
          <div>
            <strong className="capitalize font-montserrat-bold text-gray-700">
              {" "}
              {currentRoom.type}{" "}
            </strong>
            <div className="mt-3">
              <span> 2 lits </span>
            </div>
            <span>
              {" "}
              {currentRoom.number_of_bathrooms} salle de bain{" "}
            </span>
          </div>
        </div>
        <p className="text-gray-400 p-2 h-12 overflow-y-auto">
          {currentRoom.description}
        </p>
        <div className="mb-2">
          {" "}
          <strong className="font-montserrat-bold">Capacité:</strong>{" "}
          {currentRoom.capacity}{" "}
        </div>
        <div>
          {" "}
          <strong className="font-montserrat-bold">Prix par nuit:</strong>{" "}
          {currentRoom.price_per_night} FCFA
        </div>
        <div className="flex items-center justify-center space-x-4 mt-2">
          {/* Select pour choisir le nombre de chambres */}
          <select
            defaultValue={currentRoom.selectedCount ?? 0}
            onChange={(e) => {}}
            className="px-3 py-2 border border-gray-300 rounded text-sm"
          >
            <option value={0}>0 (0FCFA)</option>
            {[
              ...Array(Math.min(currentRoom.number_of_rooms, 5)),
            ].map((_, idx) => (
              <option key={idx + 1} value={idx + 1}>
                {idx + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-center">
          <button className="bg-primary mt-4 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:bg-amber-400 transition-colors">
            Je réserve
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center mt-4 gap-x-4">
        <button
          onClick={() => onRoomChange("prev")}
          className={`p-1 rounded-full ${
            currentRoomIndex != 0 ? "bg-primary" : "bg-gray-200 "
          }`}
        >
          {" "}
          <ChevronLeft />{" "}
        </button>
        <button
          onClick={() => onRoomChange("next")}
          className={`p-1 rounded-full ${
            currentRoomIndex === rooms.length - 1 ? "bg-gray-200" : "bg-primary"
          }`}
        >
          {" "}
          <ChevronRight />{" "}
        </button>
      </div>
    </div>
  );
};

export default MobileRoomType;
