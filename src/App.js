import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import HomePage from "./pages/Home/HomePage";
import AboutPage from "./pages/About/AboutPage";
import IntroLawyerPage from "./pages/IntroLawyers/IntroLawyerPage";
import LoginPage from "./pages/Login/LoginPage";
import AdminPage from "./pages/Login/AdminPage";
import UseRulesPage from "./pages/useRules/useRulesPage";
import WithdrawlPage from "./pages/withdrawl/withdrawlPage";
import ChatPage from "./pages/chat/chatPage";
import DocumentPage from "./pages/document/DocumentPage";
import FaqPage from "./pages/faq/faqPage";
import InquiryPage from "./pages/inquiry/inquiryPage";
import SearchPage from "./pages/search/searchPage";
import ChoicePage from "./pages/Choicechat/ChoicePage";
import EditPage from "./pages/edit/editPage";
import AdminMenu from "./pages/admin/adminMenu";
import EditLawyer from "./pages/admin/editLawyer";
import Answer from "./pages/admin/answer";

import AddLawyer from "./pages/admin/addLawyer";
import LawyerInfo from "./pages/admin/lawyerInfo";

import Answered from "./pages/inquiry/answered";
import Make from "./pages/make";

const GlobalStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
  }
`;

const AppContainer = styled.div`
  background: url(${process.env.PUBLIC_URL}/assets/background.png) no-repeat
    center center;
  background-size: cover;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #fff;
  text-align: center;
  overflow: hidden; /* 스크롤바 숨기기 */
`;

const Content = styled.div`
  flex: 1;
`;

const App = () => {
  const location = useLocation();
  const isSpecialPage =
    location.pathname === "/admin" ||
    location.pathname === "/adminmenu" ||
    location.pathname === "/editlawyer" ||
    location.pathname === "/answer" ||
    location.pathname === "/addLawyer";
  return (
    <>
      <GlobalStyle />
      <AppContainer>
        {!isSpecialPage && <Header />}
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/introLawyer" element={<IntroLawyerPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/useRules" element={<UseRulesPage />} />
            <Route path="/withdrawl" element={<WithdrawlPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/document" element={<DocumentPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/inquiry" element={<InquiryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/choicechat" element={<ChoicePage />} />
            <Route path="/edit" element={<EditPage />} />
            <Route path="/adminmenu" element={<AdminMenu />} />
            <Route path="/editlawyer" element={<EditLawyer />} />
            <Route path="/answer" element={<Answer />} />
            <Route path="/answered" element={<Answered />} />
            <Route path="/make" element={<Make />} />
            <Route path="/addLawyer" element={<AddLawyer />} />
            <Route path="/lawyerInfo" element={<LawyerInfo />} />
          </Routes>
        </Content>
        {!isSpecialPage && <Footer />}
      </AppContainer>
    </>
  );
};

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;
