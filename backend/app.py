from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database import engine, Base
from routes import api

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Loan Approval Expert System",
    description="A rule-based expert system for automated loan decisioning",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router
app.include_router(api.router, prefix="/api")


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Loan Approval Expert System API",
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
