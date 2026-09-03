from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analyze, ocr, moderate
import os

app = FastAPI(
    title="CURA AI Microservice",
    description="Cross-domain Medical Safety & Interaction Verification Engine",
    version="1.0.0"
)

# Allow Next.js frontend via CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("NEXTAUTH_URL", "*")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router); app.include_router(ocr.router); app.include_router(moderate.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "CURA FastApi AI Core"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
