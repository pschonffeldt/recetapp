# 🥘 RecetApp

RecetApp is a modern web application to create, manage, and explore your favorite recipes — all stored in a robust PostgreSQL database.  
Built with Next.js 15, TypeScript, Tailwind v4, and Neon Postgres, RecetApp combines performance, simplicity, and elegance.

---

## 🚀 Tech Stack

| Layer           | Technologies                                                    |
| --------------- | --------------------------------------------------------------- |
| Frontend        | Next.js 15 (App Router), TypeScript, Tailwind CSS v4            |
| Backend         | Next.js Server Actions, Neon Postgres (SQL queries)             |
| Database        | Neon (PostgreSQL serverless)                                    |
| ORM / Query     | Vercel Postgres SDK / Neon SQL                                  |
| Auth (optional) | NextAuth (beta)                                                 |
| Deployment      | Vercel                                                          |
| Extras          | HTML-to-PDF export, Toast notifications, Skeleton UI components |

---

## 🧩 Features

- Create, edit, and delete recipes
- Organize ingredients and steps in structured lists
- Track creation date/time
- Search and filter recipes
- Generate PDF recipe exports (with styled layout)
- Responsive layout with optimized mobile/desktop views
- Server Actions with optimistic updates
- Clean folder structure and reusable UI components
- Tailwind v4 theme system and modern design tokens

---

## 🏗️ Project Structure

app/
├─ api/
│ └─ [id]/pdf/route.ts → Generates recipe PDFs
├─ dashboard/
│ └─ recipes/ → Main CRUD pages
│ ├─ create/ → Create form
│ ├─ edit/ → Edit form
│ ├─ [id]/view/ → Single recipe view
├─ lib/
│ ├─ data.ts → Fetch and query logic
│ ├─ actions.ts → Server actions (create, delete, etc.)
│ └─ utils.ts → Formatters and helpers
├─ ui/
│ ├─ recipes/ → Table, cards, buttons
│ ├─ search.tsx
│ └─ skeletons.tsx

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root and fill the following:

| Variable        | Description                               | Required |
| --------------- | ----------------------------------------- | -------- |
| POSTGRES_URL    | Connection string for Neon Postgres       | ✅       |
| NEXTAUTH_SECRET | Secret for NextAuth (if used)             | Optional |
| NEXTAUTH_URL    | App base URL (e.g. http://localhost:3000) | Optional |

Use the `.env.example` file as reference.

---

## 🧑‍🍳 Quick Start

### 1️⃣ Clone the repository

git clone https://github.com/pschonffeldt/recetapp.git
cd recetapp

### 2️⃣ Install dependencies

npm install

# or

pnpm install

### 3️⃣ Set environment variables

cp .env.example .env.local

### 4️⃣ Run the development server

npm run dev

The app will be available at:
Local: http://localhost:3000
Network: http://192.168.x.x:3000

---

## 🧾 Project Structure PDF Export

Each recipe view page includes a “Download as PDF” button.
This exports the recipe with name, type, ingredients, and steps in a clean layout.

Implementation uses:

@react-pdf/renderer or html2pdf.js (depending on setup)

API route at /api/[id]/pdf/route.ts

---

## 🧠 Data Model

CREATE TABLE recipes (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
recipe_name TEXT NOT NULL,
recipe_type TEXT,
recipe_ingredients TEXT[] NOT NULL,
recipe_steps TEXT[] NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
);

---

## 💡 Example Recipes

Some included Chilean dishes:
Pastel de Choclo
Cazuela de Pollo
Charquicán
Empanadas de Pino
Porotos Granados
Caldillo de Congrio
Sopaipillas
Ensalada Chilena
Curanto al Hoyo
Mote con Huesillo

---

## 📦 Deployment

RecetApp is optimized for Vercel:
Auto builds from GitHub main branch
Uses environment variables for Neon Postgres
Edge runtime ready (optional)

---

## 🧑‍💻 Author

Built by Paolo Schonffeldt
Full-stack developer & product maker from Santiago 🇨🇱 / Lima 🇵🇪

GitHub: [@pschonffeldt](https://github.com/pschonffeldt)
Portfolio: [pschonffeldt.dev](https://pschonffeldt.dev/)

---

## 🏷️ License

MIT License © 2025 Paolo Schonffeldt

---

“Cook your code, not just your meals.” 🍳
