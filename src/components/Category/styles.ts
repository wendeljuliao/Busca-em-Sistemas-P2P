import styled, { css } from "styled-components";

interface ICategoryStyle {
  active: boolean;
}

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  flex-direction: column;

  gap: 4px;
`

export const Content = styled.div`
  display: flex;
  width: 100%;

  flex-direction: column;

  gap: 10px;
`;

export const Title = styled.h2`
  font-family: 'Roboto-Regular';
  font-size: 16px;

  color: white;

`;

export const CardCategory = styled.div<ICategoryStyle>`  
  display: flex;
  width: 100%;
  height: 3rem;
  
  padding: 4px 6px;

  border: 1px solid white;
  border-radius: 10px;

  align-items: center;
  text-align: center;
  justify-content: center;

  cursor: pointer;

  ${({ active }) => active && css`
    background-color: darkblue;
    border-color: white;
    
    color: white;
  `};
`;

export const TextCategory = styled.span<ICategoryStyle>`
  color: white;
  font-size: 18px;

  ${({ active }) => active && css`    
    color: white;
  `};
`;