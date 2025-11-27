# Charts Dashboard - React Data Visualization Application

A modern, interactive React dashboard application for visualizing request and error data with beautiful charts. Built with React, Recharts, and Docker support.

![Dashboard Screenshot](app_screenshot.png)

## 🎨 Features

- **Green & White Theme**: Clean, professional design using green (#008000) as the primary color
- **Interactive Charts**: 
  - Daily requests count visualization (Bar Chart)
  - Daily errors by type visualization (Stacked Area Chart)
- **Real-time Data Loading**: Dynamically loads data from local JSON file
- **Last Import Tracking**: Prominently displays the last data import timestamp
- **Tab Navigation**: Organized interface with Dashboard, Cases, and Documents sections
- **Responsive Design**: Fully responsive layout that works on all devices
- **Docker Support**: Easy deployment with Docker and docker-compose
- **Statistics Dashboard**: Key metrics including total requests, errors, averages, and error rates

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Docker** (optional, for containerized deployment)
- **Docker Compose** (optional, for containerized deployment)

## 🚀 Quick Start

### Option 1: Local Development (without Docker)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   
   Navigate to `http://localhost:3000`

### Option 2: Production Build (without Docker)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build for Production**
   ```bash
   npm run build
   ```

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Option 3: Docker Deployment (Production)

1. **Build and Start Container**
   ```bash
   docker-compose up -d
   ```

2. **Open Browser**
   
   Navigate to `http://localhost:8080`

3. **Stop Container**
   ```bash
   docker-compose down
   ```

### Option 4: Docker Development Mode

1. **Start Development Container**
   ```bash
   docker-compose --profile dev up dashboard-dev
   ```

2. **Open Browser**
   
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
charts-base/
├── public/
│   └── data.json              # Data source file
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── RequestsChart.jsx   # Bar chart for daily requests
│   │   │   └── ErrorsChart.jsx     # Area chart for errors by type
│   │   ├── Header.jsx              # Application header
│   │   ├── Header.css
│   │   ├── Dashboard.jsx           # Main dashboard component
│   │   ├── Dashboard.css
│   │   ├── Cases.jsx               # Cases section (placeholder)
│   │   ├── Documents.jsx           # Documents section (placeholder)
│   │   └── Placeholder.css
│   ├── App.jsx                # Main application component
│   ├── App.css
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── Dockerfile                 # Docker configuration
├── docker-compose.yml         # Docker Compose configuration
├── nginx.conf                 # Nginx configuration for production
├── vite.config.js             # Vite build configuration
├── package.json               # Project dependencies
└── README.md                  # This file
```

## 📊 Data Format

The application loads data from `public/data.json`. Here's the expected structure:

```json
{
  "lastImportDate": "2025-11-27T10:30:00Z",
  "dailyRequests": [
    { "date": "2025-11-20", "count": 1250 },
    { "date": "2025-11-21", "count": 1480 }
  ],
  "dailyErrors": [
    {
      "date": "2025-11-20",
      "errors": {
        "404 Not Found": 45,
        "500 Server Error": 12,
        "403 Forbidden": 8,
        "401 Unauthorized": 15
      }
    }
  ]
}
```

### Modifying Data

To use your own data:

1. Edit `public/data.json` with your data
2. Ensure the structure matches the format above
3. Update `lastImportDate` with the current timestamp
4. The application will automatically reload and display your data

## 🎨 Customizing the Logo

The header contains a placeholder logo. To replace it:

1. Open `src/components/Header.jsx`
2. Find the `logo-placeholder` div
3. Replace the SVG with your own logo:

```jsx
<div className="logo-placeholder">
  <img src="/your-logo.png" alt="Logo" width="40" height="40" />
</div>
```

Or update the SVG to match your branding.

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## 🐳 Docker Commands

### Production Mode
```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop and remove
docker-compose down

# Rebuild after changes
docker-compose up -d --build
```

### Development Mode
```bash
# Start dev container
docker-compose --profile dev up dashboard-dev

# Stop dev container
docker-compose --profile dev down
```

## 🎯 Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Chart Library**: Recharts 2.10+
- **Styling**: Custom CSS with CSS Variables
- **Production Server**: Nginx (in Docker)
- **Container**: Docker & Docker Compose

## 📈 Chart Libraries Used

This project uses **Recharts**, a free and open-source charting library for React:

- **License**: MIT License
- **Features**: Composable, declarative, responsive charts
- **Charts Used**:
  - Bar Chart (for daily requests)
  - Stacked Area Chart (for errors by type)

## 🎨 Color Theme

The application uses a green and white color scheme:

- **Primary Green**: `#008000`
- **Dark Green**: `#006400`
- **Light Green**: `#90EE90`
- **Very Light Green**: `#E8F5E9`
- **White**: `#FFFFFF`

All colors are defined as CSS variables in `src/index.css` and can be easily customized.

## 🔧 Configuration

### Vite Configuration

The Vite configuration (`vite.config.js`) is set up for:
- React fast refresh
- Docker compatibility (host: 0.0.0.0)
- Hot module replacement with polling

### Nginx Configuration

For production Docker builds, Nginx is configured with:
- SPA routing support
- Gzip compression
- Static asset caching
- Security headers

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1400px+)
- Tablet (768px - 1399px)
- Mobile (< 768px)

## 🔐 Security Features

- X-Frame-Options header
- X-Content-Type-Options header
- X-XSS-Protection header
- Content Security via Nginx

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 8080 is already in use:

**For local development:**
```bash
# Edit vite.config.js and change the port
server: {
  port: 3001  // Change to available port
}
```

**For Docker:**
```bash
# Edit docker-compose.yml ports section
ports:
  - "8081:80"  # Change 8081 to available port
```

### Data Not Loading

1. Verify `public/data.json` exists
2. Check browser console for errors
3. Ensure JSON format is valid
4. Check file permissions

### Docker Build Fails

1. Ensure Docker is running
2. Clear Docker cache: `docker system prune -a`
3. Rebuild: `docker-compose up --build`

## 📝 Future Enhancements

The following features can be added:

- **Cases Section**: Full case management system
- **Documents Section**: Document upload and management
- **Real-time Updates**: WebSocket support for live data
- **Export Features**: CSV/PDF export of charts
- **Date Range Filters**: Filter data by custom date ranges
- **User Authentication**: Login and user management
- **API Integration**: Connect to backend APIs
- **More Chart Types**: Pie charts, line charts, etc.

## 🤝 Contributing

This is a template project. Feel free to:
- Add new features
- Improve styling
- Add more chart types
- Enhance documentation

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Created as a modern React dashboard template with Docker support.

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the data format requirements
3. Verify all dependencies are installed
4. Check Docker logs: `docker-compose logs`

---

**Happy Coding! 🚀**

