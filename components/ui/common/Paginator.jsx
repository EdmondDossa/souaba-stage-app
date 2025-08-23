"use client";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronLeft } from "react-icons/fa6";

const Paginator = ({ defaultPage, onPageChange, totalPages }) => {
  const [currentPage, setCurrentPage] = useState(defaultPage || 1);

  function getPaginator() {
    const PAGINATOR_LIMIT_START = 5;

    //we want to know the range where we will show the current page
    //by example for 5 it is 0-5, for 18 it is 15-20 ...
    const start =
      Math.floor(
        Math.min(totalPages, currentPage - 1) / PAGINATOR_LIMIT_START
      ) * PAGINATOR_LIMIT_START || 1;
    const end = Math.min(start + PAGINATOR_LIMIT_START, totalPages);

    const pages = [];
    const withEllipsis = start < totalPages - PAGINATOR_LIMIT_START;

    for (let i = start; i <= end; i++) pages.push(i);

    return { pages, withEllipsis };
  }
  const { pages, withEllipsis } = getPaginator();

  function handlePageChange(action, nextPageNumber) {
    let page;

    if (nextPageNumber) {
      page = nextPageNumber;
    } else {
      page =
        action === "increment"
          ? Math.min(currentPage + 1, totalPages)
          : Math.max(currentPage - 1, 0);
    }

    setCurrentPage(page);
    onPageChange(page);
  }

  const nextPage = () => handlePageChange("increment");
  const prevPage = () => handlePageChange("decrement");

  return (
    <div className="flex items-center my-10 gap-x-4 justify-center">
      <div className={currentPage > 1 ? "visible" : "invisible"}>
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
        {withEllipsis && (
          <div className="flex items-center">
            <Ellipsis className="me-4" />
            <button
              onClick={() => handlePageChange(null, totalPages)}
              className={`w-8 h-8 rounded-full font-montserrat-bold text-gray-800 place-content-center ${
                currentPage === 100 ? "bg-primary text-white" : ""
              }`}
            >
              {totalPages}
            </button>
          </div>
        )}
      </div>
      <div className={totalPages > currentPage ? "visible" : "invisible"}>
        <FaChevronRight onClick={nextPage} className="cursor-pointer" />
      </div>

      {totalPages > currentPage && (
        <button
          onClick={nextPage}
          className="border-2 w-36 h-10 block border-gray-300 rounded-lg relative hover:bg-gray-50 transition"
        >
          {" "}
          <span className="block absolute -top-3 left-3 backdrop-blur-md text-sm">
            {" "}
            Voir la page{" "}
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
