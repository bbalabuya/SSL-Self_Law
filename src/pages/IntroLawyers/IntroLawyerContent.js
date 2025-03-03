import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// 스타일 정의
const MainContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  background-color: #282c34;
  padding: 20px;
  color: white;
`;

const Nav = styled.nav`
  margin-top: 20px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0;
`;

const NavItem = styled.li`
  margin: 0 15px;
  cursor: pointer;
  font-weight: bold;
  color: white;
`;

const LawyerGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
`;

const LawyerCardContainer = styled.div`
  display: flex; /* Flexbox 사용 */
  flex-direction: column; /* 세로 정렬 */
  justify-content: space-between; /* 요소 간 간격 설정 */
  border: 1px solid #ddd;
  border-radius: 3%;
  text-align: center;
  margin: 8px;
  background-color: #09132d;
  width: 360px;
  height: 475px;
  cursor: pointer;
  padding: 8px; /* padding 추가로 간격 확보 */
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

const LawyerDetailContainer = styled.div`
  display: flex;
  padding: 20px;
  text-align: left;
  max-width: 1250px;
  margin: 20px auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const LawyerDetailPhoto = styled.img`
  width: 30%;
  border-radius: 3%;
  object-fit: cover;
  margin-right: 20px;
`;

const LawyerDetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 70%;
`;

const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  height: 30vh;
`;

const InfoList = styled.ul`
  color: #666;
  width: 45%;
  margin-left: auto;
`;

const CareerList = styled.ul`
  color: #666;
  width: 45%;
`;

const LawyerDetailHeader = styled.h2`
  color: #333;
  margin-right: 10px;
`;

const LawyerDetailSpecialty = styled.h5`
  color: #666;
  margin: 0;
`;

const HeaderSpecialtyContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  width: 120px;
  height: 30px;
  color: #fff;
  background-color: #09132d;
  border: 2px solid black;
  border-radius: 10%;
  margin-top: 5px;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
`;

// LawyerCard 컴포넌트 정의
const LawyerCard = ({ lawyer, onClick }) => {
  return (
    <LawyerCardContainer onClick={() => onClick(lawyer.layerId)}>
      <LawyerPhoto src={lawyer.imageNamel} alt={`${lawyer.imageName}`} />
      <LawyerName>{lawyer.lawyerName}</LawyerName>
      <LawyerSpecialty>{lawyer.lawyerfield}</LawyerSpecialty>
    </LawyerCardContainer>
  );
};

const IntroLawyerContent = () => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/v1/lawyers`);
      setLawyers(response.data.payload || []); // payload만 저장
    } catch (error) {
      console.error("Failed to fetch lawyers", error);
      setLawyers([]); // 에러 발생 시 빈 배열로 초기화
    }
  };

  const fetchLawyerDetails = async (lawyerId) => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/v1/lawyers/${lawyerId}`
      );
      setSelectedLawyer(response.data.payload); // 데이터 키 확인 필요
    } catch (error) {
      console.error("Failed to fetch lawyer details", error);
    }
  };

  const handleSpecialtyClick = (specialty) => {
    setSelectedSpecialty(specialty);
    setSelectedLawyer(null); // 세부사항 보기 상태 초기화
  };

  const handleLawyerClick = (lawyerId) => {
    fetchLawyerDetails(lawyerId); // 변호사 상세 정보 불러오기
  };

  const filteredLawyers = selectedSpecialty
    ? lawyers.filter((lawyer) => lawyer.tagName === selectedSpecialty)
    : lawyers || []; // 항상 배열

  return (
    <MainContainer>
      <Header>
        <h1>변호사 소개</h1>
        <Nav>
          <NavList>
            <NavItem onClick={() => handleSpecialtyClick("상속")}>상속</NavItem>
            <NavItem onClick={() => handleSpecialtyClick("이혼")}>이혼</NavItem>
            <NavItem onClick={() => handleSpecialtyClick("성범죄")}>
              성범죄
            </NavItem>
            <NavItem onClick={() => handleSpecialtyClick("교통")}>교통</NavItem>
            <NavItem onClick={() => handleSpecialtyClick("형사")}>형사</NavItem>
            <NavItem onClick={() => handleSpecialtyClick(null)}>전체</NavItem>
          </NavList>
        </Nav>
      </Header>
      {selectedLawyer ? (
        <div>
          <LawyerDetailContainer>
            <LawyerDetailPhoto
              src={`${SERVER_URL}/images/${selectedLawyer.imageName}`}
              alt={selectedLawyer.name}
            />
            <LawyerDetailInfo>
              <HeaderSpecialtyContainer>
                <LawyerDetailHeader>{selectedLawyer.name}</LawyerDetailHeader>
                <LawyerDetailSpecialty>
                  {selectedLawyer.tagName}
                </LawyerDetailSpecialty>
              </HeaderSpecialtyContainer>
              <ListsContainer>
                <CareerList>
                  <h2>사무실 정보</h2>
                  <ul>
                    <li>
                      사업자 번호: {selectedLawyer.businessRegistrationNumber}
                    </li>
                    <li>사무실 이름: {selectedLawyer.officeName}</li>
                    <li>사무실 주소: {selectedLawyer.officeAddress}</li>
                  </ul>
                </CareerList>
                <InfoList>
                  <h2>변호사 정보</h2>
                  <ul>
                    <li>전화번호: {selectedLawyer.phoneNumber}</li>
                    <li>팩스 번호: {selectedLawyer.faxNumber}</li>
                    <li>이메일: {selectedLawyer.emailAddress}</li>
                  </ul>
                </InfoList>
              </ListsContainer>
            </LawyerDetailInfo>
          </LawyerDetailContainer>
          <BackButton onClick={() => setSelectedLawyer(null)}>
            목록으로
          </BackButton>
        </div>
      ) : (
        <LawyerGrid>
          {filteredLawyers.map((lawyer, index) => (
            <LawyerCard
              key={index}
              lawyer={{
                layerId: lawyer.id,
                lawyerImageUrl: `${SERVER_URL}/images/${lawyer.imageName}`,
                lawyerName: lawyer.name,
                lawyerfield: lawyer.tagName,
              }}
              onClick={handleLawyerClick}
            />
          ))}
        </LawyerGrid>
      )}
    </MainContainer>
  );
};

export default IntroLawyerContent;
