import React, { useState, useEffect } from "react";
import styled from "styled-components";

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
  display: flex;
  justify-content: center;
  align-items: center;
`;

const QuestionList = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionItem = styled.div`
  background-color: ${(props) => (props.answered ? "#d9d9d9" : "#f0f0f0")};
  padding: 20px;
  margin-bottom: 10px;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const QuestionTitle = styled.div`
  font-weight: bold;
  color: black;
  margin-bottom: 5px;
  align-self: flex-start;
`;

const QuestionText = styled.div`
  margin-top: 10px;
  color: black;
  align-self: flex-start;
`;

const AnswerContainer = styled.div`
  background-color: #d9d9d9;
  padding: 20px;
  margin: 10px 0;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AnswerText = styled.div`
  margin-top: 10px;
  color: black;
  align-self: flex-start;
`;

const Status = styled.div`
  font-weight: bold;
  color: ${(props) => (props.answered ? "green" : "red")};
  margin-top: 10px;
`;

const Answered = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [questionDetails, setQuestionDetails] = useState(null);

  //처음 문의 불러오기
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const pendingResponse = await fetch(
          `${SERVER_URL}/api/v1/inquery/my/pending`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // 로컬 스토리지에서 토큰 가져오기
            },
          }
        );

        const answeredResponse = await fetch(
          `${SERVER_URL}/api/v1/inquery/my/answered`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // 로컬 스토리지에서 토큰 가져오기
            },
          }
        );

        const pendingResult = await pendingResponse.json();
        const answeredResult = await answeredResponse.json();

        if (pendingResult.is_success && answeredResult.is_success) {
          const combinedQuestions = [
            ...pendingResult.payload,
            ...answeredResult.payload,
          ];
          const sortedQuestions = combinedQuestions.sort((a, b) => b.id - a.id);
          setQuestions(sortedQuestions);
        } else {
          alert("문의 목록을 불러오는 데 실패했습니다.");
        }
      } catch (error) {
        alert("문의 목록을 불러오는 도중 오류가 발생했습니다.");
      }
    };

    fetchQuestions();
  }, []);

  //문의 자세히 보기
  const fetchQuestionDetails = async (id) => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/inquery/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // 로컬 스토리지에서 토큰 가져오기
        },
      });

      const result = await response.json();

      if (result.is_success) {
        setQuestionDetails(result.payload);
      } else {
        alert("문의 상세 정보를 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      alert("문의 상세 정보를 불러오는 도중 오류가 발생했습니다.");
    }
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    fetchQuestionDetails(question.id); // 클릭한 문의의 상세 정보를 가져옴
  };

  return (
    <MainContainer>
      <Header>
        <div>문의 확인 페이지</div>
      </Header>
      <QuestionList>
        {questions.map((question) => (
          <div key={question.id}>
            <QuestionItem
              answered={question.isAnswer}
              onClick={() => handleQuestionClick(question)}
            >
              <QuestionTitle>{question.title}</QuestionTitle>
              <QuestionText>{question.content}</QuestionText>
              <Status answered={question.isAnswer}>
                {question.isAnswer ? "답변 받음" : "문의 대기중"}
              </Status>
            </QuestionItem>
            {selectedQuestion &&
              selectedQuestion.id === question.id &&
              questionDetails && (
                <AnswerContainer>
                  <QuestionTitle>{questionDetails.title}</QuestionTitle>
                  <QuestionText>{questionDetails.content}</QuestionText>
                  {questionDetails.answer ? (
                    <AnswerText>{questionDetails.answer}</AnswerText>
                  ) : (
                    <AnswerText>아직 답변이 등록되지 않았습니다.</AnswerText>
                  )}
                </AnswerContainer>
              )}
          </div>
        ))}
      </QuestionList>
    </MainContainer>
  );
};

export default Answered;
