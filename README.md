# Orchids File to PDF Converter

## 🚀 Setup & Installation

### Prerequisites

1. **Node.js**: v18+
2. **Redis**: Must be running locally (default: `localhost:6379`) or provide `REDIS_URL`.
3. **Firebase**:
   - Create a project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable **Authentication** (Email/Password, Google).
   - Enable **Firestore Database**.
   - Get Client Config -> `.env.local`
   - Get Service Account Key -> `.env.local` (for Admin SDK).

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
...
FIREBASE_SERVICE_ACCOUNT_KEY={"type": "service_account", ...} (One line JSON)
REDIS_URL=redis://localhost:6379
```

### 🏃‍♂️ Running the App

The app now consists of a Frontend/API and a Background Worker.

**Run All (Recommended):**

```bash
npm run dev:all
```

_This starts Next.js on port 3000 AND the conversion worker concurrently._

**Run Separately:**

- Terminal 1: `npm run dev`
- Terminal 2: `npm run worker`

## 🏗 Architecture

- **Frontend**: Next.js App Router (Glassmorphism UI).
- **Auth**: Firebase Auth + Context.
- **Queue**: BullMQ (Redis).
- **Worker**: Separate process handling heavy conversions (`src/worker.ts`).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
