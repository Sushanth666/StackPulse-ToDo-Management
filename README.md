# ⚡ StackPulse — Enterprise Task & Sprint Management System

<div align="center">

![StackPulse Logo](https://img.shields.io/badge/StackPulse-v1.0.0-6366f1?style=for-the-badge&logo=stackshare&logoColor=white)
![React](https://img.shields.io/badge/React-18.3.1-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.4.14-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-JSONPlaceholder-22c55e?style=for-the-badge&logo=fastapi&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

<br/>

**A high-performance, enterprise-grade Task & Sprint Management platform built with React 18, Vite, Tailwind CSS, and REST CRUD API Integration.**

[Key Features](#-key-features) • [Architecture](#-modular-folder-structure) • [REST API Integration](#-rest-api-integration) • [Local Setup](#-installation--getting-started) • [Git Deployment](#-git-repository--push-instructions)

</div>

---

## 🌟 Executive Overview

**StackPulse** is a modern, responsive web application engineered for managing high-velocity software engineering tasks, sprints, and team deliverables. It seamlessly bridges client-side interactive workflows with live cloud REST API endpoints (`JSONPlaceholder API`), featuring offline fallback caching, real-time audit logging, interactive Kanban workflows, sprint analytics, and professional PDF/CSV/JSON report generation.

---

## 🚀 Key Features

### 1. 🔄 Dual Mode REST CRUD API Integration
* **Live REST API Mode (`API ON`)**: Executes genuine HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) against the JSONPlaceholder REST API via Axios.
* **Offline Sandbox Mode (`API OFF`)**: Seamlessly falls back to resilient client-side storage, allowing uninterrupted testing and local simulation.
* **Live Status Indicator**: Real-time pulsing badge in the navbar and footer displaying current API health and connectivity mode.
* **Error Resilience & Fallback**: Automatic graceful fallback to mock data if remote network timeouts occur.

### 2. 🗂️ Triple-View Task Interface
* **Grid View**: Modern glassmorphism card cards with priority glow indicators, category tags, avatar chips, deadline countdowns, and quick-action toolbars.
* **Dense List View**: High-efficiency table row format with bulk-selection checkboxes, inline status toggling, and aligned metadata columns.
* **Kanban Board**: Drag-free sprint workflow board with columns (*Backlog / Todo*, *In Progress*, *Completed*), column metrics, and **touch-optimized mobile horizontal snap scrolling**.

### 3. ⌨️ Global Command Palette (`Ctrl + K` / `Cmd + K`)
* Universal command center accessible from any page or device.
* Fuzzy search across all task titles and IDs in real-time.
* Instant shortcuts to create tasks, switch themes, toggle API mode, trigger analytics, open team directories, or export deliverables.
* Full keyboard navigation support (`↑`, `↓`, `Enter`, `Esc`).

### 4. 📊 Sprint Analytics & Executive KPI Hub
* Real-time metrics calculating:
  * Total Deliverables & Completion Percentage Rate
  * Pending vs In-Progress vs Done task distributions
  * Priority breakdown matrix (High, Medium, Low)
  * Team member workload capacity allocation
* Instant modal dashboard rendered with portal layering.

### 5. 👥 Team Member Directory & Profiles
* Interactive slide-over drawer displaying all 10 project team members.
* Detailed member profile: role, department, contact information, total assigned tasks, and completion velocity.
* Single-click task filtering to isolate deliverables for any specific engineer.

### 6. 📜 Real-time Audit Trail & Activity Logger
* Comprehensive chronological record of all REST actions (`CREATE`, `UPDATE`, `DELETE`, `STATUS_TOGGLE`).
* Action timestamps, event tags, and single-click **Undo action** support.

### 7. 📑 Enterprise Document & Data Exports
* **PDF Deliverables Report**: Beautifully styled PDF generation with custom headers, summary stats banner, and styled data table via `jspdf` & `jspdf-autotable`.
* **CSV Spreadsheet**: Clean spreadsheet export for Excel and Google Sheets.
* **JSON Export**: Formatted JSON data dump for programmatic migration.

### 8. 🎯 Granular Filtering, Search, & Multi-Sort
* Live search with instant debounced keyword matching.
* Status tabs: `All`, `Active`, `Completed`.
* Priority filter dropdown: `High (P1)`, `Medium (P2)`, `Low (P3)`.
* Category filter: `Frontend`, `Backend`, `DevOps`, `UI/UX Design`, `Database`, `Testing`, `Security`.
* Team member assignee filter.
* Multi-criteria sorting: By ID (Newest/Oldest), Title (A-Z/Z-A), Priority, Completion Status.

### 9. 🎨 Sleek Tailwind CSS Theme System
* Dual theme engine (**Light Porcelain** and **Dark Zinc Obsidian**).
* Built on Tailwind CSS v3 with rich CSS custom properties, smooth transitions, and glassmorphism.
* Celebration confetti animations on completing tasks via `canvas-confetti`.

### 10. 📱 100% Mobile & Tablet Responsive Architecture
* Tested across standard viewports from **320px (ultra-compact phones)**, **375px/390px (iPhone SE/14)**, **768px (iPad/Tablet)**, up to **4K Desktop monitors**.
* Adaptive layout adjustments:
  * Expanded 380px Navbar search bar on Desktop with dedicated `Ctrl K` badge.
  * Compact 38px touch targets and centered flex alignments on mobile.
  * Symmetrical paddings and gutters preventing horizontal overflow (`overflow-x: hidden`).
  * Full-screen touch drawers and scroll-locked modals.

---

## 🏗️ Modular Folder Structure

The project employs a scalable **Feature-Driven Architecture** separating domain modules from shared primitives:

```
StackPulse/
├── public/
│   ├── favicon.svg               # SVG Brand favicon
│   └── stackpulse-logo.svg       # Brand icon asset
├── src/
│   ├── features/                 # Domain-specific modules
│   │   ├── todos/                # Core Todo & Task management
│   │   │   ├── components/       # TodoList, TodoCard, TodoRow, TodoModal,
│   │   │   │                     # ConfirmModal, FilterBar, StatsOverview, Pagination
│   │   │   └── context/          # TodoContext.jsx (Central State & API actions)
│   │   ├── kanban/               # KanbanBoard.jsx, KanbanColumn.jsx
│   │   ├── analytics/            # AnalyticsModal.jsx (KPIs & Metrics)
│   │   ├── activity/             # ActivityDrawer.jsx (Audit Trail & Undo)
│   │   └── team/                 # UserDrawer.jsx (Team Member Directory)
│   │
│   ├── shared/                   # Cross-cutting reusable primitives
│   │   ├── components/
│   │   │   ├── layout/           # Navbar.jsx, Footer.jsx, BrandLogo.jsx
│   │   │   └── ui/               # Toast.jsx, ToastContainer.jsx, EmptyState.jsx,
│   │   │                         # SkeletonLoader.jsx, CommandPalette.jsx
│   │   ├── context/              # ThemeContext.jsx (Dark/Light mode)
│   │   ├── hooks/                # useToast.js
│   │   ├── services/             # api.js (Axios instance), todoService.js (CRUD API calls)
│   │   └── utils/                # dateUtils.js, exportUtils.js, professionalData.js
│   │
│   ├── styles/                   # Design system & styles
│   │   ├── index.css             # Tailwind base/components/utilities & Design tokens
│   │   ├── App.css               # Main application layout, hero banner, footer styles
│   │   └── components.css        # Component-specific styles, cards, modals, responsive rules
│   │
│   ├── App.jsx                   # Root application view
│   └── main.jsx                  # Entry point
│
├── index.html                    # HTML5 template with SEO meta tags
├── package.json                  # Dependencies & scripts
├── postcss.config.js             # PostCSS Tailwind configuration
├── tailwind.config.js            # Tailwind theme tokens & color extensions
└── vite.config.js                # Vite bundler configuration
```

---

## 🌐 REST API Integration

The app connects to [JSONPlaceholder REST API](https://jsonplaceholder.typicode.com/todos):

| HTTP Method | Endpoint | Description | Application Action |
|:---|:---|:---|:---|
| `GET` | `/todos?_limit=20` | Fetch initial list of task deliverables | `fetchTodos()` |
| `POST` | `/todos` | Create a new task deliverable | `addTodo(todoData)` |
| `PUT` | `/todos/:id` | Update title, priority, assignee, status | `updateTodo(id, updates)` |
| `PATCH` | `/todos/:id` | Toggle completion status | `toggleTodoStatus(id)` |
| `DELETE` | `/todos/:id` | Remove a task deliverable | `deleteTodo(id)` |

> **Note on Simulated Persistence**: JSONPlaceholder is a mock REST API that returns realistic HTTP status codes (`200 OK`, `201 Created`) without persisting data permanently on their servers. StackPulse synchronizes the remote API response with local reactive state and browser storage so changes persist seamlessly throughout your user session.

---

## 🛠️ Installation & Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher) or **yarn** / **pnpm**

### Step 1: Clone the repository
```bash
git clone https://github.com/Sushanth666/StackPulse--ToDo-Management.git
cd StackPulse--ToDo-Management
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Start development server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or `http://localhost:3001`).

### Step 4: Build for production
```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory.

---

## 📤 Git Repository & Push Instructions

To push the latest codebase to the GitHub repository:

```bash
# 1. Initialize git repository (if not already initialized)
git init

# 2. Add remote repository URL
git remote add origin https://github.com/Sushanth666/StackPulse--ToDo-Management.git

# 3. Verify remote is set correctly
git remote -v

# 4. Stage all project files
git add .

# 5. Create a descriptive commit
git commit -m "feat: complete StackPulse Enterprise Task Management system with CRUD API, Tailwind CSS, and mobile responsiveness"

# 6. Set main branch and push code
git branch -M main
git push -u origin main --force
```

---

## 🧰 Tech Stack Summary

* **Frontend Framework**: [React 18](https://react.dev/) (Hooks, Context API, Portals)
* **Build Tool**: [Vite 5](https://vitejs.dev/)
* **Styling & CSS**: [Tailwind CSS v3](https://tailwindcss.com/) + Vanilla CSS Variables
* **Icons**: [Lucide React](https://lucide.dev/)
* **HTTP Client**: [Axios](https://axios-http.com/)
* **Export Utilities**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
* **Micro-interactions**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* **Typography**: Modern Google Fonts (*Outfit*, *Inter*, *Plus Jakarta Sans*, *JetBrains Mono*)

---

## 👨‍💻 Author & Credits

* **Developer**: Sree Sushanth B V
* **GitHub**: [@Sushanth666](https://github.com/Sushanth666)
* **Repository**: [StackPulse--ToDo-Management](https://github.com/Sushanth666/StackPulse--ToDo-Management.git)

---

<div align="center">
  <sub>Built with ❤️ by <b>Sree Sushanth B V</b>. Powered by React 18, Vite, and Tailwind CSS.</sub>
</div>
