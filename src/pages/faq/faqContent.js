import React, { useState } from "react";
import styled from "styled-components";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const ContentBox = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 70vw;
  height: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Question = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  width: 100%;
  padding: 15px 0;
  cursor: pointer;
  &:not(:first-child) {
    border-top: 1px solid gray;
  }
`;

const Answer = styled.div`
  padding: 10px 0;
  color: black;
`;

const FaqContent = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ContentBox>
      <Question onClick={() => toggleQuestion(0)}>
        <span>테스트</span>
        {openIndex === 0 ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Question>
      {openIndex === 0 && <Answer>테스트에 대한 답변 내용</Answer>}

      <Question onClick={() => toggleQuestion(1)}>
        <span>테스트2</span>
        {openIndex === 1 ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Question>
      {openIndex === 1 && <Answer>테스트2에 대한 답변 내용</Answer>}

      <Question onClick={() => toggleQuestion(2)}>
        <span>테스트3</span>
        {openIndex === 2 ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Question>
      {openIndex === 2 && <Answer>테스트3에 대한 답변 내용</Answer>}

      <Question onClick={() => toggleQuestion(3)}>
        <span>테스트4</span>
        {openIndex === 3 ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Question>
      {openIndex === 3 && <Answer>테스트4에 대한 답변 내용</Answer>}

      <Question onClick={() => toggleQuestion(4)}>
        <span>테스트5</span>
        {openIndex === 4 ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </Question>
      {openIndex === 4 && <Answer>테스트5에 대한 답변 내용</Answer>}
    </ContentBox>
  );
};

export default FaqContent;
