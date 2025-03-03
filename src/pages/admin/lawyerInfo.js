// LawyerCard.js
import React from "react";
import styled from "styled-components";

const LawyerCardContainer = styled.div`
  border: 1px solid #ddd;
  border-radius: 3%;
  text-align: center;
  margin: 8px;
  background-color: #09132d;
  width: 360px;
  height: 525px;
  cursor: pointer;
  position: relative;
`;

const LawyerPhoto = styled.img`
  width: 100%;
  height: 380px;
  border-radius: 3%;
  object-fit: cover;
  margin-bottom: 8px;
`;

const LawyerName = styled.h3`
  font-size: 20px;
  margin: 3px;
  color: #fff;
`;

const LawyerSpecialty = styled.p`
  color: #fff;
  font-size: 15px;
`;

const CardButtons = styled.div`
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  color: white;
  background-color: #d32f2f;
  border: none;
  padding: 5px 15px;
  cursor: pointer;
  border-radius: 4px;
`;

const LawyerInfo = ({ lawyer, onDelete }) => {
  return (
    <LawyerCardContainer>
      <LawyerPhoto src={lawyer.lawyerImage} alt="변호사 사진" />
      <LawyerName>{lawyer.lawyerName}</LawyerName>
      <LawyerSpecialty>{lawyer.lawyerTag}</LawyerSpecialty>
      <CardButtons>
        <Button onClick={() => onDelete(lawyer.id)}>삭제</Button>
      </CardButtons>
    </LawyerCardContainer>
  );
};

export default LawyerInfo;
