import { useState, useEffect } from 'react'
import './App.css'
import DataLoader from './components/DataLoader'
import Dashboard from './components/Dashboard'
import CategoryPage from './components/CategoryPage'
import PictureComparison from './components/PictureComparison'
import { calculatePercentageToGoal, calculateComplianceScore } from './utils/calculations'

function App() {
  const [testsData, setTestsData] = useState(null)
  const [resultsData, setResultsData] = useState(null)
  const [currentPage, setCurrentPage] = useState('loader') // loader, dashboard, category, pictures
  const [selectedCategory, setSelectedCategory] = useState(null)

  useEffect(() => {
    // Load tests.json on app start
    fetch('/data/tests.json')
      .then(response => response.json())
      .then(data => setTestsData(data))
      .catch(error => console.error('Error loading tests.json:', error))
  }, [])

  const handleDataLoaded = (results) => {
    setResultsData(results)
    setCurrentPage('dashboard')
  }

  const handleViewCategory = (categoryId) => {
    setSelectedCategory(categoryId)
    setCurrentPage('category')
  }

  const handleViewPictures = () => {
    setCurrentPage('pictures')
  }

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard')
  }

  const handleBackToLoader = () => {
    setCurrentPage('loader')
    setResultsData(null)
    setSelectedCategory(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏋️ Health Display</h1>
        <p className="subtitle">Physical Fitness Assessment Dashboard</p>
      </header>

      <nav className="app-nav">
        {resultsData && (
          <>
            <button
              className={`nav-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={handleBackToDashboard}
            >
              Dashboard
            </button>
            <button
              className={`nav-btn ${currentPage === 'pictures' ? 'active' : ''}`}
              onClick={handleViewPictures}
            >
              Picture Comparison
            </button>
            <button
              className="nav-btn logout-btn"
              onClick={handleBackToLoader}
            >
              Load New Results
            </button>
          </>
        )}
      </nav>

      <main className="app-main">
        {currentPage === 'loader' && (
          <DataLoader onDataLoaded={handleDataLoaded} />
        )}
        
        {currentPage === 'dashboard' && resultsData && testsData && (
          <Dashboard
            results={resultsData}
            tests={testsData}
            onCategoryClick={handleViewCategory}
          />
        )}

        {currentPage === 'category' && selectedCategory && resultsData && testsData && (
          <CategoryPage
            categoryId={selectedCategory}
            results={resultsData}
            tests={testsData}
            onBack={handleBackToDashboard}
          />
        )}

        {currentPage === 'pictures' && (
          <PictureComparison />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Health Display | All calculations performed locally | No data is saved</p>
      </footer>
    </div>
  )
}

export default App
