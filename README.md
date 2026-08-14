# Kwiz237

Live, host-controlled multiplayer quiz competition platform for in-person events.

## What this is

A quiz/trivia app for events where multiple groups play separate live sessions
throughout the same day. One host controls the game from a control panel, a
projector/TV shows the current question and results to the room, and each
player answers from their own phone. Scoring is automatic and server-side.

## Interfaces

- `/host/login`, `/host/dashboard` - host/admin control panel
- `/join`, `/play` - player-facing, mobile-first
- `/display` - public projector/TV screen (dark theme, large text)

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Real-time layer and database: to be added (Supabase recommended)

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:3000

## Brand colors

| Token | Hex | Use |
|---|---|---|
| Primary | #4F46E5 | Indigo |
| Secondary | #7C3AED | Purple |
| Background | #F8FAFC | Light gray |
| Correct | #16A34A | Green |
| Incorrect | #DC2626 | Red |
| Warning/Timer | #F59E0B | Amber |
| Option A | #4F46E5 | Indigo |
| Option B | #7C3AED | Purple |
| Option C | #0891B2 | Cyan |
| Option D | #EA580C | Orange |
| Display background | #0F172A | Dark navy |

These are wired in as Tailwind theme tokens in `src/app/globals.css`
(e.g. `bg-primary`, `text-text-muted`, `bg-option-a`, `bg-display-bg`).
