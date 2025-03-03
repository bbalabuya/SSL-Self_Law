import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const MainContainer = styled.div`
  text-align: center;
  font-family: Arial, sans-serif;
  overflow: auto;
  height: 100vh;
`;

const Header = styled.header`
  background-color: gray;
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

const Button = styled.button`
  margin: 10px;
  padding: 10px 20px;
  color: white;
  background-color: #09132d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const LawyerCardContainer = styled.div`
  background-color: #f4f4f4;
  border: 1px solid #ccc;
  margin: 10px;
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  text-align: center;
`;

const LawyerPhoto = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
`;

const LawyerName = styled.h3`
  margin: 10px 0;
`;

const LawyerSpecialty = styled.p`
  font-style: italic;
  color: #555;
`;

const CardButtons = styled.div`
  margin-top: 10px;
`;

const LawyerCard = ({ lawyer, onDelete, onEdit }) => {
  const imageBasePath = `${SERVER_URL}/images/`;
  return (
    <LawyerCardContainer>
      <LawyerPhoto
        src={`${imageBasePath}${lawyer.imageName}`}
        alt={lawyer.name}
      />
      <LawyerName>{lawyer.name}</LawyerName>
      <LawyerSpecialty>{lawyer.tagName}</LawyerSpecialty>
      <CardButtons>
        <Button onClick={() => onDelete(lawyer.id)}>삭제</Button>
        <Button onClick={() => onEdit(lawyer.id)}>수정</Button>{" "}
        {/* Add Edit Button */}
      </CardButtons>
    </LawyerCardContainer>
  );
};

const EditLawyer = () => {
  const [lawyers, setLawyers] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      console.log("변호사 목록 불러오는 중");
      const response = await fetch(`${SERVER_URL}/api/v1/lawyers`);
      if (!response.ok) {
        throw new Error("Failed to fetch lawyers");
      }
      const data = await response.json();
      console.log("Received data:", data);

      if (data.status === "OK" && data.code === "200") {
        console.log("목록 조회 성공");
        setLawyers(data.payload);
      } else {
        console.error("Unexpected response structure:", data);
      }
    } catch (error) {
      console.error("Failed to fetch lawyers", error);
    }
  };

  const handleDeleteLawyer = async (id) => {
    try {
      console.log("삭제 클릭함");
      const response = await axios.delete(
        `${SERVER_URL}/api/v1/admin/lawyers/${id}`,
        {
          withCredentials: true, // This will send cookies with the request
        }
      );
      if (response.data.is_success) {
        alert("변호사 삭제 성공");
      }
    } catch (error) {
      console.error("Failed to delete lawyer", error);
    }
  };

  const handleAddNewLawyer = () => {
    navigate("/addLawyer");
  };

  const handleEditLawyer = (id) => {
    navigate("/addLawyer", { state: { id } });
  };

  const filteredLawyers = selectedSpecialty
    ? lawyers.filter((lawyer) => lawyer.tagName === selectedSpecialty)
    : lawyers;

  return (
    <MainContainer>
      <Header>
        <h1>변호사 소개</h1>
        <Nav>
          <NavList>
            <NavItem onClick={() => setSelectedSpecialty("상속")}>상속</NavItem>
            <NavItem onClick={() => setSelectedSpecialty("이혼")}>이혼</NavItem>
            <NavItem onClick={() => setSelectedSpecialty("성범죄")}>
              성범죄
            </NavItem>
            <NavItem onClick={() => setSelectedSpecialty("교통")}>교통</NavItem>
            <NavItem onClick={() => setSelectedSpecialty("형사")}>형사</NavItem>
            <NavItem onClick={() => setSelectedSpecialty(null)}>전체</NavItem>
          </NavList>
        </Nav>
      </Header>
      <Button onClick={handleAddNewLawyer}>새 변호사 추가</Button>
      <LawyerGrid>
        {filteredLawyers.map((lawyer) => (
          <LawyerCard
            key={lawyer.id}
            lawyer={lawyer}
            onDelete={handleDeleteLawyer}
            onEdit={handleEditLawyer} // Pass the edit handler to the LawyerCard
          />
        ))}
      </LawyerGrid>
    </MainContainer>
  );
};

export default EditLawyer;
