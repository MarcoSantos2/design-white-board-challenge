# Design White Board Challenge

A web application to help UX Designers practice whiteboard challenges for job interviews. Features AI-powered feedback through MCP (Model Context Protocol) integration.

## 🚀 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express + TypeScript + Node.js
- **Routing**: React Router DOM
- **AI Integration**: MCP (Model Context Protocol)

## 📁 Project Structure

```
design-white-board-challenge/
├── frontend/          # React + Vite frontend
├── backend/           # Express + TypeScript backend
├── shared/            # Shared types and utilities
├── docs/              # Documentation
└── scripts/           # Build and deployment scripts
```
# AI Integration
This project uses the OpenAI API to provide a UX Whiteboard Challenge Facilitator chatbot that helps candidates practice design interviews.
The backend integrates with OpenAI's ChatGPT API to provide a UX Whiteboard Challenge Facilitator chatbot that helps candidates practice design interviews.

## RAG Integration

### Document Processing Pipeline

PDFs/Word Docs → Text Extraction → Chunking → Vector Embeddings → Vector Database

### Query Flow 

User Question → Vector Search → Retrieve Relevant Chunks → Send to GPT with Context → Response


## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20.17.0 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MarcoSantos2/design-white-board-challenge
   cd design-white-board-challenge
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cp backend/env.example backend/.env
   # Edit backend/.env with your configuration
   ```

## 🚀 Development

### Start both frontend and backend
```bash
npm run dev
```

### Start only frontend
```bash
npm run dev:frontend
```

### Start only backend
```bash
npm run dev:backend
```

## 📦 Build

### Build both frontend and backend
```bash
npm run build
```

### Build only frontend
```bash
npm run build:frontend
```

### Build only backend
```bash
npm run build:backend
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔧 Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run install:all` - Install dependencies for all packages
- `npm start` - Start the production backend server