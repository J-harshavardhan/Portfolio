import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";

const fallbackPrompts = [
  "What makes Harsha a strong AI intern?",
  "Which project best shows production skills?",
  "How strong is his DSA profile?",
  "What stack does he use most often?",
];

export default function AskAI({ prompts = fallbackPrompts }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi, I am Harsha's portfolio assistant. Ask about projects, skills, or achievements.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send(question) {
    const q = (question ?? input).trim();
    if (!q || loading) return;

    setError(null);
    setInput("");

    const nextMessages = [...messages, { role: "user", text: q }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const apiUrl = import.meta.env.DEV
        ? (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/$/, "")
        : "";

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiUrl.includes("ngrok") ? { "ngrok-skip-browser-warning": "true" } : {}),
        },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message =
          typeof data.error === "string"
            ? data.error
            : response.status === 401
              ? "This deployment is protected. Disable protection to expose the assistant publicly."
              : "Assistant is temporarily unavailable.";
        throw new Error(message);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text || "Please try again." }]);
    } catch (e) {
      setError(e.message || "Could not reach the assistant right now.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-top">
        <Sparkles size={15} />
        <p>AI Portfolio Assistant</p>
      </div>

      <div ref={scrollRef} className="chat-stream">
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.role}`}>
            <p className="msg-bubble">{m.text}</p>
          </div>
        ))}

        {loading && (
          <div className="msg-row assistant">
            <p className="msg-bubble thinking">
              <Loader2 size={14} className="spin" /> thinking...
            </p>
          </div>
        )}

        {error && <p className="chat-error">{error}</p>}
      </div>

      <div className="prompt-row">
        {prompts.map((prompt) => (
          <button key={prompt} type="button" className="prompt-chip" onClick={() => send(prompt)} disabled={loading}>
            {prompt}
          </button>
        ))}
      </div>

      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about projects, role fit, or skills"
          className="chat-input"
        />
        <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
