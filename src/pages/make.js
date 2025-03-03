import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios"; // Import axios for API calls

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  padding: 20px;
  width: 100%;
  height: 80vh;
  box-sizing: border-box;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.h2`
  font-size: 14px;
  color: #9e9e9e;
  margin-bottom: 20px;
`;

const Message = styled.div`
  font-size: 18px;
  color: #000;
  text-align: center;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f1f1f1;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`;

const TextArea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  height: 100px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f1f1f1;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const FinalScreen = styled.div`
  text-align: center;
  padding: 20px;
`;

const DownloadLink = styled.a`
  display: block;
  margin: 20px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  color: #000;
  background-color: #f8f8f8;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const AiConsultation = () => {
  const [selectedForm, setSelectedForm] = useState(""); // Tracks which form is selected
  const [defendantCount, setDefendantCount] = useState(""); // Number of defendants
  const [caseDescription, setCaseDescription] = useState(""); // Description of the case
  const [claimAmount, setClaimAmount] = useState(""); // Claim amount (for 민사)
  const [damageScale, setDamageScale] = useState(""); // Damage scale (for 형사)
  const [showNextPage, setShowNextPage] = useState(false); // Tracks if the next page is displayed
  const [showAmountPage, setShowAmountPage] = useState(false); // Tracks if the amount page is displayed
  const [loading, setLoading] = useState(false); // Simulates loading screen
  const [completed, setCompleted] = useState(false); // Tracks if the process is completed
  const [downloadLink, setDownloadLink] = useState(""); // Tracks the file download link
  const [fileName, setFileName] = useState(""); // Stores the generated file name

  // Handle button click to set the selected form
  const handleSelectForm = (form) => {
    setSelectedForm(form);
  };

  // Handle input change for individual fields
  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
  };

  // Handle "다음" button click
  const handleNext = () => {
    if (selectedForm && defendantCount) {
      setShowNextPage(true);
    } else {
      alert("모든 필드를 입력해주세요.");
    }
  };

  // Handle submit for 피해 내용
  const handleSubmitContent = () => {
    if (caseDescription) {
      setShowAmountPage(true);
    } else {
      alert("내용을 입력해주세요.");
    }
  };

  // Handle final submit and generate file
  const handleSubmit = async () => {
    setLoading(true);

    const data = {
      doc_type: selectedForm === "소송장" ? "101" : "201",
      defendant_count: defendantCount,
      case_description: caseDescription,
      claim_amount: selectedForm === "소송장" ? claimAmount : null,
      damage_scale: selectedForm === "고소장" ? damageScale : null,
    };

    try {
      const response = await axios.post(
        `${SERVER_URL}/api/v1/ollama/doc/make`,
        data,
        { responseType: "blob", withCredentials: true }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(blob);
        setDownloadLink(blobUrl);
        setFileName("생성된_문서.pdf");
        setCompleted(true);
      } else {
        alert("파일 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file download for a predefined document
  const handleDownload = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URL}/api/v1/lawsuit/download/37748dbe-8006-471a-88fc-eceb00b7811b.docx`,
        {
          responseType: "blob",
          withCredentials: true,
        }
   );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
      setFileName("다운로드된_파일.docx");
    } catch (error) {
      console.error("파일 다운로드 중 오류 발생:", error);
    }
  };

  // Reset the form
  const handleReset = () => {
    setSelectedForm("");
    setDefendantCount("");
    setCaseDescription("");
    setClaimAmount("");
    setDamageScale("");
    setShowNextPage(false);
    setShowAmountPage(false);
    setCompleted(false);
    setDownloadLink("");
    setFileName("");
  };

  // Conditional Rendering
  return (
    <Container>
      {loading ? (
        <Message>
          소송장/고소장을 만들고 있습니다. <br />
          잠시만 기다려주세요.
        </Message>
      ) : completed ? (
        <FinalScreen>
          <Message>
            작성이 완료되었습니다. <br />
            개인정보 부분은 직접 입력하셔야 하며 내용을 꼭 확인하시기 바랍니다.
          </Message>
          {downloadLink && (
            <Button onClick={handleDownload}>
              {fileName ? `${fileName} 다운로드` : "DOC 파일 다운로드"}
            </Button>
          )}
          <ButtonGroup>
            <Button onClick={handleReset}>다시 생성하기</Button>
            <Button
              onClick={() => (window.location.href = "/manage-documents")}
            >
              소송장 관리 페이지로 이동하기
            </Button>
          </ButtonGroup>
        </FinalScreen>
      ) : !selectedForm ? (
        <>
          <Header>생성형 AI 고소장, 소송장 상담</Header>
          <Message>
            안녕하세요! 저는 스스로의 AI예요! <br />
            작성을 도와드릴게요! 어떤 것을 생성하고 싶으신가요?
          </Message>
          <ButtonGroup>
            <Button onClick={() => handleSelectForm("고소장")}>고소장</Button>
            <Button onClick={() => handleSelectForm("소송장")}>소송장</Button>
          </ButtonGroup>
        </>
      ) : !showNextPage ? (
        <Form>
          <Message>
            {selectedForm} 작성을 도와드릴게요! 피고인이 몇 명인가요?
          </Message>
          <label style={{ color: "black" }}>숫자로 입력해주세요</label>
          <Input
            type="number"
            value={defendantCount}
            onChange={handleInputChange(setDefendantCount)}
            placeholder="숫자를 입력해주세요"
          />
          <SubmitButton onClick={handleNext}>다음</SubmitButton>
        </Form>
      ) : !showAmountPage ? (
        <Form>
          <Message>
            피해 규모가 어느 정도인지 적어주시겠어요?
            <br />
            상세히 적어주시면 도움이 됩니다.
          </Message>
          <TextArea
            value={caseDescription}
            onChange={handleInputChange(setCaseDescription)}
            placeholder="피해 규모를 작성해주세요..."
          />
          <SubmitButton onClick={handleSubmitContent}>다음</SubmitButton>
        </Form>
      ) : selectedForm === "소송장" ? (
        <Form>
          <Message>
            소송장 작성을 계속합니다.
            <br />
            피해 금액을 입력해주세요.
          </Message>
          <label style={{ color: "black" }}>숫자만 입력해주세요</label>
          <Input
            type="text"
            value={claimAmount}
            onChange={handleInputChange(setClaimAmount)}
            placeholder="만원 단위로 입력해주세요"
          />
          <SubmitButton onClick={handleSubmit}>완료</SubmitButton>
        </Form>
      ) : (
        <Form>
          <Message>
            고소장 작성을 계속합니다.
            <br />
            피해 내용을 적어주세요.
          </Message>
          <TextArea
            value={damageScale}
            onChange={handleInputChange(setDamageScale)}
            placeholder="피해 내용을 상세히 작성해주세요..."
          />
          <SubmitButton onClick={handleSubmit}>완료</SubmitButton>
        </Form>
      )}
    </Container>
  );
};

export default AiConsultation;
