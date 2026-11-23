# Feature: Jacobo Pineda's 1st Birthday Interactive Invitation
Branch: `feat/jacobo-interactive-invitation` | Delivery strategy: `ask-on-risk` | Test runner: `pnpm test` (Vitest)
Objective: Build a faithful, mobile-first Baby Jungle Safari interactive web invitation from the uploaded invitation video (`WhatsApp_Video_2026-11-22_at_7.32.27_PM.mp4`).

## Specs

- **S1**: Faithful Baby Jungle Safari interactive web invitation derived from uploaded video (`"¡Mi Primer Añito!"`, `"Jacobo Pineda"`, `"¡Te invito a celebrarlo!"`, `"13 de Diciembre, 2026"`, `"Unidad Oporto Campestre"`, `"Cra. 78 #40-25, Copacabana, Antioquia"`, `"¡Confirma tu asistencia aquí abajo!"`) with embedded original MP4 video (`public/media/invitacion-jacobo.mp4`) and interactive heart-sealed envelope entrance unlocking audio.
- **S2**: Confirmed event details: `4:00 p. m.` (`America/Bogota`, UTC-5), `"Salón Social"` at `"Unidad Oporto Campestre"`, WhatsApp RSVP to `3005944356` (`573005944356`).
- **S3**: Explicit exclusion: `"no pongas nada en los regalos"` — zero gift/rain-of-envelopes/registry content anywhere.
- **S4**: Pure domain utilities built test-first (RED -> GREEN): Bogota-anchored live countdown (`upcoming`/`today`/`past`), RFC 5545 `.ics` download + Google Calendar link, RSVP validation + WhatsApp deep-link builder + safe `localStorage` persistence.
- **S5**: Interactive venue section (embedded map, Google Maps, Waze, copy address toast) and joyful subtle safari interactions (poppable floating pastel balloons, confetti bursts, `prefers-reduced-motion` support, floating audio/RSVP toolbar).
- **S6**: Verified production build, Vitest suite, strict TypeScript check, and mobile (`390x844`) + desktop (`1440x900`) live browser verification with walkthrough artifact.

## Tasks

- [x] **T1** (`S1`, `S2`, `S3`) | Route: `inline` | Scaffold Vite + React + TS project, media copy, safari illustrations, and `src/config/event.ts` | Commit: `5f886cb` (`tsc --noEmit` exit 0)
- [x] **T2** (`S2`, `S4`) | Route: `inline` | Implement pure domain utilities (`countdown`, `calendar`, `rsvp`) via TDD (RED -> GREEN) | Commit: `9cc5d7f` (16/16 Vitest tests GREEN, `tsc --noEmit` exit 0; Engram mirror pending after MCP load error)
- [x] **T3** (`S1`, `S2`, `S3`, `S5`) | Route: `inline` | Build Safari theme, EnvelopeIntro, HeroVideoStage, CountdownSection, LocationSection, InteractiveBalloons, FloatingToolbar | Commit: `f7885ab` (`tsc --noEmit` exit 0)
- [x] **T4** (`S1`, `S2`, `S3`, `S4`) | Route: `inline` | Build interactive RsvpSection + App wiring + component/app smoke tests (RED -> GREEN) | Commit: `50f6a2f` (20/20 Vitest GREEN, `tsc --noEmit` exit 0, `vite build` exit 0)
- [x] **T5** (`S6`) | Route: `inline` | Run full Vitest/typecheck/build verification, live mobile & desktop browser audit, and create walkthrough artifact | Commit: pending | Polish: `c5dd0dd` | Verified: `pnpm test` (20/20 GREEN), `tsc --noEmit` (0 errors), `vite build` (2.33s), browser audit 390x844 & 1440x900 (0 overflow, 0 console errors) | Risk: none

## Log

- **L1** (2026-11-22): `ahora quiero que realices un invitación completa e interactiva a partir de este video` (uploaded `WhatsApp_Video_2026-11-22_at_7.32.27_PM.mp4`).
- **L2** (2026-11-22): `apruebo el plan, el evento es a las 4 pm. el número es 3005944356, salon social de Oporto Campestre, que avance, no pongas nada en los regalos.`
- **L3** (2026-11-22): Completed T1–T5 on `feat/jacobo-interactive-invitation`. Extracted shared `src/utils/clipboard.ts` and `src/utils/confetti.ts`; fixed mobile viewport overflow guards (`html { overflow-x: hidden }`, `min-w-0`), removed `aria-hidden` around interactive balloons, and adjusted signboard spacing (`c5dd0dd`). Re-verified 20/20 Vitest tests, strict TypeScript, Vite production bundle, and mobile (`390x844`) + desktop (`1440x900`) browser audit. Note: Engram MCP server (`gentle-ai-engram_engram`) returned `exit status 0xffffffff` during execution, so the Engram mirror (`odd/jacobo-first-birthday-invitation/tasks`) remains pending sync when Engram restarts.
