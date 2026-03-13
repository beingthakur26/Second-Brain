# 🧠 Second Brain — Full Project Guide
> A personal knowledge management app where users save anything from the internet, and the system auto-organizes, relates, and resurfaces it.

---

## 📌 What Is This Project?

This is a **Second Brain** app — think of it as a smarter, AI-powered bookmark manager. Unlike a normal bookmark tool, this app:

- Understands **what** you saved (not just the URL)
- **Groups** related items automatically
- **Suggests** connections between items
- **Reminds** you of old saves at the right time
- Lets you **search by meaning**, not just keywords

### Real-World References
- **Notion** (manual organization)
- **Readwise** (resurfacing highlights)
- **Obsidian** (graph-based notes)
- **Pocket** (save articles)

You're building something that combines all of them — with AI on top.

---

## 🧩 What You're Actually Building (Broken Down)

### 1. Core Web App (React + Node + MongoDB)
The main dashboard where users see, search, and manage their saved items.

### 2. Browser Extension
A Chrome extension that lets users save any webpage with one click.

### 3. AI Processing Pipeline
When an item is saved, a background worker:
- Extracts text/metadata
- Generates tags using AI
- Creates embeddings for semantic search
- Clusters items by topic

### 4. Graph Visualization
A visual knowledge graph (using D3.js) showing connections between saved items.

### 5. Semantic Search
Search that understands meaning — "show me articles about focus" finds productivity content even without the word "focus."

### 6. Memory Resurfacing
A scheduled system that picks old relevant saves and resurfaces them ("You saved this 2 months ago — still relevant?")

---

## 🏗️ Full System Architecture

```
User
 │
 ├── Browser Extension ──────────────────────────────┐
 │                                                    │
 └── React Frontend (Next.js)                         │
      │                                               │
      └── Express API (Node.js)  ◄────────────────────┘
           │
           ├── MongoDB (main data store)
           │     └── Users, Items, Collections, Tags
           │
           ├── Queue Worker (BullMQ + Redis)
           │     └── Triggers on every new save
           │
           ├── AI Microservice (Python / Node)
           │     ├── Text extraction
           │     ├── Tag generation (OpenAI / local)
           │     ├── Embedding generation
           │     └── Topic clustering
           │
           └── Vector DB (Qdrant / Weaviate / Pinecone)
                 └── Stores embeddings for semantic search
```

---

## 🛠️ Tech Stack (MERN-Aligned)

| Layer | Tech | Why |
|---|---|---|
| Frontend | React + Next.js | SSR, routing, performance |
| Styling | Tailwind CSS | Fast UI, utility-first |
| Graph | D3.js | Custom force-directed graph |
| Backend | Node.js + Express | You already know this |
| Database | MongoDB + Mongoose | Flexible schema for varied content |
| Auth | JWT + bcryptjs | Same as CineVerse |
| Queue | BullMQ + Redis | Background job processing |
| AI / Embedding | OpenAI API | Tag generation + embeddings |
| Vector Search | Qdrant (self-hosted) | Semantic search |
| File Storage | Cloudinary | Images, PDFs |
| Extension | Chrome Extension (Manifest V3) | Save from browser |
| Caching | Redis | Queue + cache (same instance) |

---

## 📁 Folder Structure

### Root (Monorepo-style)
```
second-brain/
├── client/               ← Next.js frontend
├── server/               ← Express backend
├── extension/            ← Chrome extension
├── worker/               ← Queue worker (can be inside server)
├── .env.example
├── .gitignore
└── README.md
```

### Client (`/client`)
```
client/
├── public/
├── src/
│   ├── app/                    ← Next.js App Router
│   │   ├── layout.jsx
│   │   ├── page.jsx            ← Dashboard
│   │   ├── login/page.jsx
│   │   ├── register/page.jsx
│   │   ├── item/[id]/page.jsx  ← Single item view
│   │   ├── graph/page.jsx      ← Knowledge graph
│   │   └── collection/[id]/page.jsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── items/
│   │   │   ├── ItemCard.jsx
│   │   │   ├── ItemGrid.jsx
│   │   │   └── ItemDetail.jsx
│   │   ├── graph/
│   │   │   └── KnowledgeGraph.jsx   ← D3.js component
│   │   ├── search/
│   │   │   └── SearchBar.jsx
│   │   └── ui/
│   │       ├── TagBadge.jsx
│   │       └── ResurfaceCard.jsx
│   ├── hooks/
│   │   ├── useItems.js
│   │   └── useSearch.js
│   ├── services/
│   │   └── api.js              ← Axios instance
│   └── store/                  ← Redux Toolkit (optional)
│       ├── store.js
│       └── slices/
│           ├── itemsSlice.js
│           └── authSlice.js
├── tailwind.config.js
└── next.config.js
```

### Server (`/server`)
```
server/
├── src/
│   ├── config/
│   │   ├── db.js               ← MongoDB connection
│   │   └── redis.js            ← Redis connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Item.js
│   │   ├── Collection.js
│   │   └── Tag.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── item.routes.js
│   │   ├── collection.routes.js
│   │   ├── search.routes.js
│   │   └── graph.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── item.controller.js
│   │   ├── collection.controller.js
│   │   ├── search.controller.js
│   │   └── graph.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js  ← JWT verify (same as CineVerse)
│   │   └── upload.middleware.js
│   ├── services/
│   │   ├── extractor.service.js    ← Extract text from URLs
│   │   ├── ai.service.js           ← OpenAI calls
│   │   ├── embedding.service.js    ← Generate + store embeddings
│   │   └── resurfacing.service.js  ← Scheduled resurface logic
│   ├── workers/
│   │   ├── queue.js            ← BullMQ queue setup
│   │   └── processor.js        ← Job processor logic
│   └── index.js                ← Entry point
├── .env
└── package.json
```

### Extension (`/extension`)
```
extension/
├── manifest.json           ← Manifest V3 config
├── popup/
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── background/
│   └── service-worker.js   ← Handles save logic
├── content/
│   └── content.js          ← Grab selected text/highlights
└── icons/
    └── icon.png
```

---

## 🗂️ MongoDB Schemas (Conceptual)

### Item Schema
```
Item {
  userId: ObjectId
  type: 'article' | 'tweet' | 'image' | 'video' | 'pdf'
  url: String
  title: String
  description: String
  content: String            ← extracted text
  thumbnail: String
  tags: [String]             ← AI generated
  manualTags: [String]       ← user added
  highlights: [String]       ← selected text
  collectionId: ObjectId
  embeddingId: String        ← ID in vector DB
  cluster: String            ← topic cluster name
  relatedItems: [ObjectId]
  savedAt: Date
  lastSurfacedAt: Date
  surfaceCount: Number
}
```

### Collection Schema
```
Collection {
  userId: ObjectId
  name: String
  description: String
  color: String
  items: [ObjectId]
  createdAt: Date
}
```

---

## ⚙️ Step-by-Step Build Guide

---

### PHASE 1 — Project Setup

**Step 1: Create folder structure**
```bash
mkdir second-brain
cd second-brain
mkdir client server extension
```

**Step 2: Init server**
```bash
cd server
npm init -y
npm install express mongoose dotenv cors bcryptjs jsonwebtoken
npm install bullmq ioredis axios cheerio
npm install openai
npm install -D nodemon
```

**Step 3: Init client**
```bash
cd ../client
npx create-next-app@latest . --tailwind --app --src-dir
npm install axios @reduxjs/toolkit react-redux
npm install d3
```

**Step 4: .env setup for server**
```
PORT=5000
MONGO_URI=your_mongo_uri
JWT_SECRET=your_secret
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_key
QDRANT_URL=http://localhost:6333
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLIENT_URL=http://localhost:3000
```

---

### PHASE 2 — Auth System (Same as CineVerse)

Since you've already built JWT auth in CineVerse, replicate that pattern:

- `POST /api/auth/register` → hash password, create user, return JWT in cookie
- `POST /api/auth/login` → verify, set cookie
- `GET /api/auth/me` → verify JWT middleware, return user
- `POST /api/auth/logout` → clear cookie

Use `secure: true, sameSite: 'none'` for production cookies (same fix you did in CineVerse).

---

### PHASE 3 — Save Item Flow

This is the **core** of the app. When a user saves something:

**Step 1: POST /api/items — receive URL/content from frontend or extension**

**Step 2: Basic save** — store in MongoDB immediately with status `processing`

**Step 3: Push to BullMQ queue** — don't block the API response

**Step 4: Worker picks up the job and:**
1. **Extract content** using `cheerio` (scrape title, description, body text from URL)
2. **Generate tags** using OpenAI (`gpt-3.5-turbo` is fine) — send the title + description, ask for 5 tags
3. **Generate embedding** using OpenAI `text-embedding-3-small` — send the full content text
4. **Store embedding** in Qdrant with the item's MongoDB `_id` as payload
5. **Find related items** — query Qdrant for top 5 similar embeddings
6. **Update MongoDB item** — add tags, embedding ID, related items, set status `ready`

**How BullMQ Queue Works:**
- In `queue.js` — create a Queue called `'item-processing'`
- In your item controller — after saving to MongoDB, add job to the queue
- In `processor.js` — define the job handler, run all 5 steps above
- Start the worker separately (can be same process or separate `node worker/processor.js`)

---

### PHASE 4 — Semantic Search

**How it works:**
1. User types a query: "articles about deep work"
2. You convert the query to an embedding using OpenAI
3. You query Qdrant with that embedding vector
4. Qdrant returns top N most similar item IDs
5. You fetch those items from MongoDB and return them

**Setting up Qdrant locally:**
```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant
```

**Qdrant concepts you need:**
- **Collection** — like a MongoDB collection, but for vectors
- **Vector** — array of numbers (1536 numbers for OpenAI embeddings)
- **Payload** — metadata stored alongside the vector (store `itemId`, `userId`)
- **Search** — given a query vector, return closest N vectors

Create one Qdrant collection: `items` with vector size `1536`

---

### PHASE 5 — Knowledge Graph (D3.js)

**What the graph shows:**
- Each saved item = a **node**
- Related items = **edges** between nodes
- Nodes colored by topic cluster or tag

**How to build the D3 component:**
1. Create `GET /api/graph` endpoint — returns list of nodes + edges from MongoDB
2. In `KnowledgeGraph.jsx`, use `useEffect` to run D3 code after mount
3. Use `d3.forceSimulation()` — this is the key function for force-directed graphs
4. Nodes repel each other, edges pull them together — D3 handles physics automatically
5. Add `drag` behavior so users can move nodes
6. On node click — navigate to item detail page

**D3 force graph key concepts:**
- `d3.forceSimulation(nodes)` — create simulation
- `.force('link', d3.forceLink(edges))` — edge pulling force
- `.force('charge', d3.forceManyBody())` — node repulsion
- `.force('center', d3.forceCenter(width/2, height/2))` — center gravity
- On each tick — update SVG `<circle>` and `<line>` positions

---

### PHASE 6 — Browser Extension

**Manifest V3 structure:**
- `manifest.json` — declares permissions, popup, background service worker
- `popup.html + popup.js` — small UI that appears on click
- `content.js` — injected into every page, can grab selected text
- `service-worker.js` — background logic

**Save flow from extension:**
1. User clicks extension icon on any webpage
2. `popup.js` reads `document.title` and `window.location.href` from the active tab
3. Calls your API: `POST /api/items` with the URL + page title
4. JWT token stored in `chrome.storage.local` (not localStorage)
5. Shows success/error in popup

**Key permissions needed in manifest.json:**
```json
"permissions": ["activeTab", "storage"],
"host_permissions": ["<all_urls>"]
```

**To load extension in Chrome:**
- Go to `chrome://extensions`
- Enable Developer Mode
- Click "Load Unpacked" → select your `/extension` folder

---

### PHASE 7 — Highlight System

**How it works:**
1. `content.js` listens for `mouseup` event on all pages
2. When user selects text, show a small floating "Save Highlight" button
3. On click — send selected text + current URL to your API
4. API saves it as a highlight attached to the item

---

### PHASE 8 — Memory Resurfacing

**Two approaches:**

**Option A: Cron job in Node.js**
- Use `node-cron` package
- Every day at 9am — pick 3 random items saved 30-90 days ago per user
- Send them to a `resurfaces` collection or flag them in MongoDB
- Frontend fetches and shows a "Resurface Card" at top of dashboard

**Option B: BullMQ Delayed Jobs**
- When item is saved, schedule a delayed job for 30 days later
- Job fires → item appears in resurface feed

**Resurfacing algorithm (simple):**
```
SELECT items WHERE:
  savedAt < (now - 30 days)
  AND lastSurfacedAt < (now - 7 days)
  AND userId = currentUser
ORDER BY random
LIMIT 3
```

---

### PHASE 9 — Collections

Simple CRUD — users create collections (like folders), assign items to them.

- `POST /api/collections` — create
- `GET /api/collections` — list all
- `PUT /api/collections/:id/items` — add item to collection
- `DELETE /api/collections/:id` — delete

---

## 🔄 Full Request Flow (Save → Search)

```
1. User pastes URL in app (or clicks extension)
2. POST /api/items → Item saved in MongoDB (status: 'processing')
3. Job added to BullMQ queue
4. Response sent to user immediately ("Saved!")
5. Worker picks job:
   a. Scrapes URL with cheerio → extracts text
   b. Calls OpenAI → generates tags
   c. Calls OpenAI embeddings → gets vector [1536 floats]
   d. Stores vector in Qdrant with itemId as payload
   e. Queries Qdrant → finds top 5 similar items (related)
   f. Updates MongoDB item (tags, relatedItems, status: 'ready')
6. Frontend polls or uses WebSocket to show updated item
7. User searches "deep work"
   a. Query converted to embedding
   b. Qdrant returns top 10 similar item IDs
   c. MongoDB fetch those items
   d. Return to frontend
```

---

## 📦 All Packages to Install

### Server
```bash
# Core
npm install express mongoose dotenv cors

# Auth
npm install bcryptjs jsonwebtoken cookie-parser

# Queue
npm install bullmq ioredis

# Web scraping
npm install axios cheerio

# AI
npm install openai

# Vector DB client
npm install @qdrant/js-client-rest

# File upload
npm install cloudinary multer

# Scheduling
npm install node-cron

# Dev
npm install -D nodemon
```

### Client
```bash
npm install axios d3 @reduxjs/toolkit react-redux
npm install date-fns          # date formatting
npm install lucide-react      # icons
```

---

## 🧪 Development Order (Recommended)

```
Week 1  → Auth + Basic Item CRUD + MongoDB setup
Week 2  → Web scraping (cheerio) + OpenAI tags
Week 3  → Qdrant setup + embeddings + semantic search
Week 4  → BullMQ queue wiring (connect all AI steps)
Week 5  → D3.js Knowledge Graph
Week 6  → Browser Extension
Week 7  → Highlights + Collections
Week 8  → Resurfacing system + Polish UI
```

---

## 🚀 Deployment Plan

| Service | Deploy On |
|---|---|
| Next.js Frontend | Vercel |
| Express Backend | Render |
| MongoDB | MongoDB Atlas |
| Redis | Upstash Redis (free tier) |
| Qdrant | Qdrant Cloud (free tier) or Railway |
| Cloudinary | Cloudinary free tier |

> ⚠️ For Render deployment — same cookie fixes apply as CineVerse:
> `secure: true`, `sameSite: 'none'`, CORS config with `credentials: true`

---

## ⚡ Key Concepts to Learn Before Starting

1. **BullMQ** — how queues work, job lifecycle, retry logic
2. **Vector embeddings** — what they are (arrays of numbers that represent meaning)
3. **Qdrant basics** — create collection, upsert vectors, search
4. **D3.js force simulation** — `forceSimulation`, nodes, links, ticks
5. **Chrome Extension Manifest V3** — service workers replace background pages
6. **Cheerio** — server-side jQuery for web scraping
7. **OpenAI API** — `chat.completions` for tags, `embeddings` for vectors

---

## 💡 Start Here (Day 1 Checklist)

- [ ] Create monorepo folder structure
- [ ] Init server with Express + Mongoose
- [ ] Connect MongoDB Atlas
- [ ] Build auth (register/login/logout/me) — copy from CineVerse
- [ ] Create Item model in MongoDB
- [ ] Build `POST /api/items` — save a URL manually
- [ ] Build `GET /api/items` — list user's items
- [ ] Create basic React frontend with login + dashboard
- [ ] Show saved items as cards on dashboard

Once this works — everything else is additive on top.

---

> 📝 Built on MERN stack. Familiar territory — just new tools (BullMQ, Qdrant, D3, Chrome Extension) layered on top of what you already know.
