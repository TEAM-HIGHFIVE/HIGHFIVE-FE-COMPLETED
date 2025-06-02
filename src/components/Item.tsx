import styled from 'styled-components';

interface ItemProps {
  title: string;
  date?: string;
  onClick?: () => void;
}

const Item = ({ title, date, onClick }: ItemProps) => {
  return (
    <Wrapper onClick={onClick}>
      <span>{title}</span>
      {date && <span>{date}</span>}
    </Wrapper>
  );
};

export default Item;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.9em 0;
  border-bottom: 1px solid #d9d9d9;

  &:last-child {
    border-bottom: none;
  }
`;
