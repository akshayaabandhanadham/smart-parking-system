"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

type Props = {
  slots: any[];
};

export default function Chatbot({ slots }: Props) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
          slots,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        text: data.reply || "No response from AI",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "⚠️ Failed to connect. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-xl border flex flex-col">
      
      {/* Header */}
      <div className="p-3 border-b font-semibold text-gray-800">
        🤖 AI Assistant
      </div>

      {/* Chat Area */}
      <div className="p-3 h-64 overflow-y-auto space-y-2 text-sm">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center">
            Ask me anything about parking 🚗
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-2 rounded w-fit">
            🤖 Thinking...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") askAI();
          }}
        />

        <button
          onClick={askAI}
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}