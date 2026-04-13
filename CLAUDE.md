# Apply.come — Agent Instructions & Development Preferences

> This file is the single source of truth for any AI agent or developer working on this codebase.
> Read it fully before writing any code.

---

## 1. Project Identity

**Apply.come** is a full-stack job application tracking system. It is the *UI layer* for a broader job-search workflow that includes AI-powered job evaluation, CV tailoring, batch processing, and portal scanning. The stack is:

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript (strict) |
| Build | Vite |
| Backend | Supabase (PostgreSQL + Auth + Realtime + Storage) |
| Styling | Vanilla CSS with CSS custom properties (NO Tailwind) |
| Routing | React Router v6 |
| Drag & Drop | react-beautiful-dnd |
| Date utilities | date-fns |

---

## 2. Architecture Principles

### 2.1 Keep layers clean
- `src/lib/` — pure logic, types, evaluation engine, API calls
- `src/hooks/` — data fetching + mutations via Supabase (no UI concerns)
- `src/components/` — reusable presentational components
- `src/app/` — page-level components assembled from hooks + components

### 2.2 One authoritative evaluation model
All AI pipeline data must be stored/validated through `src/lib/evaluation.ts`:
- Never bypass `deriveEvaluationFields()` when persisting scores
- Always validate incoming JSON with `isValidJobEvaluation()` before INSERT
- The rubric version is pinned in `EVALUATION_RUBRIC_VERSION` — do **not** change it ad hoc

### 2.3 AI pipeline columns live in `ApplicationPipelineFields`
The following columns in the `applications` table are **AI-owned** (write only via pipeline):
- `jd_snapshot`, `jd_fetched_at`, `jd_content_hash`
- `evaluation` (JSONB), `fit_score`, `fit_grade`, `evaluation_rubric_version`, `profile_context_version`
- `tailored_cv_pdf_path`, `tailored_cv_pdf_url`, `tailored_cv_generated_at`
- `recommend_apply`

User-editable columns come from `ApplicationFormData` only.

---

## 3. Evaluation Rubric

Ten equally weighted dimensions (each weight = 0.1). Grades map as:

| Score | Grade | Meaning |
|-------|-------|---------|
| ≥ 4.5 | A | Excellent fit |
| ≥ 4.0 | B | Strong fit — recommend apply |
| ≥ 3.0 | C | Moderate fit |
| ≥ 2.0 | D | Weak fit |
| ≥ 1.0 | E | Poor fit |
| < 1.0 | F | Do not apply |

`recommend_apply = fit_score >= 4.0`

When surfacing evaluation data in any UI component, use `scoreToLetterGrade()` and `computeWeightedScore()` from `evaluation.ts` — never hardcode grade logic.

---

## 4. Application Status Pipeline

Canonical statuses (in order):

```
wishlist → applied → interview → offer
                              ↘ rejected
```

These are defined in `src/lib/types.ts` as `ApplicationStatus`. The Kanban board models these as columns. Status-specific date fields must be updated together with the status:

| Status | Date field |
|--------|------------|
| applied | `applied_date` |
| interview | `interview_date` |
| offer | `offer_date` |
| rejected | `rejected_date` |

---

## 5. Design System (Non-negotiable)

### Typography
- **Primary font**: Inter (loaded from Google Fonts)
- **Future alternative**: Space Grotesk (for headings) + DM Sans (for body) — reserve for redesign work
- Font sizes follow the scale defined in `index.css`

### Color Palette (Dark default)
```css
--bg-primary:      hsl(220, 25%, 10%)
--bg-secondary:    hsl(220, 20%, 14%)
--bg-tertiary:     hsl(220, 18%, 18%)
--accent-primary:  hsl(280, 100%, 65%)   /* purple */
--accent-secondary: hsl(210, 100%, 60%) /* blue */
--accent-success:  hsl(140, 100%, 45%)
--accent-warning:  hsl(45, 100%, 60%)
--accent-error:    hsl(0, 80%, 60%)
```

Light theme overrides live in `.light {}`.

### Visual Language
- **Glassmorphism** is the core aesthetic: use `.glass`, `.glass-card` CSS classes
- **Gradients**: primary buttons use `linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))`
- All interactive elements must have micro-animations (hover lift, opacity transition)
- Avoid plain colors — always use HSL tokens from the design system
- Never use inline styles for layout — extend `index.css` with proper class names

### Component CSS Pattern
```css
/* Preferred: use design token variables */
.my-component {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}
```

---

## 6. TypeScript Standards

- Strict mode is **on** — never use `any`, use `unknown` if truly dynamic
- All component props must have a named `interface`
- File naming: PascalCase for components, camelCase for hooks/utilities
- Hook naming: always `use` prefix
- Constants: `UPPER_SNAKE_CASE`

### Component template
```typescript
// 1. Imports (external → internal → types)
// 2. Interface definitions
// 3. Component function with destructured props
// 4. Hooks at top level
// 5. Derived state / memos
// 6. Event handlers (useCallback if passed to children)
// 7. Return JSX
```

---

## 7. Supabase Patterns

### Always use typed client
```typescript
import { supabase } from '@/lib/supabase';
```

### Row selection — always select explicit columns
```typescript
const { data } = await supabase
  .from('applications')
  .select('id, position, status, company:companies(name), fit_score, fit_grade')
  .eq('user_id', userId);
```

### Error handling
All Supabase calls must destructure `{ data, error }` and handle the error path before using `data`.

### Real-time
Use `supabase.channel()` subscriptions in hooks, not components. Always return a cleanup function.

---

## 8. AI Pipeline Integration Points

The UI must expose and display the following AI pipeline outputs:

| Feature | Where |
|---------|-------|
| `fit_score` + `fit_grade` | ApplicationCard badge |
| `recommend_apply` | Boolean indicator on card and detail modal |
| `evaluation.dimensions` | Spider/radar chart in ApplicationDetailModal |
| `evaluation.summary` | Tooltip or expandable section |
| `tailored_cv_pdf_url` | Download button on ApplicationDetailModal |
| `jd_snapshot` | Collapsible section for JD text |

When displaying `fit_grade`:
- A = `--accent-success`
- B = `--accent-secondary` (blue)
- C = `--accent-warning`
- D/E = `--accent-error`
- F = `--text-tertiary`

---

## 9. File Organization Reference

```
Apply.come/
├── CLAUDE.md                    ← You are here
├── docs/
│   ├── SYSTEM_ARCHITECTURE.md
│   ├── DATABASE_SETUP.md
│   ├── code-standards.md
│   └── codebase-summary.md
├── src/
│   ├── app/                     ← Page-level components
│   │   ├── layout.tsx
│   │   ├── page.tsx             ← Dashboard
│   │   ├── applications/        ← Applications list page
│   │   ├── companies/           ← Companies page
│   │   ├── kanban/              ← Kanban board page
│   │   └── landing/             ← Marketing landing
│   ├── components/
│   │   ├── applications/
│   │   │   ├── ApplicationDetailModal.tsx
│   │   │   └── ApplicationTimeline.tsx
│   │   ├── dashboard/
│   │   │   └── UpcomingReminders.tsx
│   │   └── ui/                  ← Shared primitives (Modal, Badge, etc.)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useApplications.ts
│   │   ├── useCompanies.ts
│   │   └── useReminders.ts
│   └── lib/
│       ├── api/
│       │   ├── applications.ts
│       │   ├── reminders.ts
│       │   └── storage.ts
│       ├── evaluation.ts        ← SINGLE SOURCE OF TRUTH for scoring
│       ├── types.ts
│       ├── constants.ts
│       └── supabase.ts
├── supabaseDB/                  ← SQL migrations
└── public/
```

---

## 10. Future Roadmap (Ordered Priority)

1. **Evaluation display** — Surface `fit_score`, `fit_grade`, `recommend_apply` on ApplicationCard and modal
2. **JD Snapshot view** — Display `jd_snapshot` text with fetch timestamp in detail modal
3. **CV download** — Show "Download Tailored CV" button when `tailored_cv_pdf_url` is set
4. **Evaluation radar chart** — Visualize the 10 rubric dimensions in `ApplicationDetailModal`
5. **Search & filter** — Filter by status, grade, company, date range
6. **Analytics page** — Charts for pipeline health, grade distribution, success rates
7. **Reminders system** — Full CRUD UI for `Reminder` (API already exists in `src/lib/api/reminders.ts`)
8. **Document vault** — File upload/download UI using `src/lib/api/storage.ts`
9. **Export** — CSV/JSON export of applications with evaluation data
10. **Notes v2** — Rich text notes linked to applications

---

## 11. What NOT to Do

- ❌ Do not add Tailwind CSS
- ❌ Do not bypass `evaluation.ts` for score computation
- ❌ Do not use inline styles for theming
- ❌ Do not store evaluation JSON without validating via `isValidJobEvaluation()`
- ❌ Do not modify `RUBRIC_DIMENSIONS` or `EVALUATION_RUBRIC_VERSION` without a new rubric version
- ❌ Do not use `any` type
- ❌ Do not put data-fetching logic inside components — use hooks
- ❌ Do not create new color values outside the CSS token system
