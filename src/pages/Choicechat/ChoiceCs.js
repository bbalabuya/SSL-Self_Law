import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // Link 컴포넌트 임포트

const ContentWrapper = styled.div`
  position: relative;
  margin-top: 10%;
  text-align: center;
  border-radius: 10px;
  transform: translateY(-50%);
  z-index: 999;
`;

const H1 = styled.h1`
  transform: translateY(-80px);
`;

const P1 = styled.p`
  position: absolute;
  transform: translate(97%, 350%);
  font-size: 25px;
  text-align: left;

  div {
    font-size: 35px;
    font-weight: bold;
  }
`;

const P2 = styled.p`
  position: absolute;
  transform: translate(370%, -70%);
  color: black;
  text-align: right;
  font-size: 25px;

  div {
    font-size: 35px;
    font-weight: bold;
  }
`;

const ChoiceImage1 = styled.img`
  width: 650px;
  height: auto;
  transform: translate(-10%, -20%);
  cursor: pointer; // 커서 모양을 포인터로 변경
`;

const ChoiceImage2 = styled.img`
  width: 650px;
  height: auto;
  transform: translate(10%, -20%);
  cursor: pointer; // 커서 모양을 포인터로 변경
`;

const ChoiceCs = () => {
  return (
    <div>
      <ContentWrapper>
        <H1>
          소송장, 어떻게 써야할지 답답하시죠?
          <br />
          법률 상담부터 소송장 작성까지 저희가 도와드리겠습니다
        </H1>
        <P1>
          궁금한게 있다면 <br />
          <div>AI에게 질문하기</div>
        </P1>
        <P2>
          올바르게 작성한건지 궁금할 때 <br />
          <div>AI에게 첨삭받기</div>
        </P2>
      </ContentWrapper>
      <Link to="/chat">
        <ChoiceImage1 src="/assets/ChoiceImage1.png" alt="ai질문" />
      </Link>
      <Link to="/chat2">
        <ChoiceImage2 src="/assets/ChoiceImage2.png" alt="ai질문" />
      </Link>
    </div>
  );
};

export default ChoiceCs;
