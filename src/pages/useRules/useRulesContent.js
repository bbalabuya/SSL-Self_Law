import React from "react";
import styled from "styled-components";

const Background = styled.div`
  background-color: #ffecc8;
  width: 100vw;
  height: 90vh;
  position: relative;
`;

const ContentContainer = styled.div`
  position: relative;
  top: 40%;
  left: 50%;
  color: black;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  hieght: 100%;
  max-width: 1000px;
  max-height: 1000px;
  text-align: center;
`;

const UseRulesContent = () => {
  return (
    <Background>
      <ContentContainer>
        <h2>이용약관</h2>
        <p>본 웹사이트에...</p> {/* 여기에 실제 이용약관 내용을 추가하세요 */}
      </ContentContainer>
    </Background>
  );
};

export default UseRulesContent;
