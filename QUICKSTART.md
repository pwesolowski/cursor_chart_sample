# Quick Start Guide

Get your Charts Dashboard up and running in minutes!

## 🚀 Fastest Way to Start

### Local Development (Recommended for Development)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser to http://localhost:3000
```

That's it! The app is now running with hot reload enabled.

## 🐳 Using Docker (Recommended for Production)

### Production Mode

```bash
# Start the application
docker-compose up -d

# Open your browser to http://localhost:8080
```

### Development Mode with Docker

```bash
# Start development container
docker-compose --profile dev up dashboard-dev

# Open your browser to http://localhost:3000
```

## 📊 Using Your Own Data

1. Edit `public/data.json`
2. Update the data following this structure:

```json
{
  "lastImportDate": "2025-11-27T10:30:00Z",
  "dailyRequests": [
    { "date": "2025-11-20", "count": 1250 }
  ],
  "dailyErrors": [
    {
      "date": "2025-11-20",
      "errors": {
        "404 Not Found": 45,
        "500 Server Error": 12
      }
    }
  ]
}
```

3. Save and reload the page

## 🎨 Customize the Logo

Edit `src/components/Header.jsx` and replace the SVG in the `logo-placeholder` div:

```jsx
<div className="logo-placeholder">
  <img src="/your-logo.png" alt="Logo" width="40" height="40" />
</div>
```

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

## 🛠️ Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Check code quality |
| `docker-compose up -d` | Start Docker (production) |
| `docker-compose down` | Stop Docker |

## ❓ Need Help?

Check out the full [README.md](README.md) for:
- Detailed documentation
- Troubleshooting guide
- Advanced configuration
- Architecture details

## 🎯 What's Included?

✅ React 18 with Vite  
✅ Recharts for beautiful charts  
✅ Green & white themed UI  
✅ Responsive design  
✅ Docker support  
✅ Example data included  
✅ Tab navigation  
✅ Statistics dashboard  

Enjoy building with Charts Dashboard! 🎉

