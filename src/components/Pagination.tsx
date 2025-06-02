import styled from 'styled-components';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const isEmpty = totalPages === 0;

  return (
    <Wrapper>
      <PageButton
        disabled={isEmpty || currentPage === 1}
        onClick={() => !isEmpty && onPageChange(currentPage - 1)}
      >
        {'<'}
      </PageButton>

      {isEmpty ? (
        <PageButton active>{1}</PageButton>
      ) : (
        Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PageButton
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PageButton>
        ))
      )}

      <PageButton
        disabled={isEmpty || currentPage === totalPages}
        onClick={() => !isEmpty && onPageChange(currentPage + 1)}
      >
        {'>'}
      </PageButton>
    </Wrapper>
  );
};

export default Pagination;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const PageButton = styled.button<{ active?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  background: ${({ active }) => (active ? '#999' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  border-right: 1px solid #ccc;
  font-size: 1rem;
  cursor: pointer;

  &:last-of-type {
    border-right: none;
  }

  &:disabled {
    color: #ccc;
    cursor: default;
  }
`;
