import { useState, useEffect } from 'react'
import './TestResultsForm.css'
import testsData from '../../data/tests.json'
import { evaluateGoalFormula, calculatePercentageToGoal, getColorForPercentage } from '../utils/calculations'

function TestResultsForm({ onBack }) {
  const STORAGE_KEY = 'healthDisplayFormData'
  
  const [userData, setUserData] = useState({
    name: '',
    gender: 'male',
    age: '',
    bodyweight: '',
    bodyweightUnit: 'lbs'
  })

  const [testResults, setTestResults] = useState({})
  const [expandedCategories, setExpandedCategories] = useState({})
  const [errors, setErrors] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setUserData(parsed.userData || userData)
        setTestResults(parsed.testResults || {})
        setExpandedCategories(parsed.expandedCategories || { [testsData.categories[0].id]: true })
      } catch (e) {
        console.error('Error loading saved data:', e)
        setExpandedCategories({ [testsData.categories[0].id]: true })
      }
    } else {
      setExpandedCategories({ [testsData.categories[0].id]: true })
    }
  }, [])

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      userData,
      testResults,
      expandedCategories
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [userData, testResults, expandedCategories])

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleTestResultChange = (testId, field, value) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [field]: value
      }
    }))
  }

  const handleToggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const togglePreview = () => {
    if (!showPreview) {
      const errors = validateForm()
      if (errors.length > 0) {
        setValidationErrors(errors)
        return
      }
    }
    setShowPreview(!showPreview)
  }

  const validateForm = () => {
    const newErrors = []
    const newFieldErrors = {}

    // Validate required user data
    if (!userData.name || userData.name.trim() === '') {
      newErrors.push('Name is required')
      newFieldErrors.name = 'Required'
    }

    if (!userData.gender) {
      newErrors.push('Gender is required')
      newFieldErrors.gender = 'Required'
    }

    if (userData.age === '' || userData.age === null) {
      newErrors.push('Age is required')
      newFieldErrors.age = 'Required'
    } else {
      const age = parseInt(userData.age)
      if (isNaN(age) || age < 0 || age > 150) {
        newErrors.push('Age must be between 0 and 150')
        newFieldErrors.age = 'Invalid'
      }
    }

    if (userData.bodyweight === '' || userData.bodyweight === null) {
      newErrors.push('Bodyweight is required')
      newFieldErrors.bodyweight = 'Required'
    } else {
      const weight = parseFloat(userData.bodyweight)
      if (isNaN(weight) || weight <= 0) {
        newErrors.push('Bodyweight must be greater than 0')
        newFieldErrors.bodyweight = 'Invalid'
      }
    }

    // Check if at least one test result is filled
    const filledTests = Object.values(testResults).filter(result => result.value && result.value !== '')
    if (filledTests.length === 0) {
      newErrors.push('Please enter at least one test result')
    }

    setErrors(newFieldErrors)
    return newErrors
  }

  const generateJSON = () => {
    const today = new Date().toISOString().split('T')[0]
    
    // Build results array - only include tests with values
    const results = []
    for (const category of testsData.categories) {
      for (const test of category.tests) {
        if (testResults[test.id] && testResults[test.id].value) {
          results.push({
            testId: test.id,
            categoryId: category.id,
            testName: test.name,
            value: parseFloat(testResults[test.id].value) || 0,
            unit: test.unit,
            notes: testResults[test.id].notes || ''
          })
        }
      }
    }

    return {
      metadata: {
        version: '1.0',
        createdDate: today,
        testDate: today
      },
      user: {
        name: userData.name,
        gender: userData.gender,
        age: parseInt(userData.age),
        bodyweight: parseFloat(userData.bodyweight),
        bodyweightUnit: userData.bodyweightUnit
      },
      results: results
    }
  }

  const handleDownload = () => {
    const jsonData = generateJSON()
    const jsonString = JSON.stringify(jsonData, null, 2)
    
    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `fitness-results-${userData.name.replace(/\s+/g, '-')}-${today}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleCopyJSON = () => {
    const jsonData = generateJSON()
    const jsonString = JSON.stringify(jsonData, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSON copied to clipboard!')
    })
  }

  const handleLoadExample = (gender) => {
    if (gender === 'male') {
      setUserData({
        name: 'John Doe',
        gender: 'male',
        age: '35',
        bodyweight: '185',
        bodyweightUnit: 'lbs'
      })
    } else {
      setUserData({
        name: 'Sarah Johnson',
        gender: 'female',
        age: '32',
        bodyweight: '145',
        bodyweightUnit: 'lbs'
      })
    }

    // Load some example results
    const exampleResults = {
      strength_001: { value: gender === 'male' ? '295' : '185', notes: '' },
      strength_002: { value: gender === 'male' ? '185' : '110', notes: '' },
      endurance_001: { value: gender === 'male' ? '50' : '45', notes: '' },
      stamina_001: { value: gender === 'male' ? '45' : '32', notes: '' }
    }
    setTestResults(exampleResults)
  }

  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data?')) {
      setUserData({
        name: '',
        gender: 'male',
        age: '',
        bodyweight: '',
        bodyweightUnit: 'lbs'
      })
      setTestResults({})
      setErrors({})
      setValidationErrors([])
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  const getGoalForTest = (test) => {
    const formula = test.goalFormula[userData.gender?.toLowerCase() || 'male']
    return evaluateGoalFormula(formula, parseInt(userData.age) || 0, parseFloat(userData.bodyweight) || 0)
  }

  const getPercentageForTest = (test) => {
    const value = testResults[test.id]?.value
    if (!value) return 0
    const goal = getGoalForTest(test)
    return calculatePercentageToGoal(parseFloat(value), goal, test.measurementType)
  }

  const filledTestsCount = Object.values(testResults).filter(r => r.value && r.value !== '').length
  const totalTests = testsData.categories.reduce((sum, cat) => sum + cat.tests.length, 0)

  if (showPreview) {
    const jsonData = generateJSON()
    return (
      <div className="form-preview-modal">
        <div className="preview-content">
          <h2>JSON Preview</h2>
          <pre className="json-display">{JSON.stringify(jsonData, null, 2)}</pre>
          <div className="preview-actions">
            <button className="btn btn-primary" onClick={handleCopyJSON}>
              📋 Copy JSON
            </button>
            <button className="btn btn-success" onClick={handleDownload}>
              ⬇️ Download File
            </button>
            <button className="btn btn-secondary" onClick={togglePreview}>
              ← Back to Form
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="test-results-form">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <h2>📝 Create Test Results</h2>
            <p className="progress-indicator">
              {filledTestsCount} of {totalTests} tests completed
            </p>
          </div>
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="btn btn-small" onClick={() => handleLoadExample('male')}>
            📋 Load Example (Male)
          </button>
          <button className="btn btn-small" onClick={() => handleLoadExample('female')}>
            📋 Load Example (Female)
          </button>
          <button className="btn btn-small btn-danger" onClick={handleResetForm}>
            🔄 Reset Form
          </button>
        </div>

        {/* User Info Section */}
        <div className="form-section user-info-section">
          <h3>👤 Your Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleUserDataChange('name', e.target.value)}
                placeholder="Enter your name"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                value={userData.gender}
                onChange={(e) => handleUserDataChange('gender', e.target.value)}
                className={errors.gender ? 'input-error' : ''}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => handleUserDataChange('age', e.target.value)}
                placeholder="e.g., 35"
                className={errors.age ? 'input-error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label>Bodyweight *</label>
              <div className="bodyweight-input">
                <input
                  type="number"
                  value={userData.bodyweight}
                  onChange={(e) => handleUserDataChange('bodyweight', e.target.value)}
                  placeholder="e.g., 185"
                  step="0.1"
                  className={errors.bodyweight ? 'input-error' : ''}
                />
                <select
                  value={userData.bodyweightUnit}
                  onChange={(e) => handleUserDataChange('bodyweightUnit', e.target.value)}
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              {errors.bodyweight && <span className="error-message">{errors.bodyweight}</span>}
            </div>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="validation-errors">
            <p className="error-title">❌ Validation Errors:</p>
            <ul>
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Test Results Section */}
        <div className="form-section tests-section">
          <h3>🏃 Test Results</h3>
          <p className="section-subtitle">Enter your test results. Blank fields will default to 0. Goals are calculated based on your information.</p>

          {testsData.categories.map(category => (
            <div key={category.id} className="category-section">
              <div
                className={`category-header ${expandedCategories[category.id] ? 'expanded' : ''}`}
                onClick={() => handleToggleCategory(category.id)}
              >
                <span className="category-toggle">
                  {expandedCategories[category.id] ? '▼' : '▶'}
                </span>
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <p className="category-count">{category.tests.length} tests</p>
                </div>
              </div>

              {expandedCategories[category.id] && (
                <div className="category-tests">
                  {category.tests.map(test => {
                    const goal = getGoalForTest(test)
                    const percentage = getPercentageForTest(test)
                    const goalColor = getColorForPercentage(percentage)
                    const testValue = testResults[test.id]?.value || ''

                    return (
                      <div key={test.id} className="test-row">
                        <div className="test-info">
                          <div className="test-header">
                            <h5 className="test-name" title={test.description}>
                              {test.name}
                              {test.videoUrl && (
                                <a href={test.videoUrl} target="_blank" rel="noopener noreferrer" className="video-link" title="Watch tutorial">
                                  🎥
                                </a>
                              )}
                            </h5>
                            <span className="test-unit">{test.unit}</span>
                          </div>
                          <p className="test-description">{test.description}</p>
                        </div>

                        <div className="test-inputs">
                          <div className="input-group">
                            <input
                              type="number"
                              step="0.1"
                              value={testValue}
                              onChange={(e) => handleTestResultChange(test.id, 'value', e.target.value)}
                              placeholder="Result"
                              className="test-input"
                            />
                            <span className="goal-display" style={{ color: goalColor }}>
                              Goal: {goal !== null ? goal.toFixed(1) : 'N/A'}
                            </span>
                            {testValue && (
                              <span className="percentage-display" style={{ color: goalColor }}>
                                {percentage.toFixed(0)}%
                              </span>
                            )}
                          </div>

                          <textarea
                            value={testResults[test.id]?.notes || ''}
                            onChange={(e) => handleTestResultChange(test.id, 'notes', e.target.value)}
                            placeholder="Notes (optional)"
                            className="test-notes"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            ← Cancel
          </button>
          <button className="btn btn-primary" onClick={togglePreview}>
            👁️ Preview JSON
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestResultsForm
