import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pageNumbers = Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );

    return (
      <select
        value={currentPage}
        onChange={(e) => onPageChange(Number(e.target.value))}
      >
        {pageNumbers.map((pageNumber) => (
          <option key={pageNumber} value={pageNumber}>
            {pageNumber}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
