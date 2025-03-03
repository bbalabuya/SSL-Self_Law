import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: gray;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectBox = styled.div`
  width: 50vw;
  background-color: white;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column;
`;

const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #282c34;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const AdminMenu = () => {
  const [newKey, setNewKey] = useState("");
  const [message, setMessage] = useState("");

  const handleKeyChange = (e) => {
    setNewKey(e.target.value);
  };

  const handleChangeKey = async () => {
    if (window.confirm(`관리자 키를 ${newKey}로 변경하시겠습니까?`)) {
      try {
        const response = await axios.post("http://example.com/api/change-key", {
          key: newKey,
        });
        if (response.data.success) {
          setMessage("키가 성공적으로 변경되었습니다.");
        } else {
          setMessage("키 변경에 실패했습니다.");
        }
      } catch (error) {
        setMessage("서버와의 통신에 실패했습니다.");
      }
    }
  };

  return (
    <Container>
      <SelectBox>
        <Link to="/editlawyer">변호사 관리 페이지</Link>
      </SelectBox>
      <SelectBox>
        <Link to="/answer">문의 답변하기</Link>
      </SelectBox>
      <SelectBox>
        <Input
          type="password"
          placeholder="새 관리자 키 입력"
          value={newKey}
          onChange={handleKeyChange}
        />
        <Button onClick={handleChangeKey}>관리자 키 변경하기</Button>
        {message && <p>{message}</p>}
      </SelectBox>
    </Container>
  );
};

export default AdminMenu;
