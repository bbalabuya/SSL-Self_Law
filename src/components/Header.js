// Header.js
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { IoMdPerson } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
// Styled components

const SERVER_URL = process.env.REACT_APP_SERVER_URL;
axios.defaults.withCredentials = true; // withCredentials 전역 설정

const TopBar = styled.div`
  display: flex;
  justify-content: flex-start;
  background-color: #111;
  padding: 15px 30px;
  color: #fff;
  font-size: 13px;
  border-bottom: 1px solid #fff;

  a {
    color: #fff;
    text-decoration: none;
    margin-right: 30px;

    &:hover,
    &:visited {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: transparent;
  color: #fff;
`;

const Logo = styled.div`
  font-family: "", cursive;
  font-size: 36px;
  display: flex;
  align-items: center;

  img {
    height: 50px;
    margin-right: 10px;
  }
`;

const Nav = styled.nav`
  ul {
    display: flex;
    list-style: none;
    gap: 100px;
    margin-left: 300px;
  }

  li {
    cursor: pointer;
    white-space: nowrap;
  }

  a {
    color: #fff;
    text-decoration: none;
    font-size: 18px;

    &:hover,
    &:visited {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  margin-right: 100px;

  svg {
    cursor: pointer;
  }
`;

const DropdownBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 120px;
  right: 95px;
  background-color: #09132d;
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  a {
    color: #fff;
    text-decoration: none;
    margin: 5px 0;

    &:hover,
    &:visited {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const MenuDropdownBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 120px;
  right: 135px;
  background-color: #09132d;
  color: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  a {
    color: #fff;
    text-decoration: none;
    margin: 5px 0;

    &:hover,
    &:visited {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const DropMenuStyle = styled.div`
  position: absolute;
  top: 143px;
  left: 0;
  width: 100%;
  background-color: #09132d;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;

const DropMenuContainer = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: repeat(3, 40px);
  grid-template-columns: repeat(3, 170px);
  white-space: nowrap;
  left: 50%;
`;

const DropMenuList = styled.div`
  padding: 10px;
  background-color: #09132d;
  color: white;

  a {
    color: #fff;
    text-decoration: none;

    &:hover,
    &:visited {
      color: #fff;
      text-decoration: none;
    }
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 초기값 false
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const menuDropdownRef = useRef(null);
  const dropMenuRef = useRef(null);
  const headerContainerRef = useRef(null);

  // 1시간 유효 시간 체크
  const checkTokenValidity = () => {
    const tokenTimestamp = parseInt(
      localStorage.getItem("token-timestamp"), // 문자열 가져오기
      10 // 10진수로 변환
    );

    const currentTime = Date.now(); // 숫자

    if (tokenTimestamp) {
      const elapsedTime = currentTime - tokenTimestamp; // 숫자끼리 계산
      if (elapsedTime >= 3600000) {
        // 1시간 초과
        Cookies.remove("accessToken");
        localStorage.removeItem("token-timestamp");
        setIsLoggedIn(false);
        alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
      } else {
        setIsLoggedIn(true);
      }
    } else {
      setIsLoggedIn(false);
    }
  };

  // 컴포넌트가 마운트될 때 유효 시간 체크
  useEffect(() => {
    checkTokenValidity();
  }, []);

  // userDropdown을 토글하는 함수
  const toggleUserDropdown = () => {
    setActiveDropdown((prev) =>
      prev === "userDropdown" ? null : "userDropdown"
    );
  };

  //로그인 확인
  const toggleMenuDropdown = () => {
    if (isLoggedIn) {
      alert("먼저 로그인 해주세요");
      navigate("/login");
    } else {
      setActiveDropdown((prev) =>
        prev === "menuDropdown" ? null : "menuDropdown"
      );
    }
  };

  // dropMenu를 마우스로 오버했을 때 보여주는 함수
  const handleMouseEnter = () => {
    setActiveDropdown("dropMenu");
  };

  // dropMenu에서 마우스를 벗어났을 때 드롭다운 닫기
  const handleMouseLeave = (event) => {
    if (
      headerContainerRef.current &&
      dropMenuRef.current &&
      event.relatedTarget instanceof Node &&
      !headerContainerRef.current.contains(event.relatedTarget) &&
      !dropMenuRef.current.contains(event.relatedTarget)
    ) {
      setActiveDropdown(null);
    }
  };

  // 드롭메뉴의 항목을 클릭했을 때 로그인을 체크하는 함수
  const handleMenuClick = (link) => {
    if (isLoggedIn) {
      alert("로그인해주세요");
      navigate("/login");
    } else {
      navigate(link);
    }
  };

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await axios.get(`${SERVER_URL}/logout`, {
        withCredentials: true,
      });

      Cookies.remove("accessToken");
      localStorage.removeItem("token-timestamp");
      setIsLoggedIn(false);
      alert("로그아웃 성공");
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("문제가 생겼습니다. 다시 로그인 해주세요.");
      setIsLoggedIn(false);
    }
  };

  return (
    <>
      <TopBar>
        <Link to="/intro">웹사이트 소개</Link>
        <Link to="/developer">개발자 소개</Link>
      </TopBar>
      <HeaderContainer
        ref={headerContainerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Logo>
          <img src="../assets/logo.png" alt="스스LAW 로고" />
          <span>스스LAW</span>
        </Logo>
        <Nav>
          <ul>
            <li>
              <Link to="/">홈</Link>
            </li>
            <li>
              <Link to="/choicechat">Ai 상담</Link>
            </li>
            <li>
              <Link to="/introLawyer">변호사 소개</Link>
            </li>
            <li>자료실</li>
          </ul>
        </Nav>
        <Icons>
          <FaBars size={20} onClick={toggleMenuDropdown} />
          <IoMdPerson size={20} onClick={toggleUserDropdown} />

          {activeDropdown === "menuDropdown" && (
            <MenuDropdownBox ref={menuDropdownRef}>
              <Link to="/faq">FAQ</Link>
              <Link to="/inquiry">문의하기</Link>
              <Link to="/useRules">약관 확인</Link>
            </MenuDropdownBox>
          )}

          {activeDropdown === "userDropdown" && (
            <DropdownBox ref={dropdownRef}>
              {isLoggedIn ? (
                <>
                  <Link onClick={handleLogout}>로그아웃</Link>
                  <Link to="/withdrawl">회원탈퇴</Link>
                </>
              ) : (
                <Link to="/login">로그인</Link>
              )}
            </DropdownBox>
          )}
        </Icons>
      </HeaderContainer>

      {activeDropdown === "dropMenu" && (
        <DropMenuStyle ref={dropMenuRef} onMouseLeave={handleMouseLeave}>
          <DropMenuContainer>
            <DropMenuList onClick={() => handleMenuClick("/chat")}>
              AI에게 질문하기
            </DropMenuList>
            <DropMenuList onClick={() => handleMenuClick("/introlawyer")}>
              변호사 목록
            </DropMenuList>
            <DropMenuList onClick={() => handleMenuClick("/document")}>
              소송장 관리하기
            </DropMenuList>
            <DropMenuList onClick={() => handleMenuClick("/edit")}>
              AI에게 첨삭받기
            </DropMenuList>
            <DropMenuList />
            <DropMenuList onClick={() => handleMenuClick("/search")}>
              법률정보 검색하기
            </DropMenuList>
            <DropMenuList onClick={() => handleMenuClick("/make")}>
              AI로 소송장 만들기
            </DropMenuList>
          </DropMenuContainer>
        </DropMenuStyle>
      )}
    </>
  );
};

export default Header;
