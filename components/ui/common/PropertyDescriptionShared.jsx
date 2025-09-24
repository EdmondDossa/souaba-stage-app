"use client";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export default function PropertyDescriptionShared({
  description,
  location,
  title,
  name,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded
    ? description
    : description.slice(0, maxLength);

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-montserrat-bold font-bold text-gray-700 mb-1">
            {name}
          </h3>
          <div className="flex gap-x-3 text-primary">
            <Heart />
            <Share2 />
          </div>
        </div>
        <p className="flex gap-x-2 text-gray-400 text-sm font-montserrat-medium font-bold">
          <span>
            {" "}
            <img src="/icons/loc 1.svg" alt="" />{" "}
          </span>
          {location}
        </p>
      </div>
      <div>
        <h3 className="text-xl font-montserrat-bold font-bold text-gray-700 mb-3">
          Description de {title}
        </h3>
        <p className="text-justify text-gray-600 text-sm  leading-5">
          {" "}
          {description}{" "}
        </p>
      </div>
    </div>
  );
}
