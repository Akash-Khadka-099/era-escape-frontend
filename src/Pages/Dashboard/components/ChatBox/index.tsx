import React, { useState, useRef, useEffect } from "react";
import { FloatButton, Card, Input, Button, List, Typography, Spin } from "antd";
import { SendOutlined, RobotOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const { Text } = Typography;

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BACKEND_API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5555"}/api/chat`; // Update this endpoint if your backend route is different

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState({ width: 350, height: 500 });
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! I am Eru, your Nepal travel assistant. How can I help you plan your trek or outing today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: 'nwse' | 'ns' | 'ew') => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doDrag = (dragEvent: MouseEvent) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction === 'nwse' || direction === 'ew') {
        newWidth = Math.max(350, Math.min(window.innerWidth - 48, startWidth - (dragEvent.clientX - startX)));
      }
      if (direction === 'nwse' || direction === 'ns') {
        newHeight = Math.max(500, Math.min(window.innerHeight - 120, startHeight - (dragEvent.clientY - startY)));
      }
      
      setSize({ width: newWidth, height: newHeight });
    };

    const stopDrag = () => {
      document.removeEventListener("mousemove", doDrag);
      document.removeEventListener("mouseup", stopDrag);
    };

    document.addEventListener("mousemove", doDrag);
    document.addEventListener("mouseup", stopDrag);
  };

  const handleSend = async () => {
    const prompt = inputValue.trim();
    if (!prompt) return;

    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        BACKEND_API_URL,
        {
          prompt: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${response.data.error}` },
        ]);
      } else if (response.data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.data.reply },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Oops, something went wrong communicating with the server. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FloatButton
        icon={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', paddingTop: '2px' }}>
            <RobotOutlined style={{ fontSize: '28px' }} />
          </div>
        }
        type="primary"
        style={{ right: 24, bottom: 24, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        onClick={() => setIsOpen(!isOpen)}
        tooltip="Chat with Eru"
      />

      {isOpen && (
        <div style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: size.width,
            height: size.height,
            zIndex: 1000,
        }}>
          {/* Resize Handles */}
          <div
            onMouseDown={(e) => handleMouseDown(e, "nwse")}
            style={{ position: "absolute", top: -5, left: -5, width: 15, height: 15, cursor: "nwse-resize", zIndex: 10 }}
          />
          <div
            onMouseDown={(e) => handleMouseDown(e, "ns")}
            style={{ position: "absolute", top: -5, left: 10, right: 0, height: 10, cursor: "ns-resize", zIndex: 9 }}
          />
          <div
            onMouseDown={(e) => handleMouseDown(e, "ew")}
            style={{ position: "absolute", top: 10, left: -5, bottom: 0, width: 10, cursor: "ew-resize", zIndex: 9 }}
          />

          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span><RobotOutlined style={{ marginRight: 8 }} /> Eru</span>
                <Button type="text" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} style={{ padding: 0 }} />
              </div>
            }
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            styles={{
              body: {
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: 0,
                overflow: "hidden"
              }
            }}
            bodyStyle={{ // Fallback for older antd versions
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: 0,
              overflow: "hidden"
            }}
          >
            <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#f5f5f5" }}>
              <List
              dataSource={messages}
              renderItem={(msg, idx) => (
                <List.Item key={idx} style={{ border: "none", padding: "8px 0" }}>
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "85%",
                        padding: "8px 12px",
                        borderRadius: "12px",
                        background: msg.role === "user" ? "#1677ff" : "#fff",
                        color: msg.role === "user" ? "#fff" : "#000",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div style={{ marginBottom: 4, fontSize: 11, opacity: 0.8 }}>
                        {msg.role === "user" ? "You" : "Eru"}
                      </div>
                      <Text style={{ color: "inherit", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {msg.content}
                      </Text>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 8 }}>
                <Spin size="small" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 12, borderTop: "1px solid #f0f0f0", background: "#fff" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                placeholder="Ask about Nepal treks..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSend}
                disabled={isLoading}
              />
              <Button type="primary" icon={<SendOutlined />} onClick={handleSend} loading={isLoading} />
            </div>
          </div>
        </Card>
        </div>
      )}
    </>
  );
};

export default Chatbox;
