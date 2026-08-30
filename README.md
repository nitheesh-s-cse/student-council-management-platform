# PPGIT Student Council Management Platform

An operating system and management platform for the PPG Institute of Technology Student Council, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Drizzle ORM + PostgreSQL (Supabase)**.

## Features

- **Dashboard & Analytics:** Overview of council activities, task progress, announcements, and events.
- **Team & Committee Management:** Track board members, executive leads, and committee members across departments.
- **Task Management:** Kanban/list task boards with checklists, assignees, priorities, and code tracking.
- **Real-Time Council Chat:** Team workspace and council-wide channels for instant coordination.
- **Polls & Voting:** Create and participate in single/multiple choice council decisions.
- **Announcements & Calendar:** Public and internal announcement board and event tracking.

## Stack

- **Framework:** Next.js 16 (React 19)
- **Database:** PostgreSQL (Supabase) via Drizzle ORM
- **Styling:** Tailwind CSS 4
- **Authentication:** Custom Session-based Auth & Role Management

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitheesh-s-cse/student-council-management-platform.git
   cd student-council-management-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   ```

4. **Seed Database:**
   ```bash
   npx tsx src/db/seed.ts
   ```

5. **Run Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).
