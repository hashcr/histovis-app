# HistoVis App

> Frontend application for HistoVis — a medical image analysis platform for whole slide image (WSI) processing.
> Built as part of an academic thesis project.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
![Status: Mostly Complete](https://img.shields.io/badge/status-mostly%20complete-green)

---

## Overview

HistoVis App is the mobile and desktop frontend for the HistoVis platform. It allows users to upload and manage whole slide images, configure and trigger AI analysis jobs via a plugin system, and review results — all from a responsive Ionic/Angular interface.

**Key features:**
- Whole slide image viewer and management
- Plugin-driven AI analysis panel (H&E, IHC, LLM, Segmentation)
- Job submission and real-time status tracking
- Analysis history per image
- Responsive layout — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Ionic 7 + Angular |
| State management | NgRx Signal Store + BehaviorSubject |
| UI components | Ionic components (`ion-modal`, `ion-segment`, `ion-fab`, etc.) |
| HTTP client | Angular `HttpClient` |
| Styling | SCSS + Ionic CSS variables |

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Ionic CLI: `npm install -g @ionic/cli`
- HistoVis backend services running (see [histovis-monorepo](#related-repositories))

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/hashcr/histovis-app.git
cd histovis-app

# Install dependencies
npm install

# Run in browser
ionic serve

# Run on mobile (Android)
ionic capacitor run android

# Build for production
ionic build --prod
```

---

## Environment Configuration

Create a `src/environments/environment.ts` file based on the example:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080',  // API Gateway URL
};
```

---

## Related Repositories

| Repo | Description |
|---|---|
| [histovis-monorepo](https://github.com/hashcr/histovis-monorepo) | Java Spring Boot backend (analysis-service, API gateway) |
| [histovis-ai](https://github.com/hashcr/histovis-ai) | Python AI workers (StarDist, LLM consumers) |

---

## License

This project is licensed under **CC BY-NC 4.0**.
See the [LICENSE](../LICENSE) file for details.

Commercial use requires written permission from the author.

---

## Author

**Ashuin Sharma**
📧 ashuin.sharma@gmail.com
