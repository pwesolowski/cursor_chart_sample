/**
 * Header Component
 * Displays application header with placeholder logo
 */
import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Placeholder logo - user can replace this */}
          <div className="logo">
            <div className="logo-placeholder">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#008000"/>
                <path d="M20 10L28 16V24L20 30L12 24V16L20 10Z" fill="white"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>Charts Dashboard</h1>
              <p className="logo-subtitle">Data Analytics Platform</p>
            </div>
          </div>

          {/* Optional: Additional header items can be added here */}
          <div className="header-actions">
            {/* Placeholder for future actions like user menu, notifications, etc. */}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

