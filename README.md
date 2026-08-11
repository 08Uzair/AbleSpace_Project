# AbleSpace

A full-stack **task & project management workspace** with a Figma-matched UI, a REST API, and an **AI chat agent** powered by Groq + MCP (Model Context Protocol).

The project is split into **four services** in this repository:

| Folder        | Role                                                                       | Port  |
| ------------- | -------------------------------------------------------------------------- | ----- |
| `client/`     | Next.js front-end (task manager UI)                                        | 3000  |
| `server/`     | Express + MongoDB REST API (tasks, projects, profiles)                     | 5000  |
| `ai-server/`  | AI bridge: Groq chat completions + MCP tool calling                        | 5001  |
| `mcp-server/` | MCP server exposing project/task tools to the AI (stdio transport)         | –     |

---

# Images
1. AUTH PAGE
<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/7d4d56a8-7a21-4476-8058-11c0eebbbe73" />

---

2. TASK KANBAN BOARD
   
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/00cbe00c-986d-43b9-9a5f-14dc559b227f" />

---

3. AI PANNEL

<img width="1919" height="971" alt="image" src="https://github.com/user-attachments/assets/4ea95c51-ce15-48cc-91c2-75c0afebe4bc" />

---

4. TASK LIST BOARD

<img width="1920" height="969" alt="image" src="https://github.com/user-attachments/assets/74ee507f-0666-4751-b243-4bc146059c35" />

---

5.Panel Fields

<img width="1919" height="975" alt="image" src="https://github.com/user-attachments/assets/45fd6d8e-bb9e-4daa-b3ff-1189f445b789" />

---

6. Panel Filters
   
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/765b94db-4193-4529-9131-383757a07fee" />

---
7. CREATE TASK PAGE

<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/c6d5d6fb-005c-4c03-a432-b4ce7f6adc73" />

---

8. PROJECT PAGE

<img width="1919" height="968" alt="image" src="https://github.com/user-attachments/assets/9a522698-7e45-4992-86dd-c59ec13e60ce" />

---

9. CREATE PROJECT POP UP
   
<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/89b9d178-b78b-4fb6-8121-f105c32ac32d" />

---
 
10. PROFILE PAGE 

<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/700f55cf-46b8-4d95-94ff-ccbbff2107ca" />

---

11. THEME CUSTOMIZATION : DARK & LIGHT MODE

<img width="1919" height="973" alt="image" src="https://github.com/user-attachments/assets/b01bb13b-b29f-40e4-9e8d-4ea8caf0b276" />

---

12. COLOR MODE

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/40519ff6-96f8-4259-bc6e-d17698aff588" />

---

## 1. What We Built

A complete task-management application ("AbleSpace") that lets users:

- **Sign in with Google (Auth0)** or **continue as guest** (persistent local guest identity)
- **Manage projects** — create, edit, delete, set colors, priority and due dates, mark as private
- **Manage tasks** — title, description, status column, priority, assignee, due date, tags, subtasks, comments, resources and watchers
- **Work with a Kanban-style board** (`todo` / `doing` / `completed` / `onhold`) with task detail & project detail panels
- **Chat with an AI agent** in the sidebar that can **actually read, create, update and delete** tasks/projects using MCP tool calls — not just text suggestions
- **Theme preferences** — light/dark mode with multiple accent colors (persisted in localStorage)

---

## 2. Tech Stack & Tools

### Frontend — `client/`
- **Next.js 16** (App Router, React Server Components) + **React 19**
- **Redux Toolkit + React-Redux** — global state (auth, tasks, projects, profile, UI)
- **Tailwind CSS v4** — styling (matching the Figma design system)
- **Auth0 React SDK** — Google social login
- **lucide-react** — icons; **Geist / Geist Mono** — fonts

### Backend API — `server/`
- **Node.js + Express 4** — REST API
- **Mongoose 8 / MongoDB Atlas** — data layer (Task, Project, Profile models)
- **CORS + dotenv** — environment configuration

### AI Layer — `ai-server/` + `mcp-server/`
- **Groq** (OpenAI-compatible API) — LLM inference; default model **`openai/gpt-oss-20b`** (configurable via `GROQ_MODEL`)
- **Official MCP SDK** (`@modelcontextprotocol/sdk`) — AI bridge connects to the MCP server over **stdio**, lists tools, and executes tool calls in a chat loop
- **zod** — strict schemas for every MCP tool
- **OpenAI Node SDK** pointed at `https://api.groq.com/openai/v1`

### Tooling
- npm workspaces per folder, `node --watch` for dev auto-restart
- **`run.ps1`** — one-file orchestrator to start/stop all services on Windows
- PowerShell (Windows), Git

---

## 3. How to Start the Complete Application

> Prerequisites: **Node.js v18+** (v22+ recommended), **npm**, and a **MongoDB Atlas** cluster (see **section 7** for the `.env` fields).

### 3.1 One Command from the Root Folder

From `.\AbleSpace` (or wherever you cloned the repo):

```powershell
# 1. Start everything (server, ai-server, mcp-server, client)
.\run.ps1

# 2. First time — also install all dependencies
.\run.ps1 -Install

# 3. Dev mode with auto-restart (node --watch on server & ai-server)
.\run.ps1 -Dev

# 4. Stop everything in one command
.\run.ps1 -Stop
```

- All output is written to `*.log` / `*-err.log` files in the root.
- Press `Ctrl+C` in the running terminal to stop everything, or run `.\run.ps1 -Stop`.
- Open **http://localhost:3000** (client UI).

### 3.2 Manual Start (per folder)

Open **four terminals** and run:

```powershell
# Terminal 1 — Backend API (port 5000)
cd server
npm install          # only the first time
npm run dev          # or: npm start

# Terminal 2 — MCP Server (stdio; spawned automatically by ai-server, run standalone for testing)
cd mcp-server
npm install          # only the first time
npm start            # or: node index.js

# Terminal 3 — AI Bridge (port 5001)
cd ai-server
npm install          # only the first time
npm run dev          # or: npm start

# Terminal 4 — Next.js Client (port 3000)
cd client
npm install          # only the first time
npm run dev
```

### Useful extras
- Seed sample data: `cd server; npm run seed`
- API health: `http://localhost:5000/api/health` and `http://localhost:5001/api/health`

---

## 4. Additional Features — MCP & the AI Chat Agent

This is the standout addition to a standard task manager: a **fully autonomous AI agent** wired in through the **Model Context Protocol**.

**Architecture:**

```
AI Chat Panel (client) --POST /api/chat--> ai-server (Groq LLM)
                                              |
                                     MCP Client (stdio child process)
                                              |
                                     mcp-server (tools: list/create/update/delete task & project)
                                              |
                                     server REST API -> MongoDB
```

- **Which AI is used:** **Groq** — currently the default model is **`openai/gpt-oss-20b`** via the OpenAI-compatible endpoint `https://api.groq.com/openai/v1`. You can swap models by changing `GROQ_MODEL` in `ai-server/.env` (e.g. `llama-3.3-70b-versatile`).
- **Tool calling loop:** the bridge converts every MCP tool into an OpenAI function-tool, runs up to 8 turns of model ⇄ tool execution, and returns both the final answer and a step log.
- **8 real tools exposed by MCP:** `list_tasks`, `create_task`, `update_task`, `delete_task`, `list_projects`, `create_project`, `update_project`, `delete_project` — all schema-validated with **zod**.
- **Security by ownership:** the user id is injected invisibly (`__ownerId`) into every MCP call, so the AI can *only* act on the current user's own data. Guest and private-project visibility rules are enforced by the API.
- Example prompts in the UI: *"Create a task: 'Send weekly report' due Friday, High priority"*, *"Show me all my tasks"*, *"Mark the stale tasks as on hold"*.

---

## 5. Complete Application Functionality & Figma Match

### Application flow
1. **`/` (Landing)** — redirects to `/auth` or `/task` depending on auth status.
2. **`/auth` (Sign in)** — Google sign-in via Auth0 **or** "Continue as guest" (guest gets a random persistent `guest_*` id in localStorage).
3. **`/task` (Task Manager)** — the main workspace:
   - Sidebar: app logo, navigation, theme (dark/light) + accent color picker, profile, logout.
   - **Four kanban columns**: To Do, Doing, Completed, On Hold — with task cards (title, tags, priority, due date, assignee avatar), add-task composer, drag-free but full edit capability.
   - **Task detail panel**: description, subtasks, comments, resources, watchers, status, priority, member, project, due date, tags.
   - **Project detail panel**: project info, color, visibility, priority, due date.
   - **AI Agent panel (right sidebar)**: chat with the Groq-powered agent described in section 4, with suggestion chips and a visible tool-step log.
4. **`/profile`** — view/edit name, title, username, email, picture (auto-created profile per user).
5. Data layer: every authenticated user is scoped by their Auth0 `sub`; guests work in an isolated sandbox; private projects are invisible to other users.

### How the UI matches the given Figma design
- **Pixel-level layout**: sidebar + 4-column board + detail panels + AI sidebar were implemented to match the Figma screens (sign-in page, task board, task modal/detail, project detail, profile).
- **Design system**: neutral grays (`neutral-50` … `neutral-950`), the AbleSpace **triangle logo** mark, rounded-8px surfaces, subtle borders and the same typography scale (Geist Sans/Geist Mono).
- **Dark mode + accent colors**: the Figma dark theme is replicated with CSS variables (`--accent`, `--accent-foreground`) and a pre-hydration script to avoid flash; accent choices (black/color) are persisted and applied instantly.
- **Components** (`src/components/`): `Landing`, `Auth`, `TaskManager`, `TaskDetailPage`, `ProjectDetailPage`, `DatePicker`, `AiAgentPanel`, `Profile` — each maps 1:1 to a Figma frame.

---

## 6. Complete Workflow

### Workflow diagram

```mermaid
flowchart LR
    U[User] -->|opens browser| C[Next.js client :3000]
    C -->|Auth0 Google login / guest| A0[(Auth0)]
    C -->|REST calls /api/* with x-user-id header| API[Express API :5000]
    API --> DB[(MongoDB Atlas)]
    C -->|POST /api/chat| AI[AI bridge :5001]
    AI -->|chat.completions + tools| GROQ[(Groq LLM)]
    AI --MCP client stdio--> MCP[MCP server index.js]
    MCP -->|HTTPS to :5000| API
    API -->|responses| C
    C -->|renders| U
```

### Step-by-step workflow
1. **User opens** http://localhost:3000 — the client redirects to sign-in (Auth0) or allows guest access.
2. **Client talks to the REST API** for all CRUD: tasks, projects, profile. Every request carries the user identity in the `x-user-id` header.
3. **API validates & persists** in MongoDB Atlas. Private/sandbox rules are applied server-side so users only see their own (or public shared) data.
4. **AI chat**: the client sends the conversation to the AI bridge. The bridge asks Groq for tool calls, executes them through the MCP server (spawned as a stdio child process), feeds results back, and returns the final answer + step log to the UI.
5. **MCP server** performs the actual task/project operations by calling the same REST API (acts like the user) — so AI changes appear in the board **immediately**, live.

---

## 7. Extra `.env` Fields to Add Yourself

Copy the examples and fill in your own credentials. `.env` files are git-ignored by design.

### `server/.env` (create it — no example exists yet)
```env
PORT=5000
MONGODB_USERNAME=<your-mongodb-atlas-username>
MONGODB_PASSWORD=<your-mongodb-atlas-password>
MONGODB_URI=<your-mongodb-connection-string>    # e.g. mongodb+srv://user:pass@cluster.mongodb.net/ablespace
CLIENT_ORIGIN=http://localhost:3000
```

### `ai-server/.env` (see `ai-server/.env.example`)
```env
GROQ_API_KEY=<your-groq-api-key>          # get one free at https://console.groq.com
GROQ_MODEL=openai/gpt-oss-20b             # or any Groq model id
API_BASE_URL=http://localhost:5000
MCP_SERVER_PATH=../mcp-server/index.js
CLIENT_ORIGIN=http://localhost:3000
PORT=5001
```

### `mcp-server/.env` (see `mcp-server/.env.example`)
```env
API_BASE_URL=http://localhost:5000
```

### `client/.env.local` (create it; currently only `NEXT_PUBLIC_API_URL` exists)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_AI_URL=http://localhost:5001
```

> **Note on Auth0:** the client uses Auth0 social login with a domain/client-id that is currently **hardcoded** in `client/src/components/Providers.jsx`. If you want your own Auth0 tenant, replace those two constants (or move them to env vars). Backends only need `CLIENT_ORIGIN`/CORS to allow the client origin.

---

## Folder Structure (cleaned)

```
AbleSpace/
├── run.ps1                 # start / stop everything from the root
├── server/                 # Express + MongoDB REST API
│   ├── models/             # Task, Project, Profile
│   ├── routes/             # tasks, projects, profiles
│   ├── db.js  server.js  seed.js
│   └── .env  .gitignore
├── ai-server/              # Groq + MCP AI bridge
│   ├── index.js
│   └── .env  .env.example  .gitignore
├── mcp-server/             # MCP tools server (stdio)
│   ├── index.js
│   └── .env.example  .gitignore
└── client/                 # Next.js front-end
    ├── src/app/            # pages: /, /auth, /task, /profile
    ├── src/components/     # Landing, Auth, TaskManager, AiAgentPanel, …
    ├── src/lib/            # api.js (fetch wrapper), theme.js
    ├── src/store/          # Redux Toolkit store + slices
    └── .env.local  .gitignore  next.config.mjs  …
```
