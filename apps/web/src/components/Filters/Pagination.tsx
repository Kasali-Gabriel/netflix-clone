'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationNext2,
  PaginationPrevious,
  PaginationPrevious2,
} from '../ui/pagination';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

const PaginationSection = ({
  currentPage,
  onPageChange,
  totalPages = 10,
}: PaginationProps) => {
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleNextPage2 = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 2);
    }
  };

  const handlePreviousPage2 = () => {
    if (currentPage > 2) {
      onPageChange(currentPage - 2);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const generatePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 3; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('ellipsis');
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push('ellipsis');
      pages.push(currentPage);
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious2 size="default" onClick={handlePreviousPage2} />
          <PaginationPrevious size="default" onClick={handlePreviousPage} />
        </PaginationItem>

        {pages.map((page, index) => (
          <PaginationItem
            key={typeof page === 'number' ? page : `ellipsis-${index}`}
          >
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                size="default"
                isActive={page === currentPage}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext size="default" onClick={handleNextPage} />
          <PaginationNext2 size="default" onClick={handleNextPage2} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationSection;
