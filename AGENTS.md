# AGENTS.md — Master Maintenance Guide for AI Coding Agents
**Project:** Personal Portfolio — Rithul Raveendran  
**Target Environment:** React 19 / TypeScript / Vite / CSS Modules / GSAP ScrollTrigger / Lenis  
**Hosting Compatibility:** Dual Target (GitHub Pages & Vercel — 100% Static Runtime)  
**Document Purpose:** Mandatory operational manual and rules of engagement for any AI coding agent modifying, extending, or maintaining this codebase.

---

## 1. Project Purpose & Design Philosophy

This repository is the personal engineering portfolio of **Rithul Raveendran**, a second-year B.Tech student in Artificial Intelligence and Machine Learning at St. Joseph's College of Engineering, Chennai.

### Core Visual Direction (Apple-Inspired Restraint)
* **Tone:** Quiet, confident, mature, and deeply authentic.
* **Palette:** Pure black canvas (`#000000`), dark carbon surfaces (`#0a0a0c`), crisp white headlines, muted platinum gray reading text (`#86868b`), and 1px hairline dividers (`rgba(255, 255, 255, 0.08)`).
* **Strict Design Prohibitions:**
  * ❌ NEVER introduce floating skill pills, badges, or rounded tags.
  * ❌ NEVER introduce rainbow borders, neon colors, glow filters, or harsh gradients.
  * ❌ NEVER introduce sparkle icons (✨), decorative emojis, or AI template clichés.
  * ❌ NEVER introduce 3D tilt cards following the mouse or typewriter text animations.
  * ❌ NEVER invent metrics, unconfirmed performance claims, or fake credentials.
  * ❌ NEVER replace personal photographs or authentic project visuals with stock or AI-generated art.

---

## 2. Technology Stack

* **UI Framework:** React 19 (Functional components, strict TypeScript)
* **Build Tooling:** Vite 6 (configured for relative/environment-aware base paths)
* **Language:** TypeScript 5.7+ (strict mode enabled, `noEmit`, explicit interfaces)
* **Styling:** CSS Modules (`.module.css`) + CSS Custom Properties (`src/styles/tokens.css`)
* **Smooth Scrolling:** [Lenis](https://github.com/darkroomengineering/lenis) (single global instance, ticker-synchronized)
* **Scroll Choreography:** [GSAP](https://greensock.com/gsap/) + [ScrollTrigger](https://greensock.com/scrolltrigger/)
* **Static Telemetry:** Automated Python 3.11 scripts executed via GitHub Actions

---

## 3. Directory Structure & Responsibilities

```text
portfolio-revamp/
├── .github/
│   └── workflows/
│       ├── update-stats.yml            # Hourly cron + manual dispatch telemetry pipeline
│       └── deploy.yml                  # GitHub Pages static deployment
├── AGENTS.md                           # THIS FILE: AI agent rules of engagement
├── public/
│   ├── assets/
│   │   ├── about/                      # Authentic personal photographs (2-3 items)
│   │   ├── projects/                   # Subdirectories per project with authentic visuals
│   │   ├── certs/                      # Certification preview imagery & PDFs
│   │   ├── achievements/               # Hackathon & competition evidence imagery
│   │   ├── social/                     # Five MP4/WebM looping animations
│   │   └── resume/                     # Official resume.pdf
│   ├── favicon.svg
│   └── robots.txt
├── scripts/                            # Python telemetry collection pipeline
│   ├── requirements.txt
│   ├── collect_stats.py                # Main orchestrator with independent try/catch
│   ├── collectors/                     # Modular collectors (github, leetcode, etc.)
│   └── utils/                          # Heatmap normalizer and atomic JSON storage
├── src/
│   ├── config/
│   │   └── profile.ts                  # Centralized links, handles, contact constants
│   ├── content/                        # PURE DATA FILES (AI edits happen here!)
│   │   ├── projects.ts                 # Array of ProjectEntry
│   │   ├── experience.ts               # Array of ExperienceEntry (strictly text-only)
│   │   ├── certifications.ts           # Array of CertificationEntry
│   │   ├── achievements.ts             # Array of AchievementEntry
│   │   └── skills.ts                   # Array of SkillCategory
│   ├── data/
│   │   ├── stats.json                  # Production telemetry (Git-tracked)
│   │   └── mockStats.json              # Development-only mock telemetry (explicitly tagged)
│   ├── hooks/
│   │   ├── useLenis.ts                 # Smooth scroll lifecycle
│   │   ├── useScrollTrigger.ts         # GSAP registration & cleanup (gsap.context)
│   │   └── usePrefersReducedMotion.ts  # OS accessibility query
│   ├── types/
│   │   ├── stats.ts                    # TypeScript types for telemetry & status
│   │   └── content.ts                  # TypeScript types for all content entries
│   ├── utils/
│   │   └── assets.ts                   # Base-path safe asset resolver (getAssetPath)
│   ├── styles/
│   │   ├── tokens.css                  # Apple design tokens, typography, spacing
│   │   ├── reset.css                   # Modern CSS reset
│   │   └── globals.css                 # Base scroll & selection styles
│   ├── components/
│   │   ├── common/                     # Reusable UI primitives (Navbar, Modal, Hairline)
│   │   ├── visualizers/                # Pure SVG charts, heatmaps, rating graphs
│   │   └── sections/                   # 13 numbered section components (01_Hero to 13_Footer)
│   ├── App.tsx                         # Section layout orchestrator
│   └── main.tsx                        # Application mount
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json                         # Header & cache configuration
└── vite.config.ts                      # Environment-aware base path configuration
```

---

## 4. Mandatory Rules of Engagement for AI Agents

When tasked with adding content, fixing a bug, or modifying styles:

1. **Inspect Before Editing:** Read the relevant data file (`src/content/*`) and component before proposing or making changes.
2. **Strict Content-UI Separation:**
   * Adding or editing a project? Edit `src/content/projects.ts`. **Do not touch `src/components/sections/04_Projects/`.**
   * Adding a certificate? Edit `src/content/certifications.ts`. **Do not touch `src/components/sections/11_Certifications/`.**
   * Adding experience? Edit `src/content/experience.ts`. **Do not touch `src/components/sections/03_Experience/`.**
3. **Smallest Necessary Changes:** Never perform broad, unrequested refactors. Never replace working components with external libraries or alternative implementations.
4. **Preserve Working Logic:** Never break existing animations, responsive breakpoints, or image modals.
5. **Safe Asset References:** Always use `getAssetPath()` from `@/utils/assets` for any asset stored in `public/`. Never hardcode absolute strings like `"/assets/..."` because they break on GitHub Pages subdirectory deployments.
6. **Mandatory Post-Edit Verification:** Always run `npm run build`, `npm run typecheck`, and `npm run lint` after every modification. If errors arise, fix them before declaring completion.

---

## 5. Step-by-Step Cookbooks for Common Tasks

### Cookbook 1: How to Add or Update a Project
1. **Asset:** Place genuine screenshot, architecture schematic, or interface preview in `public/assets/projects/<project-slug>/preview.webp`.
2. **Data:** Open `src/content/projects.ts` and append an object matching `ProjectEntry`:
   ```ts
   {
     id: 'new-project-slug',
     title: 'Project Title',
     tagline: 'Concise one-line summary.',
     description: 'Detailed description of the technical architecture and impact.',
     category: 'Computer Vision',
     technologies: ['Python', 'YOLO', 'FastAPI'],
     visuals: {
       hero: 'assets/projects/new-project-slug/preview.webp',
     },
     links: {
       github: 'https://github.com/rithulraveendran/...',
       demo: 'https://...',
     },
   }
   ```
3. **Verification:** Run `npm run typecheck` and `npm run build`.

### Cookbook 2: How to Add an Experience Entry
1. **Constraint Check:** The Experience section is **strictly text-only**. Do not add images, certificates, or image placeholders.
2. **Data:** Open `src/content/experience.ts` and append an object matching `ExperienceEntry`:
   ```ts
   {
     id: 'organization-slug',
     role: 'AI Engineer Intern',
     organization: 'BitBridge Technologies',
     period: {
       start: 'June 2026',
       end: 'July 2026',
     },
     description: [
       'Implemented YOLO computer vision models for edge inference on RV1106 hardware.',
       'Configured embedded Linux OS toolchains and optimized model latency.',
     ],
     technologies: ['Python', 'YOLO', 'Linux', 'RV1106'],
   }
   ```
3. **Verification:** Run `npm run typecheck`.

### Cookbook 3: How to Add a Certification
1. **Asset:** Place high-resolution image or PDF preview in `public/assets/certs/cert-name.webp`.
2. **Data:** Open `src/content/certifications.ts` and append an object matching `CertificationEntry`:
   ```ts
   {
     id: 'cert-slug',
     title: 'AWS Certified Machine Learning - Specialty',
     issuer: 'Amazon Web Services',
     issueDate: '2026-04',
     image: 'assets/certs/cert-name.webp',
     credentialUrl: 'https://...',
   }
   ```
3. **Verification:** Run `npm run build`.

### Cookbook 4: How to Add an Achievement
1. **Asset:** Place event photo or competition certificate in `public/assets/achievements/achievement-name.webp`.
2. **Data:** Open `src/content/achievements.ts` and append an object matching `AchievementEntry`:
   ```ts
   {
     id: 'makeathon-3-winner',
     title: '1st Place Winner',
     event: 'Makeathon 3.0',
     date: '2026-02',
     category: 'hackathon',
     description: 'Built an emergency rural telemedicine routing platform with on-device AI.',
     evidenceImage: 'assets/achievements/achievement-name.webp',
     externalLink: 'https://...',
   }
   ```
3. **Verification:** Run `npm run typecheck`.

### Cookbook 5: How to Update Skills
1. **Data:** Open `src/content/skills.ts` and modify or append categories matching `SkillCategory`:
   ```ts
   {
     category: 'Core Programming',
     items: ['Python', 'C', 'C++', 'SQL', 'TypeScript'],
   }
   ```
2. **Rule:** Never add percentage proficiency scores (e.g. `90%`) or star ratings. Use clean typographic lists.

### Cookbook 6: How to Update Personal Photographs (About Section)
1. **Constraint Check:** Photographs belong **only** in `public/assets/about/` for the sticky About sequence. **Never add personal photos to Hero or Experience.**
2. Place authentic personal photo in `public/assets/about/photo-1.webp`.
3. Update references in `src/components/sections/02_About/` if image filenames change.

### Cookbook 7: How to Update Social Links & Résumé
1. **Résumé PDF:** Replace `public/assets/resume/resume.pdf`. Ensure filename and path match `src/config/profile.ts`.
2. **Social URLs:** Edit `src/config/profile.ts` under `PROFILE_CONFIG.social`.
3. If changing video animations, place MP4/WebM file in `public/assets/social/` and update `videoAsset` path.

---

## 6. Animation & Lifecycle Rules

* **Lenis:** Instantiated through `useLenis()`. Never create duplicate `new Lenis()` instances in components.
* **GSAP ScrollTrigger:**
  * When writing animations inside components, always use `useScrollTrigger(callback, scopeRef)` or wrap in `gsap.context()`.
  * Always clean up triggers on unmount.
  * Desktop horizontal scroll is pinned only for screen widths $\ge 860\text{px}$. Below $860\text{px}$, it must collapse to a vertical stack.
* **Prefers Reduced Motion:** Always honor `usePrefersReducedMotion()`. If true, bypass all scrubbing, motion translations, and scale tweens.

---

## 7. Dual Deployment & Asset Resolution Rules

* **Base Path Handling:** In `vite.config.ts`, `base: process.env.VITE_BASE_PATH || '/'`.
* **Asset Helper:** Every asset loaded from `public/` must use:
  ```ts
  import { getAssetPath } from '@/utils/assets';
  // Example:
  <img src={getAssetPath('assets/certs/aws.webp')} alt="..." />
  ```
  **Never write:** `<img src="/assets/certs/aws.webp" />` (breaks under GitHub Pages subdirectory).

---

## 8. Development, Verification & Check Commands

Run these commands before declaring any task complete:

```bash
# Start local development server
npm run dev

# Full TypeScript check (noEmit)
npm run typecheck

# ESLint check
npm run lint

# Production build check (compiles to dist/)
npm run build

# Preview production build locally
npm run preview

# Run telemetry pipeline unit tests
python scripts/test_pipeline.py

# Run live telemetry collection locally
python scripts/collect_stats.py
```

---

## 9. Telemetry Pipeline & GitHub Actions Automation

* **Pipeline Orchestrator:** `scripts/collect_stats.py`
* **Test Suite:** `scripts/test_pipeline.py`
* **Workflow:** `.github/workflows/update-stats.yml` (Hourly cron + manual `workflow_dispatch`)
* **Production Data:** `src/data/stats.json` (Git-tracked; committed only when content changes)
* **Development Mock Data:** `src/data/mockStats.json` (Gated behind `import.meta.env.DEV`; never shown in production)

### GitHub Actions Secrets
* **`GITHUB_TOKEN`**: Standard token automatically provided by GitHub Actions runner. Granted `contents: write` permission to push updated telemetry back to the repository.
* No private tokens or credentials should ever be hardcoded into Python scripts or frontend components.

### Resilient Data Rules for AI Agents
1. **Independent Try/Catch:** Every collector in `scripts/collectors/` must remain isolated. If an endpoint (e.g. CodeChef HTML or LeetCode GraphQL) fails or changes structure, it must return `None` and log a warning without raising an uncaught exception.
2. **Last-Known-Good Retention:** `scripts/utils/storage.py` preserves existing valid platform metrics when an update fails, updating status to `'stale'`.
3. **Accept Legitimate Zeroes:** Never reject legitimate 0 values or empty arrays as invalid.
4. **Atomic Writes:** Always write updates through `merge_and_save_atomic()`, which writes to `.tmp` before atomic replacement to prevent partial or corrupted JSON files.

---
*Follow these rules strictly. When in doubt, prioritize correctness, completeness, and documentation integrity over speed.*
