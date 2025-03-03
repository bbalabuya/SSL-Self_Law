const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(bodyParser.json());

let chatHistory = {
  //과거 채팅기록 예시
  "Frontend Developer": [
    { isUser: true, text: "local, how can I create a React component?" },
    { isUser: false, text: "You can create a React component by..." },
  ],
  "Comma - 자율 코딩 AI": [
    { isUser: true, text: "What is autonomous coding?" },
    { isUser: false, text: "Autonomous coding refers to..." },
  ],
  "GPT 탐색": [
    { isUser: true, text: "Tell me about GPT." },
    {
      isUser: false,
      text: "GPT stands for Generative Pre-trained Transformer...",
    },
  ],
};

app.post("/api/chatbot", async (req, res) => {
  const { message, chatId } = req.body;

  try {
    const response = await axios.post("YOUR_CHATBOT_API_URL", { message });

    const botMessage = response.data.message;

    // Save chat history
    if (!chatHistory[chatId]) {
      chatHistory[chatId] = [];
    }
    chatHistory[chatId].push({ isUser: false, text: botMessage });

    res.json({ message: botMessage });
  } catch (error) {
    console.error("Error communicating with chatbot:", error);
    res.status(500).json({ message: "Error communicating with chatbot" });
  }
});

app.get("/api/chat-history/:chatId", (req, res) => {
  const { chatId } = req.params;
  res.json({ chatHistory: chatHistory[chatId] || [] });
});

app.post("/api/save-chat", (req, res) => {
  const { chatId, messages } = req.body;
  chatHistory[chatId] = messages;
  res.status(200).json({ message: "Chat history saved" });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
