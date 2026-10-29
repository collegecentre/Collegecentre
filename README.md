# CollegeCentre 2.0

> **"One link for everything you've built, achieved, and are."**
> A premium, student-focused identity and showcase platform.

---

## 🎯 Project Foundation & Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing, zero errors)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Design Tokens
- **Primitives**: Accessible [Radix UI](https://www.radix-ui.com/) Primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend / Database**: [Supabase](https://supabase.com/) & PostgreSQL (Client foundation prepared)

---

## 📐 Phase 0: Design System & Project Foundation

Phase 0 establishes the entire design language and reusable component foundation:

### 1. Visual & Token Architecture
- **Typography**: Dual-scale system with high-legibility sans-serif and tabular monospace accents (`Display`, `H1`-`H4`, `Lead`, `Body`, `Eyebrow`, `Code`).
- **Color Tokens**: Semantic variables configured for Light & Dark mode (`background`, `foreground`, `brand` electric cobalt, `success` emerald, `warning` amber, `destructive`).
- **Spacing Scale**: 4px base mathematical scale (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `48px`, `64px`).
- **Border Radii**: Restrained radii (`sm`: 4px, `md`: 6px, `lg`: 8px base) avoiding bloated bubble aesthetics.
- **Elevation & Shadows**: Multi-layer hairline shadows (`shadow-subtle`, `shadow-card`, `shadow-hover`, `shadow-modal`).
- **Breakpoints**: Standard mobile-first breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`).

### 2. UI Component Library (`src/components/ui/`)
1. **Typography** (`typography.tsx`): Polymorphic display, headings, lead, and caption components.
2. **Button** (`button.tsx`): 7 variants, 6 sizes, loading state with spinner, tactile active press (`active:scale-[0.98]`).
3. **Input** (`input.tsx`): Text, email, search, prefixes/suffixes, accessible helper notes and error states.
4. **Textarea** (`textarea.tsx`): Character counter, error messaging, smooth focus ring.
5. **Select** (`select.tsx`): Full Radix-based accessible dropdown selection.
6. **Checkbox** (`checkbox.tsx`): Custom styled with indeterminate and checked animations.
7. **Switch** (`switch.tsx`): Smooth pill toggle with label and description.
8. **Card** (`card.tsx`): Standard, flat, outline, and interactive hover elevation cards.
9. **Avatar** (`avatar.tsx`): Image, initials fallback, status dot (online/verified/busy), sizes `xs` to `2xl`.
10. **Badge** (`badge.tsx`): Verified student badges, achievement tags, dot indicators.
11. **Tabs** (`tabs.tsx`): Underline editorial tabs and segmented pill tabs.
12. **Dropdown Menu** (`dropdown-menu.tsx`): Items, checkboxes, radio groups, shortcuts, and separators.
13. **Dialog / Modal** (`dialog.tsx`): Backdrop blur, escape key, focus trapping, smooth entry animation.
14. **Toast Notification System** (`toast.tsx`): `ToastProvider` and `useToast` with action triggers.
15. **Tooltip** (`tooltip.tsx`): Hover tooltips with micro-positioning and delay configuration.
16. **Navigation** (`navigation.tsx`): Sticky blurred navbar, mobile drawer sheet, breadcrumbs.
17. **Loading States** (`loading.tsx`): Spinners, linear progress bars (determinate/indeterminate), loading overlays.
18. **Skeleton States** (`skeleton.tsx`): Skeletons for text, cards, avatars, and badges.
19. **Empty States** (`empty-state.tsx`): Clean zero-data states with primary & secondary CTAs.
20. **Error States** (`error-state.tsx`): Inline banners and full error screens with retry callbacks and debug disclosures.
21. **Confirmation Dialog** (`confirmation-dialog.tsx`): Destructive and primary confirmation modals with async loading states.

---

## 🚀 Running the Project

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Type-check
npx tsc --noEmit

# 4. Production build
npm run build
```
