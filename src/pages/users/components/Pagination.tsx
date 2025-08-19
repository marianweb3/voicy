import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Dropdown } from "../../../components/ui/dropdown";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: PaginationProps) => {
  const itemsPerPageOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
    { value: "25", label: "25" },
  ];

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page context, and last page with ellipsis
      if (currentPage <= 3) {
        // Show first few pages
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show last few pages
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page context
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
      {/* Total Items Info */}
      <div className="flex items-center gap-2 order-2 md:order-1">
        <span className="text-[#00101F] text-[14px] md:text-[16px] font-normal">
          Всього <span className="font-semibold">{totalItems} Записів</span>
        </span>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 order-1 md:order-2">
        {/* Items Per Page Dropdown */}
        <div className="flex items-center gap-2 md:gap-3 justify-center sm:justify-start">
          <span className="text-[#00101F] text-[14px] md:text-[16px] font-normal whitespace-nowrap">
            відображати на сторінці
          </span>
          <div className="relative">
            <Dropdown
              options={itemsPerPageOptions}
              value={itemsPerPage.toString()}
              onChange={(value) => onItemsPerPageChange(parseInt(value))}
              size="sm"
              variant="default"
              dropDirection="up"
              className="w-16 md:w-20"
            />
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-center gap-1 md:gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F7F7]"
          >
            <MdKeyboardArrowLeft
              size={18}
              className="text-[#00101F] md:w-5 md:h-5"
            />
          </button>

          {/* Page Numbers - Show fewer on mobile */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, index) => {
              // On mobile, show only current page and adjacent pages
              const isMobile = window.innerWidth < 640;
              if (isMobile && page !== "..." && typeof page === "number") {
                if (
                  Math.abs(page - currentPage) > 1 &&
                  page !== 1 &&
                  page !== totalPages
                ) {
                  return null;
                }
              }

              return (
                <div key={index}>
                  {page === "..." ? (
                    <span className="px-1 md:px-2 py-1 text-[#9A9A9A] text-[14px] md:text-[16px]">
                      {page}
                    </span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`px-2 py-1 flex items-center justify-center rounded-[8px] text-[14px] md:text-[16px] font-normal transition-colors ${
                        currentPage === page
                          ? "bg-[#739C9C] text-white"
                          : "text-[#00101F] hover:bg-[#F7F7F7] hover:text-[#00101F]"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-8 h-8 flex items-center justify-center rounded-[8px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F7F7]"
          >
            <MdKeyboardArrowRight
              size={18}
              className="text-[#00101F] md:w-5 md:h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
export type { PaginationProps };
