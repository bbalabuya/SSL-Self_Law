import React from "react";
import styled from "styled-components";

const MainContainer = styled.main`
  min-height: calc(100vh - 80px); // 헤더의 높이를 제외한 나머지 부분
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  text-align: center;
`;

const Title = styled.h1`
  font-family: "", cursive; //폰트를 넣어야하는데 모르겠다...
  font-size: 48px;
  font-weight: bold;
  transform: translateY(-120%);
  span {
  }
`;

const SubTitle = styled.h2`
  font-size: 24px;
  margin: 20px 0;
`;

const LearnMore = styled.a`
  color: #ff5722;
  text-decoration: none;
  font-size: 18px;
  margin-top: 10px;
`;

const MainContent = () => {
  return (
    <MainContainer>
      <Title>
        법률 상담, <span>Ai</span>에게 맡기세요
      </Title>
      <SubTitle>도움이 필요하신가요? 당신의 고민을 해결해드립니다</SubTitle>
      <LearnMore href="#">더 알아보기 </LearnMore>
    </MainContainer>
  );
};

export default MainContent;
