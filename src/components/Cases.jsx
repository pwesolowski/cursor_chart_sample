/**
 * Cases Component
 * Displays Klasse data visualizations from sagKlasseReport.xlsx
 * Shows grouped data by Ejende myndighed, Master IT-systemNavn, KleEmne, and Fremdrift
 */
import { useState, useEffect } from 'react'
import KlasseBarChart from './charts/KlasseBarChart'
import KlassePieChart from './charts/KlassePieChart'
import KlasseTreemap from './charts/KlasseTreemap'
import './Dashboard.css'

function Cases() {
  const [klasseData, setKlasseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Load klasse data from klasseData.json on component mount
   */
  useEffect(() => {
    const loadKlasseData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/klasseData.json')
        
        if (!response.ok) {
          throw new Error('Failed to load klasse data')
        }
        
        const jsonData = await response.json()
        setKlasseData(jsonData)
        setError(null)
      } catch (err) {
        console.error('Error loading klasse data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadKlasseData()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading klasse data...</p>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Data</h2>
        <p>{error}</p>
        <p className="error-hint">
          Make sure the data has been processed by running: <code>npm run prebuild</code>
        </p>
      </div>
    )
  }

  // No data state
  if (!klasseData) {
    return (
      <div className="error-container">
        <h2>No Data Available</h2>
        <p>Klasse data has not been generated yet.</p>
      </div>
    )
  }

  const { metadata, ejendeMyndighed, masterITSystemNavn, kleEmne, fremdrift } = klasseData

  return (
    <div className="cases-view">
      {/* Header Section with Statistics */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Klasse Data Overview</h1>
          <p className="header-subtitle">
            Analysis of {metadata?.totalRecords?.toLocaleString()} records from {metadata?.sourceFile}
          </p>
          {metadata?.processedAt && (
            <p className="header-date">
              Last updated: {new Date(metadata.processedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Summary Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#3b82f6"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Total Records</div>
            <div className="stat-value">{metadata?.totalRecords?.toLocaleString()}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#10b981"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Authorities</div>
            <div className="stat-value">{ejendeMyndighed?.length || 0}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#f59e0b"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">IT Systems</div>
            <div className="stat-value">{masterITSystemNavn?.length || 0}</div>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H7V13H9V11ZM13 11H11V13H13V11ZM17 11H15V13H17V11ZM19 4H18V2H16V4H8V2H6V4H5C3.89 4 3.01 4.9 3.01 6L3 20C3 21.1 3.89 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4Z" fill="#8b5cf6"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-label">Progress States</div>
            <div className="stat-value">{fremdrift?.length || 0}</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Row 1: Two Bar Charts */}
        <div className="charts-row">
          <div className="chart-wrapper card">
            <KlasseBarChart
              data={ejendeMyndighed}
              title="Top 10 Authorities (Ejende myndighed)"
              color="#3b82f6"
            />
          </div>
          <div className="chart-wrapper card">
            <KlasseBarChart
              data={masterITSystemNavn}
              title="Top 10 IT Systems (Master IT-systemNavn)"
              color="#10b981"
            />
          </div>
        </div>

        {/* Row 2: Pie Chart and Additional Info */}
        <div className="charts-row">
          <div className="chart-wrapper card">
            <KlassePieChart
              data={fremdrift}
              title="Progress Distribution (Fremdrift)"
            />
          </div>
          <div className="chart-wrapper card info-panel">
            <h3>Data Breakdown</h3>
            <div className="info-list">
              <div className="info-item">
                <strong>Ejende myndighed:</strong>
                <p>Municipal authorities responsible for the cases</p>
                <span className="info-count">
                  {ejendeMyndighed?.length} unique authorities
                </span>
              </div>
              <div className="info-item">
                <strong>Master IT-systemNavn:</strong>
                <p>Primary IT systems managing the cases</p>
                <span className="info-count">
                  {masterITSystemNavn?.length} unique systems
                </span>
              </div>
              <div className="info-item">
                <strong>Fremdrift:</strong>
                <p>Current progress status of cases</p>
                <span className="info-count">
                  {fremdrift?.length} status categories
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Treemap (Full Width) */}
        <div className="charts-row">
          <div className="chart-wrapper card full-width">
            <KlasseTreemap
              data={kleEmne}
              title="Classification Hierarchy (KleEmne)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cases
