import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// Styled Components for Sidebar
const SidebarContainer = styled.div`
  width: 20%;
  height: 80vh;
  border-right: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
`;

const AppContainer = styled.div`
  display: flex;
  height: 80vh;
`;

const NewChatButton = styled.button`
  width: 90%;
  height: 25px;
  margin-bottom: 30px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
`;

const ChatList = styled.ul`
  list-style: none;
  padding: 0;
  color: white;
`;

const ChatItem = styled.li`
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ccc;

  &:hover {
    background-color: #a3a3a3;
  }
`;

// Styled Components for ChatWindow
const ChatWindowContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  height: 80vh;
`;

const ChatContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WelcomeMessage = styled.div`
  color: #888;
  font-size: 1.2em;
`;
const MessageList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* 스크롤을 추가 */
  max-height: 100%; /* 부모 컨테이너 높이를 초과하지 않도록 설정 */
`;

const Message = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isUser ? "flex-end" : "flex-start")};
`;

const MessageBubble = styled.div`
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: ${(props) => (props.isUser ? "#007bff" : "#e5e5ea")};
  color: ${(props) => (props.isUser ? "#fff" : "#000")};
`;

const User = styled.span`
  font-weight: bold;
  color: #fff;
`;

const Bot = styled.span`
  font-weight: bold;
  color: #007bff;
`;

const Text = styled.span`
  color: white;
`;

const ChatInputContainer = styled.div`
  display: flex;
  border-top: 1px solid #ccc;
  background-color: black;
  padding: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #007bff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ChatApp = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([
    { isUser: true, text: "안녕하세요" },
  ]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // 초기값을 빈 배열로 설정
  const [stompClient, setStompClient] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  const navigate = useNavigate();

  // STOMP 클라이언트 설정
  useEffect(() => {
    const socket = new SockJS(`${SERVER_URL}/ws`);
    const stompClientInstance = Stomp.over(socket);

    stompClientInstance.connect({}, () => {
      setStompClient(stompClientInstance);
    });

    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);

  // 채팅방 구독
  useEffect(() => {
    if (selectedChat && stompClient) {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }

      const subscription = stompClient.subscribe(
        `/sub/chats/${selectedChat}`,
        (message) => {
          const botMessage = JSON.parse(message.body).content;
          setMessages((prevMessages) => [
            ...prevMessages,
            { isUser: false, text: botMessage },
          ]);
        }
      );

      setCurrentSubscription(subscription);

      fetch(`${SERVER_URL}/api/v1/chatroom/${selectedChat}`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          const fetchedMessages = data.payload.chatRoomMessageResponses.map(
            (msg) => ({
              isUser: msg.senderType === "USER",
              text: msg.content,
            })
          );
          setMessages(fetchedMessages);
        })
        .catch((error) => {
          console.error("Error loading chat messages:", error);
        });
    } else {
      setMessages([]);
    }

    return () => {
      if (currentSubscription) {
        currentSubscription.unsubscribe();
      }
    };
  }, [selectedChat, stompClient]);

  // 메시지 전송
  const handleSend = () => {
    console.log("전송 진행중");
    if (input.trim() && stompClient) {
      const newMessages = [...messages, { isUser: true, text: input }];
      setMessages(newMessages);
      stompClient.send(
        "/pub/chat",
        {},
        JSON.stringify({
          roomId: selectedChat,
          message: input,
        })
      );
      setInput("");
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/api/v1/chatroom`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      const newChatId = data.payload;

      setChatHistory((prevChatHistory) => [...prevChatHistory, newChatId]);
      setSelectedChat(newChatId);

      if (stompClient) {
        const subscriptionPath = `/sub/chats/${newChatId}`;
        stompClient.subscribe(subscriptionPath, (message) => {
          const botMessage = JSON.parse(message.body).content;
          setMessages((prevMessages) => [
            ...prevMessages,
            { isUser: false, text: botMessage },
          ]);
        });

        console.log(`Subscribed to: ${subscriptionPath}`);
      }

      navigate(`/chat/${newChatId}`);
    } catch (error) {
      console.error("Error creating or subscribing to new chat:", error);
    }
  };

  return (
    <AppContainer>
      <SidebarContainer>
        <NewChatButton onClick={handleNewChat}>
          대화 새로 시작하기
        </NewChatButton>
        <Logo>대화기록</Logo>
        <ChatList>
          {Array.isArray(chatHistory) &&
            chatHistory.map((chat, index) => (
              <ChatItem key={index} onClick={() => setSelectedChat(chat)}>
                {chat}
              </ChatItem>
            ))}
        </ChatList>
      </SidebarContainer>
      <ChatWindowContainer>
        <ChatContent>
          {messages.length === 0 ? (
            <WelcomeMessage>
              환영합니다! 메시지를 입력해 대화를 시작하세요.
            </WelcomeMessage>
          ) : (
            <MessageList>
              {messages.map((message, index) => (
                <Message key={index} isUser={message.isUser}>
                  <MessageBubble isUser={message.isUser}>
                    {message.isUser ? <User /> : <Bot>ChatGPT:</Bot>}
                    <Text>{message.text}</Text>
                  </MessageBubble>
                </Message>
              ))}
            </MessageList>
          )}
        </ChatContent>
        <ChatInputContainer>
          <Input
            type="text"
            placeholder="메시지를 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleSend}>전송</Button>
        </ChatInputContainer>
      </ChatWindowContainer>
    </AppContainer>
  );
};

export default ChatApp;
