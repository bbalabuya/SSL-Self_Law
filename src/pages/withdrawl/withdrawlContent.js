import React, { useState } from "react";
import styled from "styled-components";

const Background = styled.div`
  background-color: #ffecc8;
  width: 100vw;
  height: 84vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  text-align: left;
  color: black;
`;

const Title = styled.h2`
  text-align: center;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 20px;
  height: 20px;
`;

const WithdrawalButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: ${(props) => (props.disabled ? "#ccc" : "white")};
  color: ${(props) => (props.disabled ? "#777" : "black")};
  border: 1px solid ${(props) => (props.disabled ? "#999" : "black")};
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  text-align: center;
`;

const WithdrawalContent = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <Background>
      <ContentContainer>
        <Title>회원탈퇴에 동의하십니까?</Title>
        <p>본 약관에서 다루는 내용</p>
        <p>
          본 서비스 약관을 확인하는 것이 번거로울 수 있다는 점은 이해하지만,
          귀하가 Google 서비스를 사용하면서 Google이 기대할 수 있는 부분과
          Google이 귀하에게 기대하는 부분을 명확히 해두는 것은 중요합니다.
        </p>
        <p>
          본 서비스 약관에는 Google의 사업 운영 방식, Google에 적용되는 법률,
          Google이 항상 진실이라고 여기는 특정 내용이 반영되어 있습니다. 따라서
          귀하가 Google 서비스와 상호작용하면 본 서비스 약관을 근거로 Google과의
          관계가 정의됩니다. 예를 들어, 약관에는 다음과 같은 제목의 주제를
          포함합니다.
        </p>
        <ul>
          <li>
            Google이 기대할 수 있는 사항. Google이 서비스를 제공 및 개발하는
            방법을 설명합니다.
          </li>
          <li>
            귀하가 Google에게 기대하는 사항. Google 서비스 사용과 관련된 일정한
            규칙을 정합니다.
          </li>
          <li>
            Google 서비스 내 콘텐츠. Google 서비스에서 찾을 수 있는 콘텐츠의
            지적 재산권에 대해 설명하며,
          </li>
        </ul>
        <CheckboxContainer>
          <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          <CheckboxLabel>
            위 사항을 모두 읽었으며 회원탈퇴에 동의합니다
          </CheckboxLabel>
        </CheckboxContainer>
        <WithdrawalButton disabled={!isChecked}>회원탈퇴</WithdrawalButton>
      </ContentContainer>
    </Background>
  );
};

export default WithdrawalContent;
