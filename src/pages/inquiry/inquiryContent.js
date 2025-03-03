import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom"; // react-router-dom에서 Link 컴포넌트를 가져옵니다.

const SERVER_URL=process.env.REACT_APP_SERVER_URL

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  color: white;
  min-height: 80vh; /* 페이지 하단에 버튼을 배치하기 위한 공간 확보 */
  position: relative; /* 버튼을 절대 위치로 배치하기 위해 부모 컨테이너에 상대 위치 지정 */
`;

const Title = styled.h2`
  padding: 0px 30px;
  margin-bottom: 20px;
  border-bottom: 1px solid gray;
`;

const Input = styled.textarea`
  width: 70%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #333; /* 어두운 배경에 맞는 색상 */
  color: white; /* 텍스트 색상 */
`;

const TitleInput = styled.input`
  width: 70%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: #333; /* 어두운 배경에 맞는 색상 */
  color: white; /* 텍스트 색상 */
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff; /* 제출 버튼 색상 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 10px; /* 제출 버튼과 하단 버튼 간 간격 */
  &:hover {
    background-color: #0056b3; /* 제출 버튼 호버 색상 */
  }
`;

const BottomButtonContainer = styled.div`
  position: absolute;
  bottom: 20px; /* 하단 버튼을 페이지 하단에 고정 */
  display: flex;
  justify-content: center;
  width: 100%;
`;

const BottomButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #ccc; /* 회색 버튼 색상 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #aaa; /* 회색 버튼 호버 색상 */
  }
`;

const InquiryContent = () => {
  const [inquiry, setInquiry] = useState({ title: "", content: "" });

  const handleSubmit = async () => {
    if (window.confirm("제출하시겠습니까? (취소할 수 없습니다)")) {
      try {
        const response = await fetch(`${SERVER_URL}/api/v1/inquery`, {
          method: "POST",
          credentials: "include", // 쿠키를 자동으로 포함시킵니다.
          body: JSON.stringify(inquiry),
        });

        const result = await response.json();

        if (result.is_success) {
          alert("제출이 완료되었습니다.");
          setInquiry({ title: "", content: "" }); // 입력 필드 초기화
        } else {
          alert("제출 중 오류가 발생했습니다. 다시 시도해 주세요.(형식오류)");
        }
      } catch (error) {
        alert("제출 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <Container>
      <Title>겪고 계신 문제를 알려주세요.</Title>
      <TitleInput
        placeholder="제목을 입력해 주세요."
        value={inquiry.title}
        onChange={(e) => setInquiry({ ...inquiry, title: e.target.value })}
      />
      <Input
        placeholder="문제를 상세하게 설명해주시기 바랍니다."
        value={inquiry.content}
        onChange={(e) => setInquiry({ ...inquiry, content: e.target.value })}
      />
      <Button onClick={handleSubmit}>제출</Button>
      <BottomButtonContainer>
        <Link to="/answered">
          <BottomButton>답변 받은 문의 확인</BottomButton>
        </Link>
      </BottomButtonContainer>
    </Container>
  );
};

export default InquiryContent;
