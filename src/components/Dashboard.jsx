/**
 * Dashboard Component
 * Main dashboard view displaying service call analytics from CSV data
 * Uses real data from KOSDY-PROD.*.csv files
 */
import { useMemo, useState, useEffect } from 'react'
import ServiceHourlyChart from './charts/ServiceHourlyChart'
import ServiceBarChart from './charts/ServiceBarChart'
import ServicePieChart from './charts/ServicePieChart'
import DateSelector from './DateSelector'
import './Dashboard.css'

function Dashboard() {
  // State for service data
  const [serviceData, setServiceData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [serviceLoading, setServiceLoading] = useState(true)

  /**
   * Load service data from serviceData.json
   */
  useEffect(() => {
    const loadServiceData = async () => {
      try {
        setServiceLoading(true)
        const response = await fetch('/serviceData.json')
        
        if (response.ok) {
          const jsonData = await response.json()
          setServiceData(jsonData)
          // Set the first available date as default
          if (jsonData.dates && jsonData.dates.length > 0) {
            setSelectedDate(jsonData.dates[jsonData.dates.length - 1]) // Most recent date
          }
        } else {
          console.log('No service data available')
        }
      } catch (err) {
        console.log('Service data not available:', err.message)
      } finally {
        setServiceLoading(false)
      }
    }

    loadServiceData()
  }, [])

  // Get data for selected date
  const currentServiceData = useMemo(() => {
    if (!serviceData || !selectedDate || !serviceData.data[selectedDate]) {
      return null
    }
    return serviceData.data[selectedDate]
  }, [serviceData, selectedDate])

  return (
    <div className="dashboard">
      {/* Last Import Information - Service Data */}
      {serviceData && serviceData.metadata && (
        <div className="import-info-banner">
          <div className="import-info-content">
            <div className="import-info-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="white"/>
              </svg>
            </div>
            <div>
              <h3 style={{ color: 'white', margin: '0 0 4px 0' }}>Last Data Import</h3>
              <p style={{ color: '#90EE90', margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
                {new Date(serviceData.metadata.processedAt).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Service Analytics Section */}
      {serviceData && serviceData.dates.length > 0 ? (
        <div className="service-analytics-section">
          <div className="section-header">
            <h2 className="section-title">Service Call Analytics</h2>
            <DateSelector 
              dates={serviceData.dates}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {currentServiceData && (
            <>
              {/* Service Statistics Summary */}
              <div className="stats-grid">
                <div className="stat-card card">
                  <div className="stat-icon" style={{ backgroundColor: '#d1fae5' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L19.71 9.71L22 12V6H16Z" fill="#10b981"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Total Service Calls</p>
                    <p className="stat-value">{currentServiceData.totalCalls.toLocaleString()}</p>
                  </div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6H12L10 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8C22 6.9 21.1 6 20 6Z" fill="#3b82f6"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Unique IT Systems</p>
                    <p className="stat-value">{currentServiceData.uniqueITSystems}</p>
                  </div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#f59e0b"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Peak Hour</p>
                    <p className="stat-value">{currentServiceData.mostActiveHour}</p>
                  </div>
                </div>

                <div className="stat-card card">
                  <div className="stat-icon" style={{ backgroundColor: '#e0e7ff' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="#8b5cf6"/>
                    </svg>
                  </div>
                  <div className="stat-content">
                    <p className="stat-label">Unique Operations</p>
                    <p className="stat-value">{currentServiceData.uniqueOperations}</p>
                  </div>
                </div>
              </div>

              {/* Service Charts */}
              <div className="charts-container">
                {/* Hourly Chart */}
                <div className="chart-wrapper card">
                  <ServiceHourlyChart 
                    data={currentServiceData.hourly}
                    title="Hourly Call Volume"
                  />
                </div>

                {/* Support Systems Distribution */}
                <div className="chart-wrapper card">
                  <ServicePieChart 
                    data={currentServiceData.supportSystems}
                    title="Support System Distribution"
                  />
                </div>

                {/* Top IT Systems */}
                <div className="chart-wrapper card">
                  <ServiceBarChart 
                    data={currentServiceData.topITSystems}
                    title="Top 10 IT Systems"
                    color="#10b981"
                    maxItems={10}
                  />
                </div>

                {/* Top Services */}
                <div className="chart-wrapper card">
                  <ServiceBarChart 
                    data={currentServiceData.topServices}
                    title="Top 10 Services"
                    color="#3b82f6"
                    maxItems={10}
                  />
                </div>

                {/* Top Operations */}
                <div className="chart-wrapper card">
                  <ServiceBarChart 
                    data={currentServiceData.topOperations}
                    title="Top 10 Operations"
                    color="#f59e0b"
                    maxItems={10}
                  />
                </div>

                {/* Service Versions */}
                <div className="chart-wrapper card">
                  <ServiceBarChart 
                    data={currentServiceData.serviceVersions}
                    title="Service Versions"
                    nameKey="version"
                    color="#8b5cf6"
                    maxItems={10}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="no-service-data">
          <div className="no-data-card card">
            <div className="no-data-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z" fill="#10b981"/>
              </svg>
            </div>
            <h2>No Service Data Available</h2>
            <p>Add CSV files to the <code>data/</code> directory with pattern:</p>
            <p><code>KOSDY-PROD.YYYYMMDD.csv</code></p>
            <p>Then run: <code>npm run build</code> or <code>docker-compose up -d --build</code></p>
          </div>
        </div>
      )}

      {serviceLoading && (
        <div className="service-loading">
          <div className="spinner"></div>
          <p>Loading service analytics...</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard

