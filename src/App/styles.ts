import styled from 'styled-components';

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 70rem;
  height: 50rem;
  padding: 1rem;

  display: flex;

  flex-direction: column;
  align-items: center;

  background-color: black;
  color: white;

  border-radius: 10px;
`;

export const Title = styled.h1`
  font-size: 2rem;
`;

export const ContentSide = styled.div`
  display: flex;

  width: 100%;
  padding: 1rem;
`;

export const LeftSide = styled.div`
  display: flex;
  
  width: 70%;
`;

export const RightSide = styled.div`
  display: flex;

  flex-direction: column;

  gap: 10px;
  justify-content: center;
`;

export const ButtonStyle = styled.button`
  border: 0;
  outline: 0;

  font-size: 1.25rem;
  color: white;
  background-color: darkblue;

  padding: 0.5rem;
  width: 100%;
  height: 3rem;
  
  border-radius: 10px;

  margin-top: 2rem;

  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;