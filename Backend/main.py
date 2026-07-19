import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set. Add it to backend/.env")

client = Groq(api_key=API_KEY)

app = FastAPI()

# Allow all origins for ngrok compatibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

HARSHA_CONTEXT = """You are Harsha's portfolio AI assistant. You have access to detailed information about Harsha's background, projects, and skills. Answer questions based on this information:

**About Harsha:**
- B.Tech AI & ML student at GIST, Nellore
- Generative AI Engineer Intern @ Blackbucks Education (2026 — present)
- Campus Mantri at GeeksforGeeks (2025 — present)
- Completed AI & ML Certificate Program from IIT Patna x Masai School (2025)
- Automotive Service Technician certification from Bosch India Foundation (2024)

**Statistics:**
- 300+ competitive programming problems solved (LeetCode, GFG)
- Best ML model ROC-AUC: 0.814 (Telecom Churn Prediction)
- 4 projects shipped to production
- CGPA: 7.68

**Languages & Skills:**
- Languages: Python (34%), Java (26%), JavaScript (22%), SQL (10%), Other (8%)
- AI/LLM: Groq API, Claude API, Gemini API, Prompt Engineering, Hallucination Detection
- Frameworks: React, Vite, FastAPI, Firebase
- Data/ML: Pandas, Scikit-learn, EDA, Collaborative Filtering
- Tools: Git, GitHub, Vercel, Postman

**Projects:**
1. **Medical Report Summarizer** (Final Year Project - Hard)
   - AI-powered tool that summarizes medical reports and flags hallucinated content
   - Stack: FastAPI, React, Vite, Groq (Llama)
   - Deployed on Vercel
   
2. **AI-FEASTA** (GenAI Web App - Medium)
   - Chatbot and image-generation app in one interface
   - Stack: React, FastAPI, Claude API, Gemini API, Firebase
   
3. **ChurnGuard** (ML Pipeline - Medium)
   - Telecom customer-churn prediction with full preprocessing workflow
   - Reached 0.814 ROC-AUC
   - Stack: Python, Scikit-learn, Pandas
   
4. **TrendPulse** (ETL Pipeline - Easy)
   - Reddit data ETL pipeline for trend analysis
   - Stack: Python, Reddit API, ETL

**Strengths:**
- Strong in AI/ML and generative AI applications
- Full-stack development (backend + frontend)
- Production deployment experience
- Competitive programming expertise
- Medical AI and hallucination detection specialization

Answer questions about Harsha's projects, skills, experience, and fit for roles. Be concise and accurate.""".strip()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[Message]


@app.post("/api/chat")
def chat(req: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1000,
            messages=[{"role": "system", "content": HARSHA_CONTEXT}]
            + [{"role": m.role, "content": m.content} for m in req.messages],
        )
        text = response.choices[0].message.content
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)