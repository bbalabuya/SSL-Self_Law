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

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Tab = styled.button`
  padding: 10px 20px;
  margin: 0 10px;
  border: none;
  border-bottom: 2px solid #ccc;
  background: none;
  color: ${(props) => (props.active ? "#ccc" : "#282c34")};
  cursor: pointer;
  font-weight: bold;
  &:focus {
    outline: none;
  }
`;

const QuestionList = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const QuestionItem = styled.div`
  background-color: #f0f0f0;
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

const QuestionEmail = styled.div`
  font-weight: bold;
  color: black;
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

const AnswerTextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #282c34;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const AnsweredButton = styled(Button)`
  background-color: #999;
`;

const Answer = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [activeTab, setActiveTab] = useState("waiting");

  useEffect(() => {
    // 컴포넌트가 마운트될 때 기본 대기 중인 문의 목록 로드
    fetchQuestions("waiting");
  }, []);

  const fetchQuestions = async (tab) => {
    const endpoint = `${SERVER_URL}/admin/inquery/${
      tab === "waiting" ? "pending" : "answered"
    }?page=0&size=10`;

    try {
      console.log("문의 불러오는 중");
      const response = await fetch(endpoint, {
        credentials: "include", // 쿠키 포함
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const result = await response.json();
      if (result.is_success) {
        setQuestions(result.payload.content);
      } else {
        alert("문의 목록을 불러오는 데 실패했습니다.");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      alert(`문의 목록 로드 중 오류 발생: ${error.message}`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setSelectedQuestion(null);
    fetchQuestions(tab); // 선택된 탭에 따라 문의 목록을 다시 가져옴
  };

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setAnswer(""); // 답변 작성 초기화
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSendAnswer = async () => {
    try {
      console.log("답변 전송 중");
      const response = await fetch(`${SERVER_URL}/admin/inquery`, {
        method: "POST",
        credentials: "true",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedQuestion.id, // 문의 ID
          answer, // 답변 내용
        }),
      });

      if (response.data.is_success) {
        alert("답변이 성공적으로 전송되었습니다.");

        // 답변 완료로 상태 업데이트
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === selectedQuestion.id ? { ...q, isAnswer: true } : q
          )
        );

        setSelectedQuestion(null);
        setAnswer("");
      } else {
        alert("답변 전송에 실패했습니다.");
        console.log(response);
      }
    } catch (error) {
      alert("답변 전송 중 오류가 발생했습니다.");
    }
  };

  const filteredQuestions = questions.filter((question) =>
    activeTab === "waiting" ? !question.isAnswer : question.isAnswer
  );

  return (
    <MainContainer>
      <Header>
        <div>문의 답변 페이지</div>
      </Header>
      <TabContainer>
        <Tab
          active={activeTab === "waiting"}
          onClick={() => handleTabClick("waiting")}
        >
          대기중인 문의
        </Tab>
        <Tab
          active={activeTab === "answered"}
          onClick={() => handleTabClick("answered")}
        >
          답변한 문의
        </Tab>
      </TabContainer>
      <QuestionList>
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div key={question.id}>
              <QuestionItem onClick={() => handleQuestionClick(question)}>
                <QuestionTitle>{question.title}</QuestionTitle>
                <QuestionEmail>{question.userName}</QuestionEmail>
                <QuestionText>{question.content}</QuestionText>
                {question.isAnswer && (
                  <AnsweredButton>답변 완료</AnsweredButton>
                )}
              </QuestionItem>
              {selectedQuestion && selectedQuestion.id === question.id && (
                <AnswerContainer>
                  <QuestionTitle>{selectedQuestion.title}</QuestionTitle>
                  <QuestionEmail>{selectedQuestion.userName}</QuestionEmail>
                  <QuestionText>{selectedQuestion.content}</QuestionText>
                  {activeTab === "waiting" ? (
                    <>
                      <AnswerTextArea
                        placeholder="답변하기..."
                        value={answer}
                        onChange={handleAnswerChange}
                      />
                      <Button onClick={handleSendAnswer}>전송</Button>
                    </>
                  ) : (
                    <AnswerTextArea value={selectedQuestion.answer} readOnly />
                  )}
                </AnswerContainer>
              )}
            </div>
          ))
        ) : (
          <div>문의가 없습니다.</div>
        )}
      </QuestionList>
    </MainContainer>
  );
};

export default Answer;
