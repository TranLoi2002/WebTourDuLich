import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatbotResponse from "./ChatbotResponse";

const Chatbot = () => {
    const [messages, setMessages] = useState(() => {
        // Khôi phục tin nhắn từ localStorage với xử lý lỗi
        try {
            const savedMessages = localStorage.getItem("chatbotMessages");
            return savedMessages ? JSON.parse(savedMessages) : [];
        } catch (error) {
            console.error("Error parsing localStorage messages:", error);
            return [];
        }
    });
    const [inputMessage, setInputMessage] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef(null);

    const predefinedQuestions = [
        "I want to see tours in Colombia",
        "Làm thế nào để đặt một tour?",
    ];
    const MAX_MESSAGES = 100; // Giới hạn số tin nhắn để tránh vượt quota localStorage

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        // Lưu tin nhắn vào localStorage với kiểm tra kích thước
        try {
            const serializedMessages = JSON.stringify(messages);
            // Kiểm tra kích thước (gần 5MB)
            if (serializedMessages.length > 4 * 1024 * 1024) {
                console.warn("localStorage near capacity, trimming old messages");
                setMessages((prev) => prev.slice(-MAX_MESSAGES));
            } else {
                localStorage.setItem("chatbotMessages", serializedMessages);
            }
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [messages]);

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            userId: 1,
            message,
            timestamp: new Date().toISOString(),
            isUser: true,
        };
        setMessages((prev) => [...prev, userMessage].slice(-MAX_MESSAGES)); // Giới hạn số tin nhắn
        setInputMessage("");
        setIsThinking(true);

        try {
            const response = await axios.post("http://localhost:8080/api/chatbot", {
                sender: "1",
                message,
            });
            const botMessage = response.data.responses[0];
            const botMessageData = {
                id: Date.now() + 1,
                userId: 0,
                message: botMessage.message,
                timestamp: new Date().toISOString(),
                isUser: false,
            };
            setMessages((prev) => [...prev, botMessageData].slice(-MAX_MESSAGES));
        } catch (error) {
            const errorMessage = {
                id: Date.now() + 1,
                userId: 0,
                message: "Error: Unable to connect to chatbot.",
                timestamp: new Date().toISOString(),
                isUser: false,
            };
            setMessages((prev) => [...prev, errorMessage].slice(-MAX_MESSAGES));
        } finally {
            setIsThinking(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage(inputMessage);
    };

    const handleResetChat = () => {
        setMessages([]);
        localStorage.removeItem("chatbotMessages");
    };

    return (
        <div className="fixed bottom-20 right-4 w-[45%] bg-white rounded-lg shadow-lg p-4 z-[99999] border-[3px] border-blue-700">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-center text-primary">AirCHAT</h1>
                <button
                    onClick={handleResetChat}
                    className="text-sm text-red-500 hover:text-red-700"
                    title="Reset chat"
                >
                    Clear Chat
                </button>
            </div>
            <div className="h-80 overflow-y-auto mb-4 border rounded p-2" style={{ maxHeight: "24rem" }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`mb-2 p-2 rounded-lg ${
                            msg.isUser ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
                        } max-w-[80%] break-words`}
                    >
                        {msg.isUser ? (
                            <p className="text-sm items-end flex justify-end text-end">{msg.message}</p>
                        ) : (
                            <ChatbotResponse response={msg.message} />
                        )}
                        <span className="text-xs opacity-70">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </div>
                ))}
                {isThinking && (
                    <div className="mb-2 p-2 bg-gray-200 text-black rounded-lg max-w-[80%]">
                        <p>Thinking...</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="text-sm text-gray-600">Let me search: </span>
                {predefinedQuestions.map((question, index) => (
                    <button
                        key={index}
                        onClick={() => handleSendMessage(question)}
                        className="bg-gray-200 text-gray-800 text-sm p-2 rounded-lg hover:bg-gray-300"
                    >
                        {question}
                    </button>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter message..."
                />
                <button
                    onClick={() => handleSendMessage(inputMessage)}
                    className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600"
                >
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    );
};

export default Chatbot;