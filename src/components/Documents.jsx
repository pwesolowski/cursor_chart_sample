/**
 * Documents Component
 * Placeholder component for the Documents section
 * This can be expanded with actual document management functionality
 */
import './Placeholder.css'

function Documents() {
  return (
    <div className="placeholder-container">
      <div className="placeholder-card card">
        <div className="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 15.01L9.41 16.42L11 14.84V19H13V14.84L14.59 16.43L16 15.01L12.01 11L8 15.01Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className="placeholder-title">3 Documents</h2>
        <p className="placeholder-description">
          This section will contain document management features. Here you can:
        </p>
        
        <ul className="placeholder-features">
          <li>Upload and organize documents</li>
          <li>Search through document library</li>
          <li>Share documents with team members</li>
          <li>Version control and history</li>
          <li>Export documents in various formats</li>
        </ul>
        
        <div className="placeholder-action">
          <button className="btn btn-primary" disabled>
            Coming Soon
          </button>
        </div>
        
        <div className="placeholder-footer">
          <p>This is a placeholder. Content will be added in future updates.</p>
        </div>
      </div>
    </div>
  )
}

export default Documents

