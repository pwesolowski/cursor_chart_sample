/**
 * Cases Component
 * Placeholder component for the Cases section
 * This can be expanded with actual case management functionality
 */
import './Placeholder.css'

function Cases() {
  return (
    <div className="placeholder-container">
      <div className="placeholder-card card">
        <div className="placeholder-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6ZM20 18H4V6H9.17L11.17 8H20V18ZM6 12H18V14H6V12ZM6 15H14V17H6V15Z" fill="currentColor"/>
          </svg>
        </div>
        
        <h2 className="placeholder-title">2 Cases</h2>
        <p className="placeholder-description">
          This section will contain case management features. Here you can:
        </p>
        
        <ul className="placeholder-features">
          <li>View all active cases</li>
          <li>Track case status and progress</li>
          <li>Assign cases to team members</li>
          <li>Add notes and attachments</li>
          <li>Generate case reports</li>
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

export default Cases

