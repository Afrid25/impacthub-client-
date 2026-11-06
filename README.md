# ImpactHub — Community & Social Development Events Platform

ImpactHub is a full-stack community event management platform where volunteers and organizers can discover, create, join, update, and manage social development initiatives such as neighborhood cleanups, tree plantations, blood donation drives, food distribution, and educational workshops.

- **Live Site URL:** [https://impacthub-client.vercel.app](https://impacthub-client.vercel.app) *(update with your live Vercel URL if different)*
- **Backend API URL:** [https://impacthub-server.vercel.app](https://impacthub-server.vercel.app) *(update with your live Vercel API URL if different)*

---

## Purpose

ImpactHub bridges the gap between local organizers and community volunteers by providing a centralized, responsive, and secure platform to coordinate social impact initiatives and track volunteer participation.

---

## Key Features

- **Discover & Filter Upcoming Events:** Browse upcoming community initiatives with server-backed and real-time search by title/location, category filtering (`Cleanup`, `Plantation`, `Donation`, `Blood Donation`, `Food Distribution`, `Education`, and custom categories), and sorting by event date or name.
- **Create Community Initiatives:** Authenticated users can organize new events with strict client-side and server-side validation (including future-only event date validation, URL validation, and creator attribution from verified session tokens).
- **One-Click Event Participation & Duplicate Prevention:** Logged-in volunteers can join events from the Event Details page with server-verified event snapshots, automatic duplicate-join prevention (`409 Conflict` + unique compound MongoDB index), and chronological sorting on the Joined Events page.
- **Manage Created Events (Full CRUD):** Event organizers can view all events they created, edit event details in a pre-filled modal dialog without creating duplicate records, and delete their events with confirmation dialogs.
- **Cross-Domain JWT Authentication & Route Protection:** Powered by Better Auth (`jwt` plugin + JWKS endpoint) on Next.js and cryptographic Bearer JWT verification (`jose`) on Express, ensuring seamless authentication across separate Vercel frontend and backend deployments.
- **Midnight Ember Theme System:** Custom dark and light mode design system with persistent theme switching, responsive layouts across mobile/tablet/desktop, loading skeletons, and Sonner toast notifications.

---

## Technologies & Packages Used

### Frontend (`impacthub-client`)
- **Framework:** Next.js 16.4.5 (App Router, Server & Client Components)
- **UI Library:** React 19.2.3
- **Styling:** Tailwind CSS 4, `tw-animate-css`, shadcn/ui (`@base-ui/react`, `radix-ui`)
- **Authentication:** Better Auth (`better-auth`, `@better-auth/mongo-adapter`, Better Auth `jwt` plugin)
- **Database Client:** MongoDB Native Driver (`mongodb`)
- **Icons & Notifications:** `lucide-react`, `sonner`, `next-themes`

### Backend (`impacthub-server`)
- **Runtime & Framework:** Node.js, Express.js 5
- **Database:** MongoDB Atlas (`mongodb` Native Driver v7)
- **Authentication & Security:** `jose` (Remote JWKS cryptographic JWT verification), `cors`, `dotenv`

---

## Environment Variables

### Frontend (`impacthub-client` — `.env` / Vercel Environment Variables)
- `DB_URL` — MongoDB connection string used by Better Auth (`src/lib/auth.js`)
- `BETTER_AUTH_SECRET` — Secret key used by Better Auth to sign sessions and tokens
- `BETTER_AUTH_URL` — Public base URL of the Next.js frontend (used by Better Auth server and `src/lib/auth-client.js`)
- `NEXT_PUBLIC_API_URL` — Public base URL of the Express backend API (`src/lib/api.js`)
- `GOOGLE_CLIENT_ID` — Google OAuth 2.0 Client ID (`src/lib/auth.js`)
- `GOOGLE_CLIENT_SECRET` — Google OAuth 2.0 Client Secret (`src/lib/auth.js`)

### Backend (`impacthub-server` — `.env` / Vercel Environment Variables)
- `PORT` — Server port, defaults to `4500` (`index.js`)
- `DB_URL` — MongoDB Atlas connection string (`index.js`)
- `CLIENT_URL` — Public origin URL of the Next.js frontend, used for CORS and Better Auth JWKS / JWT `issuer` and `audience` verification (`index.js`)
