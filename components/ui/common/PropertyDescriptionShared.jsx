"use client";
import { useState } from "react";

export default function PropertyDescriptionShared({ description, title }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  const shouldTruncate = description.length > maxLength;
  const displayText = isExpanded ? description : description.slice(0, maxLength);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-900">
        Description de {title}
      </h3>
      <div className="p-6">
        <p className="text-gray-700 leading-relaxed text-sm">
          {displayText}
          {shouldTruncate && !isExpanded && "..."}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-orange-500 font-medium hover:underline text-sm"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
      </div>
    </div>
  );
}
