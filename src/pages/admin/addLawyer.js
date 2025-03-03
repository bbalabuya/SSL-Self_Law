import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

const PageContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/path-to-your-background-image.jpg") no-repeat center center
    fixed;
  background-size: cover;
`;

const AddEditForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 1200px;
  background: rgba(255, 255, 255, 0.9);
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Select = styled.select`
  margin: 10px 0;
  padding: 10px;
  width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  color: white;
  background-color: #09132d;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ImagePreview = styled.img`
  margin-top: 20px;
  max-width: 300px;
  max-height: 300px;
  border-radius: 4px;
  object-fit: cover;
`;

const AddLawyer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 상태 관리 및 초기화
  const lawyerId = location.state?.id; // state에서 lawyerId 가져오기
  const [formData, setFormData] = useState({
    lawyerName: "",
    lawyerIntro: "",
    lawyerTag: "",
    lawyerBusinessNumber: "",
    lawyerOfficeName: "",
    lawyerOfficeAddress: "",
    lawyerPhoneNumber: "",
    lawyerFaxNumber: "",
    lawyerEmail: "",
  });
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 여부

  // 2. lawyerId가 존재하면 데이터 가져오기
  useEffect(() => {
    if (lawyerId) {
      console.log("lawyerID : " + lawyerId);
      setIsEditing(true);
      fetchLawyerData();
    }
  }, [lawyerId]);

  // 3. 특정 변호사 데이터 가져오기 함수
  const fetchLawyerData = async () => {
    try {
      const response = await axios.get(`${URL}/${lawyerId}`, {
        withCredentials: "true",
      });
      const data = response.data.payload;

      console.log("받은 데이터:", data);

      setFormData({
        lawyerName: data.name,
        lawyerIntro: data.intro,
        lawyerTag: data.tagName,
        lawyerBusinessNumber: data.businessRegistrationNumber,
        lawyerOfficeName: data.officeName,
        lawyerOfficeAddress: data.officeAddress,
        lawyerPhoneNumber: data.phoneNumber,
        lawyerFaxNumber: data.faxNumber,
        lawyerEmail: data.emailAddress,
      });

      setImagePreview(`${data.imageName}`); // 이미지 URL 설정

      // 상태 업데이트 후 확인
      console.log("업데이트된 formData:", {
        lawyerName: data.name,
        lawyerIntro: data.intro,
        lawyerTag: data.tagName,
        lawyerBusinessNumber: data.businessRegistrationNumber,
        lawyerOfficeName: data.officeName,
        lawyerOfficeAddress: data.officeAddress,
        lawyerPhoneNumber: data.phoneNumber,
        lawyerFaxNumber: data.faxNumber,
        lawyerEmail: data.emailAddress,
      });
    } catch (error) {
      console.error("Failed to fetch lawyer data", error);
    }
  };

  // 4. 입력 필드 변경 핸들러
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 5. 이미지 선택 및 미리보기 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imageFile: file });
    }
  };

  // 6. 폼 제출 핸들러
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // JSON 데이터를 Blob으로 추가
    const jsonFormData = JSON.stringify({
      name: formData.lawyerName,
      intro: formData.lawyerIntro,
      tagName: formData.lawyerTag,
      businessRegistrationNumber: formData.lawyerBusinessNumber,
      officeName: formData.lawyerOfficeName,
      officeAddress: formData.lawyerOfficeAddress,
      phoneNumber: formData.lawyerPhoneNumber,
      faxNumber: formData.lawyerFaxNumber,
      emailAddress: formData.lawyerEmail,
    });
    const jsonBlob = new Blob([jsonFormData], { type: "application/json" });
    formDataToSend.append("request", jsonBlob);

    // 이미지 파일 추가 (있는 경우에만)
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    // 전송할 FormData 상세 출력
    console.log("전송할 FormData:");
    formDataToSend.forEach((value, key) => {
      if (value instanceof Blob) {
        console.log(`${key}: Blob`, {
          type: value.type,
          size: value.size,
          content:
            value.type === "application/json" ? jsonFormData : "[이미지 파일]",
        });
      } else {
        console.log(`${key}: ${value}`);
      }
    });

    try {
      if (isEditing) {
        console.log("isEditing : ON");
        // 기존 변호사 정보 수정
        const response = await axios.put(
          `${SERVER_URL}/api/v1/admin/lawyers/${lawyerId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        if (response.data.is_success) {
          alert("변호사 정보가 수정되었습니다.");
          navigate(-1);
        }
      } else {
        console.log("isEditing : OFF");
        // 새로운 변호사 추가
        await axios.post(`${SERVER_URL}/api/v1/admin/lawyers`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });
        alert("새 변호사가 추가되었습니다.");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to save lawyer", error);
      alert("저장 실패");
    }
  };
  return (
    <PageContainer>
      <AddEditForm onSubmit={handleFormSubmit}>
        <FormSection>
          <Input
            type="text"
            name="lawyerName"
            placeholder="이름"
            value={formData.lawyerName}
            onChange={handleFormChange}
            required
          />
          <Input
            type="text"
            name="lawyerIntro"
            placeholder="한줄소개"
            value={formData.lawyerIntro}
            onChange={handleFormChange}
            required
          />
          <Select
            name="lawyerTag"
            value={formData.lawyerTag}
            onChange={handleFormChange}
            required
          >
            <option value="변호사 분야 선택">변호사 분야 선택</option>
            <option value="상속">상속</option>
            <option value="이혼">이혼</option>
            <option value="성범죄">성범죄</option>
            <option value="교통">교통</option>
            <option value="형사">형사</option>
          </Select>
          <Input
            type="text"
            name="lawyerBusinessNumber"
            placeholder="변호사 사업자 번호"
            value={formData.lawyerBusinessNumber}
            onChange={handleFormChange}
            required
          />
          <Input
            type="text"
            name="lawyerOfficeName"
            placeholder="사무실 이름"
            value={formData.lawyerOfficeName}
            onChange={handleFormChange}
            required
          />
        </FormSection>

        <FormSection>
          <Input
            type="text"
            name="lawyerOfficeAddress"
            placeholder="사무실 위치"
            value={formData.lawyerOfficeAddress}
            onChange={handleFormChange}
            required
          />
          <Input
            type="text"
            name="lawyerPhoneNumber"
            placeholder="변호사 전화번호"
            value={formData.lawyerPhoneNumber}
            onChange={handleFormChange}
            required
          />
          <Input
            type="text"
            name="lawyerFaxNumber"
            placeholder="Fax 번호"
            value={formData.lawyerFaxNumber}
            onChange={handleFormChange}
            required
          />
          <Input
            type="text"
            name="lawyerEmail"
            placeholder="변호사 이메일"
            value={formData.lawyerEmail}
            onChange={handleFormChange}
            required
          />
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <ImagePreview src={imagePreview} alt="미리보기" />}
        </FormSection>

        <Button type="submit" onChange={handleFormSubmit}>
          {isEditing ? "수정" : "저장"}
        </Button>
      </AddEditForm>
    </PageContainer>
  );
};

export default AddLawyer;
