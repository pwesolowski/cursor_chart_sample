# Project Structure Overview

## 📂 Complete File Tree

```
charts-base/
│
├── 📄 Configuration Files
│   ├── package.json              # Project dependencies and scripts
│   ├── vite.config.js            # Vite build configuration
│   ├── .eslintrc.cjs             # ESLint configuration
│   ├── .gitignore                # Git ignore rules
│   └── .dockerignore             # Docker ignore rules
│
├── 🐳 Docker Files
│   ├── Dockerfile                # Multi-stage Docker build
│   ├── docker-compose.yml        # Docker Compose configuration
│   └── nginx.conf                # Nginx server configuration
│
├── 📚 Documentation
│   ├── README.md                 # Complete documentation
│   ├── QUICKSTART.md             # Quick start guide
│   ├── IMPLEMENTATION_NOTES.md   # Technical implementation details
│   └── PROJECT_STRUCTURE.md      # This file
│
├── 🌐 Public Assets
│   └── public/
│       └── data.json             # Data source file
│
├── 🎯 Application Entry
│   └── index.html                # HTML entry point
│
└── ⚛️ React Application
    └── src/
        ├── main.jsx              # React app entry point
        ├── index.css             # Global styles & CSS variables
        │
        ├── 📱 Main App
        │   ├── App.jsx           # Main app component & routing
        │   └── App.css           # App-level styles
        │
        └── 🧩 Components
            └── components/
                │
                ├── 📊 Header
                │   ├── Header.jsx
                │   └── Header.css
                │
                ├── 📈 Dashboard
                │   ├── Dashboard.jsx
                │   └── Dashboard.css
                │
                ├── 📁 Placeholder Tabs
                │   ├── Cases.jsx
                │   ├── Documents.jsx
                │   └── Placeholder.css
                │
                └── 📉 Charts
                    └── charts/
                        ├── RequestsChart.jsx    # Bar chart
                        └── ErrorsChart.jsx      # Area chart
```

## 🎯 Key Files Explained

### Configuration Layer

| File | Purpose | Key Contents |
|------|---------|--------------|
| `package.json` | Dependencies & scripts | React, Recharts, Vite, dev scripts |
| `vite.config.js` | Build configuration | React plugin, dev server settings |
| `.eslintrc.cjs` | Code quality rules | React best practices, hooks rules |

### Docker Layer

| File | Purpose | Technology |
|------|---------|------------|
| `Dockerfile` | Production build | Multi-stage: Node → Nginx |
| `docker-compose.yml` | Container orchestration | Two services: prod & dev |
| `nginx.conf` | Web server config | SPA routing, compression, security |

### Application Layer

| File | Lines | Purpose |
|------|-------|---------|
| `index.html` | ~15 | HTML template |
| `main.jsx` | ~15 | React initialization |
| `index.css` | ~130 | Global styles & theme variables |
| `App.jsx` | ~110 | Main app logic & state |
| `App.css` | ~110 | Tab navigation & layouts |

### Components Layer

| Component | Files | Lines | Purpose |
|-----------|-------|-------|---------|
| **Header** | 2 | ~100 | Logo, branding, app header |
| **Dashboard** | 2 | ~250 | Main dashboard with stats & charts |
| **RequestsChart** | 1 | ~70 | Bar chart for daily requests |
| **ErrorsChart** | 1 | ~150 | Stacked area chart for errors |
| **Cases** | 1 | ~50 | Placeholder for cases section |
| **Documents** | 1 | ~50 | Placeholder for documents section |
| **Placeholder** | 1 | ~150 | Shared styles for placeholders |

## 📊 Code Statistics

```
Total Files: 24
Total Components: 7
Total Lines of Code: ~1,400
  - React Components: ~600 lines
  - Styles (CSS): ~650 lines
  - Configuration: ~150 lines
```

## 🎨 Styling Architecture

```
index.css (Global)
├── CSS Variables (colors, spacing, typography)
├── Reset styles
├── Base element styles
└── Utility classes

↓ Inherited by ↓

App.css
├── Tab navigation
├── Loading states
└── Error states

↓ Used by ↓

Component-Specific CSS
├── Header.css       (header, logo, branding)
├── Dashboard.css    (cards, stats, charts)
└── Placeholder.css  (shared by Cases & Documents)
```

## 🔄 Data Flow Diagram

```
data.json (public/)
    ↓
    │ fetch on mount
    ↓
App.jsx (state)
    ↓
    │ props
    ↓
Dashboard.jsx
    ↓
    ├─→ Statistics (useMemo)
    │
    └─→ Charts
        ├─→ RequestsChart.jsx (data.dailyRequests)
        └─→ ErrorsChart.jsx (data.dailyErrors)
```

## 🧩 Component Dependencies

```
App
├── Header (no props)
├── Cases (no props)
├── Documents (no props)
└── Dashboard (data prop)
    ├── RequestsChart (data prop)
    └── ErrorsChart (data prop)
```

## 🎯 Import Structure

### Main Imports

```javascript
// App.jsx
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Cases from './components/Cases'
import Documents from './components/Documents'

// Dashboard.jsx
import RequestsChart from './charts/RequestsChart'
import ErrorsChart from './charts/ErrorsChart'

// Chart Components
import { BarChart, AreaChart, ... } from 'recharts'
```

## 📦 Package Dependencies

### Production Dependencies
```json
{
  "react": "^18.2.0",           // UI framework
  "react-dom": "^18.2.0",       // DOM rendering
  "recharts": "^2.10.3"         // Chart library
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^4.2.1",  // Vite React plugin
  "vite": "^5.0.8",                   // Build tool
  "eslint": "^8.55.0",                // Code linting
  "eslint-plugin-react": "^7.33.2",  // React linting rules
  "eslint-plugin-react-hooks": "^4.6.0"  // Hooks linting
}
```

## 🎨 CSS Variables Reference

### Colors
```css
--primary-green: #008000
--dark-green: #006400
--light-green: #90EE90
--very-light-green: #E8F5E9
--white: #FFFFFF
--light-gray: #F5F5F5
--gray: #E0E0E0
--dark-gray: #757575
--text-dark: #212121
```

### Spacing
```css
--spacing-xs: 0.5rem   /* 8px */
--spacing-sm: 1rem     /* 16px */
--spacing-md: 1.5rem   /* 24px */
--spacing-lg: 2rem     /* 32px */
--spacing-xl: 3rem     /* 48px */
```

### Typography
```css
--font-size-sm: 0.875rem    /* 14px */
--font-size-base: 1rem      /* 16px */
--font-size-lg: 1.125rem    /* 18px */
--font-size-xl: 1.5rem      /* 24px */
--font-size-2xl: 2rem       /* 32px */
```

## 🔍 Quick File Finder

Need to edit something? Here's where to look:

| What to Change | File to Edit |
|----------------|--------------|
| Logo | `src/components/Header.jsx` |
| App title | `src/components/Header.jsx` |
| Color theme | `src/index.css` (CSS variables) |
| Data source | `public/data.json` |
| Add new tab | `src/App.jsx` |
| Dashboard stats | `src/components/Dashboard.jsx` |
| Chart colors | `src/components/charts/*.jsx` |
| Header style | `src/components/Header.css` |
| Global styles | `src/index.css` |
| Port settings | `vite.config.js`, `docker-compose.yml` |

## 🚀 Build Process

### Development Mode
```
npm run dev
    ↓
Vite dev server starts
    ↓
Hot Module Replacement (HMR) enabled
    ↓
http://localhost:3000
```

### Production Build
```
npm run build
    ↓
Vite compiles & optimizes
    ↓
Output: dist/ folder
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── data.json (copied)
```

### Docker Production
```
docker-compose up
    ↓
Stage 1: Build (Node.js)
    ├── npm ci (install)
    └── npm run build
    ↓
Stage 2: Serve (Nginx)
    ├── Copy dist/ → /usr/share/nginx/html
    └── Start Nginx
    ↓
http://localhost:8080
```

## 🎯 Entry Points

1. **Browser Entry**: `index.html` → loads `main.jsx`
2. **React Entry**: `main.jsx` → renders `App.jsx`
3. **App Entry**: `App.jsx` → renders header, tabs, content
4. **Data Entry**: `App.jsx` useEffect → fetches `data.json`

## 📱 Responsive Breakpoint

```css
/* Desktop (default) */
All CSS rules apply

/* Mobile */
@media (max-width: 768px) {
  /* Mobile-specific overrides */
}
```

Files with mobile styles:
- `index.css`
- `App.css`
- `Header.css`
- `Dashboard.css`
- `Placeholder.css`

## 🔗 External Dependencies

All dependencies are from npm:
- No CDN links
- No external resources required
- Fully self-contained
- Can work offline (after build)

---

This structure provides a clean, maintainable, and scalable foundation for your dashboard application! 🎉

