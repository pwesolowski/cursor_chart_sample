/**
 * Main App Component
 * Manages application state and navigation between tabs
 */
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Cases from './components/Cases'
import Documents from './components/Documents'
import './App.css'

function App() {
  // State for currently active tab
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // State for dashboard data loaded from data.json
  const [data, setData] = useState(null)
  
  // State for loading status
  const [loading, setLoading] = useState(true)
  
  // State for error handling
  const [error, setError] = useState(null)

  /**
   * Load data from data.json on component mount
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/data.json')
        
        if (!response.ok) {
          throw new Error('Failed to load data')
        }
        
        const jsonData = await response.json()
        setData(jsonData)
        setError(null)
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  /**
   * Render the appropriate tab content based on activeTab state
   */
  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )
    }

    if (error) {
      return (
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
        </div>
      )
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} />
      case 'cases':
        return <Cases />
      case 'documents':
        return <Documents />
      default:
        return <Dashboard data={data} />
    }
  }

  return (
    <div className="app">
      {/* Header with logo and navigation */}
      <Header />
      
      {/* Tab Navigation */}
      <nav className="tabs-navigation">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`tab ${activeTab === 'cases' ? 'active' : ''}`}
              onClick={() => setActiveTab('cases')}
            >
              2 Cases
            </button>
            <button
              className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              3 Documents
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          {renderTabContent()}
        </div>
      </main>
    </div>
  )
}

export default App

