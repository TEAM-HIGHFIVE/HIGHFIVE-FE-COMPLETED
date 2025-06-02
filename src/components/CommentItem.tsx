import styled from 'styled-components';

interface CommentItemProps {
  text: string;
  date: string;
}

const CommentItem = ({ text, date }: CommentItemProps) => {
  return (
    <Comment>
      <CommentText>{text}</CommentText>
      <CommentDate>{date}</CommentDate>
    </Comment>
  );
};

export default CommentItem;

const Comment = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: #f8f9fa;
  border-radius: 1rem;
  padding: 1.2rem 1.4rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const CommentText = styled.span`
  color: #000;
  font-size: 1rem;
`;

const CommentDate = styled.span`
  font-size: 0.85rem;
  color: #71767a;
`;
