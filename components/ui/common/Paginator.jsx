"use client";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";

const Paginator = ({
  defaultPage = 1,
  onPageChange,
  totalPages,
  nextPageTitle = "Voir la page",
}) => {
  const [currentPage, setCurrentPage] = useState(defaultPage || 1);

  useEffect(() => {
    setCurrentPage(defaultPage || 1);
  }, [defaultPage]);

  function getPaginator() {
    const PAGINATOR_LIMIT_START = 5;
    const safeTotalPages = Math.max(1, totalPages || 1);
    const safeCurrentPage = Math.max(1, currentPage);

    // Determine the group (1-5, 6-10, etc.) where the current page lives
    const start =
      Math.floor((safeCurrentPage - 1) / PAGINATOR_LIMIT_START) *
        PAGINATOR_LIMIT_START +
      1;
    const end = Math.min(start + PAGINATOR_LIMIT_START - 1, safeTotalPages);

    const pages = [];
    const withEllipsis = end < safeTotalPages;

    for (let i = start; i <= end; i++) pages.push(i);

    return { pages, withEllipsis };
  }
  const { pages, withEllipsis } = getPaginator();

  function handlePageChange(action, nextPageNumber) {
    const safeTotalPages = Math.max(1, totalPages || 1);
    let page = currentPage;

    if (nextPageNumber) {
      page = nextPageNumber;
    } else {
      page =
        action === "increment"
          ? currentPage + 1
          : currentPage - 1;
    }

    const boundedPage = Math.min(Math.max(page, 1), safeTotalPages);
    setCurrentPage(boundedPage);
    if (onPageChange) {
      onPageChange(boundedPage);
    }
  }

  const nextPage = () => handlePageChange("increment");
  const prevPage = () => handlePageChange("decrement");

  const safeTotalPages = Math.max(1, totalPages || 1);
  const hasNext = currentPage < safeTotalPages;
  const hasPrev = currentPage > 1;

  return (
    <div className="flex items-center my-10 gap-x-4 justify-center">
      <div className={hasPrev ? "visible" : "invisible"}>
        <FaChevronLeft className="cursor-pointer" onClick={prevPage} />
      </div>
      <div className="flex items-center">
        {pages.map((pageNumber) => (
          <button
            onClick={() => handlePageChange(null, pageNumber)}
            className={`w-8 h-8 rounded-full font-montserrat-bold text-gray-800 place-content-center ${
              currentPage === pageNumber ? "bg-primary text-white" : ""
            }`}
            key={pageNumber}
          >
            {pageNumber}
          </button>
        ))}
        {withEllipsis && safeTotalPages > pages.length && (
          <div className="flex items-center">
            <Ellipsis className="me-4" />
            <button
              onClick={() => handlePageChange(null, safeTotalPages)}
              className={`w-8 h-8 rounded-full font-montserrat-bold text-gray-800 place-content-center ${
                currentPage === 100 ? "bg-primary text-white" : ""
              }`}
            >
              {safeTotalPages}
            </button>
          </div>
        )}
      </div>
      <div className={hasNext ? "visible" : "invisible"}>
        <FaChevronRight onClick={nextPage} className="cursor-pointer" />
      </div>

      {hasNext && (
        <button
          onClick={nextPage}
          className="border-2 w-36 h-10 block border-gray-300 rounded-lg relative hover:bg-gray-50 transition"
        >
          {" "}
          <span className="block absolute -top-3 left-3 backdrop-blur-md text-sm">
            { nextPageTitle }
          </span>{" "}
          <span className="absolute right-0 border-l-2 border-gray-300 top-2 py-1">
            {" "}
            <FaChevronRight className="" />{" "}
          </span>
        </button>
      )}
    </div>
  );
};

export default Paginator;
