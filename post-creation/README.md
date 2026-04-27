# Mixcloud post creation prototype

A working prototype of a richer post-creation flow for the Mixcloud team:

- Two-step form: **Write your post** → **Finish your post** → rendered post view
- Lexical-powered WYSIWYG with bold/italic/underline, alignment, undo/redo
- Auto-embed for **YouTube**, **SoundCloud** and **Mixcloud** URLs (paste a URL into the editor)
- Post type selector — choosing **Upcoming live stream** reveals a date + time picker
- Rendered post view includes an **Add to calendar** dropdown
  - Google Calendar — opens prefilled compose window (functional)
  - Outlook / Office 365 — opens prefilled compose window (functional)
  - Apple Calendar / Outlook desktop — downloads `.ics` file (functional)

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4
- Radix UI primitives (shadcn-style components)
- Lexical (rich text)
- Zustand (cross-step state, persisted to localStorage)
- react-day-picker, date-fns, lucide-react

## Structure

- `src/app/page.tsx` — Step 1 form
- `src/app/finish/page.tsx` — Step 2 form
- `src/app/post/page.tsx` — Rendered post + Add-to-calendar
- `src/components/editor/` — Lexical editor, toolbar, embed node, paste-to-embed plugin
- `src/lib/calendar-links.ts` — Google/Outlook URL builders + `.ics` generator
- `src/lib/post-store.ts` — Zustand store
