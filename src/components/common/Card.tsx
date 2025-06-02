import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card = ({ children, className, style }: CardProps) => {
  return (
    <CardContainer className={className} style={style}>
      {children}
    </CardContainer>
  );
};

export default Card;

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: #f8f9fa;
  min-width: 300px;
  max-width: 1200px;
  border-radius: 1.5rem;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 3rem;
`;
