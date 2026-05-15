# LoanIQ Expert System

A modern, high-fidelity Loan Approval Expert System built with FastAPI (Backend) and React + Framer Motion (Frontend).

## Features

- **Expert System Engine**: Forward-chaining inference engine with 10+ financial rules.
- **Multi-Step Form**: Beautifully animated loan application process with real-time credit score gauge.
- **Smart Decisions**: AI-driven results with detailed rule firing traces and visual feedback.
- **Dashboard**: Real-time statistics, approval rates, and rejection analytics.
- **Premium UI**: Dark mode support, glassmorphism, stagger animations, and confetti celebrations.
- **Responsive**: Fully optimized for Desktop, Tablet, and Mobile.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide Icons, Axios.
- **Backend**: FastAPI, SQLAlchemy, SQLite, Pydantic.

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

### Installation & Run

#### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload
```
The backend will run at `http://localhost:8000`.

#### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run at `http://localhost:5173`.

## System Rules

The expert system evaluates applications based on:
1. Credit Score thresholds.
2. Debt-to-Income (DTI) ratio.
3. Employment stability.
4. Collateral coverage.
5. Purpose-specific risk factors.
6. Minimum age and income requirements.

## License

MIT
