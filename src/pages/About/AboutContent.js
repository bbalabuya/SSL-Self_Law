import React from "react";
import styled from "styled-components";

const AboutContainer = styled.div`
  padding: 40px;
  text-align: center;
`;

const AboutContent = () => {
  return (
    <AboutContainer>
      <h1>About Us</h1>
      <p>스스LAW는 최고의 법률 상담 서비스를 제공합니다.</p>
    </AboutContainer>
  );
};

export default AboutContent;
