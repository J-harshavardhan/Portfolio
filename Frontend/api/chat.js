const HARSHA_CONTEXT = `You are Harsha's portfolio AI assistant. Answer concisely and accurately using only this background.

Harsha is a B.Tech AI & ML student at GIST, Nellore; a Generative AI Engineer Intern at Blackbucks Education (2026-present); and a GeeksforGeeks Campus Mantri (2025-present). He completed an AI & ML certificate program from IIT Patna x Masai School in 2025 and Bosch India's Automotive Service Technician certification in 2024.

He has solved 300+ competitive programming problems, has a 7.68 CGPA, and built four production projects. His best ML result is 0.814 ROC-AUC on Telecom Churn Prediction.

Skills: Java, Python, JavaScript, SQL; Groq, Claude and Gemini APIs; prompt engineering and hallucination detection; React, Vite, FastAPI, Firebase; Pandas, scikit-learn, EDA, collaborative filtering; Git, GitHub, Vercel and Postman.

Projects: Medical Report Summarizer (FastAPI, React/Vite, Groq; summarizes medical reports and flags hallucinations); AI-FEASTA (React/FastAPI app combining chat and image generation with Claude, Gemini and Firebase); ChurnGuard (telecom churn ML pipeline); and TrendPulse (Reddit ETL trend-analysis pipeline).

His strengths are AI/ML, generative-AI applications, full-stack delivery, production deployment, competitive programming, and medical-AI hallucination detection. Answer questions about his projects, skills, experience, and fit for roles.`;

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.GROQ_API_KEY) {
    return response.status(503).json({
      error: "The assistant is not configured yet. Add GROQ_API_KEY in Vercel Project Settings and redeploy.",
    });
  }

  const messages = request.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return response.status(400).json({ error: "A non-empty messages array is required." });
  }

  const safeMessages = messages
    .filter((message) => ["user", "assistant"].includes(message?.role) && typeof message.content === "string")
    .slice(-12)
    .map(({ role, content }) => ({ role, content: content.slice(0, 4000) }));

  try {
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        max_tokens: 700,
        messages: [{ role: "system", content: HARSHA_CONTEXT }, ...safeMessages],
      }),
    });

    const payload = await groqResponse.json();
    if (!groqResponse.ok) {
      console.error("Groq request failed", payload);
      return response.status(502).json({ error: "The assistant provider is temporarily unavailable. Please try again." });
    }

    const text = payload.choices?.[0]?.message?.content?.trim();
    if (!text) return response.status(502).json({ error: "The assistant returned an empty response. Please try again." });
    return response.status(200).json({ text });
  } catch (error) {
    console.error("Chat request failed", error);
    return response.status(502).json({ error: "Couldn't reach the assistant provider. Please try again." });
  }
}
