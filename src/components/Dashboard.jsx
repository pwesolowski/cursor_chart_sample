/**
 * Dashboard Component
 * Main dashboard view displaying charts and statistics
 */
import { useMemo } from 'react'
import RequestsChart from './charts/RequestsChart'
import ErrorsChart from './charts/ErrorsChart'
import './Dashboard.css'

function Dashboard({ data }) {
  /**
   * Format the last import date for display
   */
  const formattedImportDate = useMemo(() => {
    if (!data?.lastImportDate) return 'N/A'
    
    const date = new Date(data.lastImportDate)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }, [data?.lastImportDate])

  /**
   * Calculate summary statistics
   */
  const stats = useMemo(() => {
    if (!data) return null

    // Total requests
    const totalRequests = data.dailyRequests.reduce(
      (sum, day) => sum + day.count, 
      0
    )

    // Total errors
    const totalErrors = data.dailyErrors.reduce((sum, day) => {
      const dayErrors = Object.values(day.errors).reduce((s, count) => s + count, 0)
      return sum + dayErrors
    }, 0)

    // Average requests per day
    const avgRequests = Math.round(totalRequests / data.dailyRequests.length)

    // Most common error type
    const errorCounts = {}
    data.dailyErrors.forEach(day => {
      Object.entries(day.errors).forEach(([type, count]) => {
        errorCounts[type] = (errorCounts[type] || 0) + count
      })
    })
    const mostCommonError = Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]

    return {
      totalRequests,
      totalErrors,
      avgRequests,
      mostCommonError: mostCommonError ? mostCommonError[0] : 'N/A',
      errorRate: ((totalErrors / totalRequests) * 100).toFixed(2)
    }
  }, [data])

  if (!data) {
    return <div>No data available</div>
  }

  return (
    <div className="dashboard">
      {/* Last Import Information */}
      <div className="import-info card">
        <div className="import-info-content">
          <div className="import-info-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3>Last Data Import</h3>
            <p className="import-date">{formattedImportDate}</p>
          </div>
        </div>
      </div>

      {/* Statistics Summary */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-icon requests">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Requests</p>
              <p className="stat-value">{stats.totalRequests.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon errors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Errors</p>
              <p className="stat-value">{stats.totalErrors.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon average">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V13H17V17Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Avg. Daily Requests</p>
              <p className="stat-value">{stats.avgRequests.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon rate">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 19H11V17H13V19ZM15.07 11.25L14.17 12.17C13.45 12.9 13 13.5 13 15H11V14.5C11 13.4 11.45 12.4 12.17 11.67L13.41 10.41C13.78 10.05 14 9.55 14 9C14 7.9 13.1 7 12 7C10.9 7 10 7.9 10 9H8C8 6.79 9.79 5 12 5C14.21 5 16 6.79 16 9C16 9.88 15.64 10.68 15.07 11.25Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Error Rate</p>
              <p className="stat-value">{stats.errorRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="charts-container">
        {/* Daily Requests Chart */}
        <div className="chart-wrapper card">
          <h2 className="chart-title">Daily Requests</h2>
          <p className="chart-subtitle">Total number of requests per day</p>
          <RequestsChart data={data.dailyRequests} />
        </div>

        {/* Daily Errors Chart */}
        <div className="chart-wrapper card">
          <h2 className="chart-title">Daily Errors by Type</h2>
          <p className="chart-subtitle">Error distribution across different error types</p>
          <ErrorsChart data={data.dailyErrors} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

