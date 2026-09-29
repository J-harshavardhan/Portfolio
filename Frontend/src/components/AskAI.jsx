import React, { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";

const promptSuggestions = ["What makes Harsha a strong AI intern?", "Which project shows the most production thinking?", "What stack does he work with?"];

function localAnswer(question) {
  const normalized = question.toLowerCase();
  if (normalized.includes("stack") || normalized.includes("technology")) {
    return "Harsha works across Python, Java, JavaScript and SQL, with React, Vite and FastAPI for products, plus Groq, Claude, Gemini, Pandas and scikit-learn for AI and ML work.";
  }
  if (normalized.includes("project") || normalized.includes("production")) {
    return "Medical Report Summarizer best shows production thinking: it combines FastAPI, React, Groq and hallucination checks for a high-stakes workflow. AI-FEASTA shows multi-model orchestration, while ChurnGuard reached 0.814 ROC-AUC.";
  }
  if (normalized.includes("intern") || normalized.includes("strong")) {
    return "Harsha combines 300+ solved problems with hands-on GenAI delivery, backend fundamentals and reliability-focused product thinking. He is currently a Generative AI Engineer Intern at Blackbucks Education.";
  }
  return "Harsha is a B.Tech AI and ML student focused on reliable GenAI products, full-stack delivery and practical machine learning. Ask about his projects, skills or experience.";
}

export default function AskAI() {
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
  const [selectedPrompt, setSelectedPrompt] = useState("");

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

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 14000);

    try {
      // Local development always uses Vite's /api proxy so stale .env.local URLs cannot break chat.
      const apiUrl = import.meta.env.DEV ? "" : "";

      const response = await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        signal: controller.signal,
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
            : typeof data.detail === "string"
              ? data.detail
              : response.status === 502 && import.meta.env.DEV && !apiUrl
                ? "The local AI backend is offline. Start Backend with: python -m uvicorn main:app --reload --port 8000"
            : response.status === 401
              ? "This deployment is protected. Disable protection to expose the assistant publicly."
              : "Assistant is temporarily unavailable.";
        throw new Error(message);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.text || "Please try again." }]);
    } catch (e) {
      // Keep the chat useful when a local backend or production provider is unavailable.
      // A successful provider response still takes priority above.
      setMessages((prev) => [...prev, { role: "assistant", text: localAnswer(q) }]);
      setError(null);
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <div className="chat-card">
      <div className="chat-top">
        <div className="assistant-orbit"><Sparkles size={16} /></div>
        <div><p className="eyebrow">Portfolio intelligence</p><h3>Ask me anything about the work.</h3></div>
        <span className="chat-live">Ask AI</span>
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
        {promptSuggestions.map((prompt) => <button key={prompt} type="button" className="prompt-chip" onClick={() => { setSelectedPrompt(prompt); send(prompt); }} disabled={loading}>{prompt}</button>)}
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
          placeholder={selectedPrompt || "Ask about projects, role fit, or skills"}
          className="chat-input"
        />
        <button className="chat-send" type="submit" disabled={loading || !input.trim()}>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
