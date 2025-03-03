import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { MdEdit } from "react-icons/md";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
const Document_URL = `${SERVER_URL}/api/v1/lawsuit`; // 실제 서버 주소로 대체하세요.

const Container = styled.div`
  padding: 0px 150px;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 왼쪽 정렬 */
  padding: 10px;
  border-bottom: 1px solid;
  font-size: 23px;
  color: white;
`;

const KeySpan = styled.span`
  flex: 3;
  font-size: 23px;
  color: white;
  text-align: left;
`;

const KeyInput = styled.input`
  flex: 3;
  font-size: 23px;
  border: none;
  background: none;
  color: white;
  &:focus {
    outline: none;
    border-bottom: 1px solid #000;
  }
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: white;
`;

const SaveButton = styled.button`
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const Time = styled.div`
  flex: 2;
  color: white;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  flex: 2;
  margin-left: auto; /* 오른쪽으로 정렬 */
`;

const Button = styled.button`
  padding: 8px;
  background-color: #7fb1bf;
  color: white;
`;

const ButtonSeparator = styled.span`
  margin: 0 8px;
  color: white;
`;

const DocumentContent = () => {
  const [documents, setDocuments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    fetchDocuments(); // 페이지 로드 시 문서 목록을 가져옵니다.
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(Document_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // JWT 토큰을 헤더에 추가
        },
      });
      setDocuments(response.data.payload); // 서버에서 받은 문서 목록을 설정
    } catch (error) {
      console.error("Failed to fetch documents", error);
    }
  };

  const handleDownload = async (id, storedFileName) => {
    try {
      const response = await axios({
        url: `${Document_URL}/${id}/download`,
        method: "GET",
        responseType: "blob", // 중요한 부분입니다. 응답 데이터를 Blob으로 설정
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`, // JWT 토큰을 헤더에 추가
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", storedFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download document", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(Document_URL, {
          withCredentials: "true",
          data: {
            lawSuitIdList: [id], // 삭제할 소송장의 ID를 배열로 전달
          },
        });

        if (response.data.is_success) {
          fetchDocuments(); // 문서 목록 갱신
        } else {
          console.error("Failed to delete document", response.data.message);
        }
      } catch (error) {
        console.error("Failed to delete document", error);
      }
    }
  };

  const handleEditClick = (id, title) => {
    setEditingId(id);
    setNewTitle(title);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSaveClick = async (id) => { // 이름 저장 버튼시 작동(다운로드 아님)
    try {
      const response = await axios.patch(
        `${SERVER_URL}`,
        {
          lawSuitId: id,
          updateOriginalFileName: newTitle,
        },
        {
          withCredentials: "true",
        }
      );
      if (response.data.is_success) {
        setEditingId(null);
        setNewTitle("");
        fetchDocuments(); // 문서 목록 갱신
      } else {
        console.error("Failed to update document title", response.data.message);
      }
    } catch (error) {
      console.error("Failed to update document title", error);
    }
  };

  return (
    <div>
      <h1 style={{ color: "white" }}>소송장 관리하기</h1>
      <Container>
        {documents.map((item) => (
          <List key={item.id}>
            {editingId === item.id ? (
              <>
                <KeyInput
                  type="text"
                  value={newTitle}
                  onChange={handleTitleChange}
                />
                <SaveButton onClick={() => handleSaveClick(item.id)}>
                  저장하기
                </SaveButton>
              </>
            ) : (
              <>
                <KeySpan>{item.originalFileName}</KeySpan>
                <EditButton
                  onClick={() =>
                    handleEditClick(item.id, item.originalFileName)
                  }
                >
                  <MdEdit />
                </EditButton>
              </>
            )}
            <Time>{item.createAt}</Time> {/* item의 createAt 속성을 표시 */}
            <ButtonGroup>
              <Button
                onClick={() => handleDownload(item.id, item.storedFileName)}
              >
                다운로드
              </Button>
              <ButtonSeparator>|</ButtonSeparator>
              <Button onClick={() => handleDelete(item.id)}>삭제하기</Button>
            </ButtonGroup>
          </List>
        ))}
      </Container>
    </div>
  );
};

export default DocumentContent;
