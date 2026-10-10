# 08-zustand

**NoteHub** — a note-taking app built with **Next.js** (App Router), **React**, and **TypeScript**. It is a homework project from the [GoIT](https://goit.global/) course that builds on the previous routing version of NoteHub and adds client-side state management with [Zustand](https://zustand.docs.pmnd.rs/) (a persisted note draft), a dedicated "create note" page, and SEO metadata.

## 📋 About

Users can create, browse, filter by tag, search, preview, and delete notes stored on the GoIT NoteHub API.

### What's new in this version

- **Create note page (`/notes/action/create`)** — note creation moved from a modal to its own page. The form uses the React 19 form `action` API and Yup validation (the title is required, 3–50 characters, no leading or trailing spaces; the content is up to 500 characters; the tag is one of `Todo`, `Work`, `Personal`, `Meeting`, `Shopping`). Validation errors are shown under the corresponding field.
- **Persisted draft with Zustand** — the form fields are stored in a Zustand store (`useNoteDraftStore`) with the `persist` middleware, which saves the draft in `localStorage` under the `note-draft` key. If the user leaves the page and comes back, or reloads it, the unfinished note is still there. The draft is cleared after a note is created successfully.
- **After creating** — the notes queries are invalidated and refetched, and the user is redirected to `/notes/filter/all`.
- **SEO metadata** — the root layout, the filtered notes pages (`generateMetadata` based on the selected tag), and the create page define titles, descriptions, and Open Graph / Twitter card data.

### Routing

- **Home page (`/`)** — a welcome page describing the app.
- **Filtered notes (`/notes/filter/[...slug]`)** — a catch-all route. The first segment is the tag, and `all` shows every note. Notes are prefetched on the server with TanStack Query and passed to the client through `HydrationBoundary`.
- **Sidebar (parallel route `@sidebar`)** — links to "All notes" and each tag next to the notes list.
- **Note details (`/notes/[id]`)** — a full page for a single note.
- **Note preview modal (intercepting route `@modal/(.)notes/[id]`)** — **View details** inside the app opens the note in a modal over the current page; closing it calls `router.back()`. Opening the URL directly shows the full details page.
- **404 page**, plus `error.tsx` and `loading.tsx` files at several route levels.

### Other features

- **Notes list** — 12 notes per page, shown as cards with a title, content, tag, a **View details** link, and a **Delete** button.
- **Debounced search** — the query updates one second after the user stops typing ([use-debounce](https://github.com/xnimorz/use-debounce)) and resets the page to 1. A toast is shown when nothing is found.
- **Pagination** — [react-paginate](https://github.com/AdeleD/react-paginate) appears when there is more than one page; `keepPreviousData` keeps the previous page visible while the next one loads.
- **Notifications** — request errors and empty search results are shown as toasts ([react-hot-toast](https://react-hot-toast.com/)).

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router, server and client components, dynamic, catch-all, parallel, and intercepting routes, metadata API)
- [React](https://react.dev/) 19 with [React Compiler](https://react.dev/learn/react-compiler) enabled in `next.config.ts`
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand.docs.pmnd.rs/) v5 with the `persist` middleware — draft state management
- [TanStack Query](https://tanstack.com/query) v5 with Devtools — data fetching, SSR hydration, mutations, caching
- [Yup](https://github.com/jquense/yup) — form validation
- [axios](https://axios-http.com/) — HTTP client
- [react-paginate](https://github.com/AdeleD/react-paginate), [use-debounce](https://github.com/xnimorz/use-debounce), [react-hot-toast](https://react-hot-toast.com/), [react-spinners](https://github.com/davidhu2000/react-spinners)
- CSS Modules for component styles
- ESLint (`eslint-config-next`) and Prettier

## 📁 Project Structure

```
08-zustand-main/
├── app/
│   ├── layout.tsx                   # Root layout: header, footer, provider, @modal slot, metadata
│   ├── page.tsx                      # Home page
│   ├── not-found.tsx                  # Custom 404 page
│   ├── error.tsx / loading.tsx         # App-level error and loading UI
│   ├── @modal/(.)notes/[id]/            # Intercepting route: note preview modal
│   └── notes/
│       ├── [id]/                         # Full note details page
│       ├── action/create/                 # Create note page
│       └── filter/
│           ├── layout.tsx                  # Layout with sidebar and content slots
│           ├── @sidebar/default.tsx         # Tag navigation (parallel route)
│           └── [...slug]/                    # Notes filtered by tag (catch-all route)
├── components/
│   ├── Header/, Footer/                    # Layout
│   ├── NoteList/, NoteForm/                 # Cards, delete, create form
│   ├── SearchBox/, Pagination/               # Search and paging
│   ├── Modal/, Loader/                        # Modal window and loading indicator
│   └── TanStackProvider/                       # QueryClientProvider + Devtools
├── lib/
│   ├── api.ts                                 # NoteHub API requests
│   └── store/noteStore.ts                      # Zustand store with the persisted draft
├── types/
│   └── note.ts                                 # Note types
├── .env.example                                 # Environment variable template
├── next.config.ts
└── package.json
```

## 🚀 Getting Started

Requires an LTS version of [Node.js](https://nodejs.org/) and a NoteHub API token (issued as part of the GoIT course).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and put your token in it:

   ```
   NEXT_PUBLIC_NOTEHUB_TOKEN=your_notehub_token
   ```

3. Start the dev server and open [http://localhost:3000](http://localhost:3000):

   ```bash
   npm run dev
   ```

Other scripts:

```bash
npm run lint      # Lint the code
npm run build     # Create a production build
npm run start     # Run the production build
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are embedded into the client bundle, so the token is visible in the browser. Never commit your `.env` file (it is listed in `.gitignore`).
