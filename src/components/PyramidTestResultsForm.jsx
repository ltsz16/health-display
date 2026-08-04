import { useState, useEffect } from 'react'
import './PyramidTestResultsForm.css'
import pyramidData from '../../data/pyramid-tests.json'
import { evaluateGoalFormula, calculatePercentageToGoal, getColorForPercentage } from '../utils/calculations'

function PyramidTestResultsForm({ onBack }) {
  const STORAGE_KEY = 'pyramidTestFormData'
  
  const [userData, setUserData] = useState({
    name: '',
    gender: 'male',
    age: '',
    bodyweight: '',
    bodyweightUnit: 'lbs'
  })

  const [testResults, setTestResults] = useState({})
  const [expandedLevels, setExpandedLevels] = useState({ [pyramidData.categories[0].id]: true })
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
        setExpandedLevels(parsed.expandedLevels || { [pyramidData.categories[0].id]: true })
      } catch (e) {
        console.error('Error loading saved data:', e)
        setExpandedLevels({ [pyramidData.categories[0].id]: true })
      }
    } else {
      setExpandedLevels({ [pyramidData.categories[0].id]: true })
    }
  }, [])

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    const dataToSave = {
      userData,
      testResults,
      expandedLevels
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  }, [userData, testResults, expandedLevels])

  const handleUserDataChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const handleToggleLevel = (levelId) => {
    setExpandedLevels(prev => ({
      ...prev,
      [levelId]: !prev[levelId]
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

    const filledTests = Object.values(testResults).filter(result => result.value && result.value !== '')
    if (filledTests.length === 0) {
      newErrors.push('Please enter at least one test result')
    }

    setErrors(newFieldErrors)
    return newErrors
  }

  const generateJSON = () => {
    const today = new Date().toISOString().split('T')[0]
    
    const results = []
    for (const category of pyramidData.categories) {
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
    
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    link.href = url
    link.download = `pyramid-results-${userData.name.replace(/\s+/g, '-')}-${today}.json`
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
        name: 'Alex Morgan',
        gender: 'male',
        age: '42',
        bodyweight: '180',
        bodyweightUnit: 'lbs'
      })
    } else {
      setUserData({
        name: 'Jordan Smith',
        gender: 'female',
        age: '38',
        bodyweight: '155',
        bodyweightUnit: 'lbs'
      })
    }

    const exampleResults = {
      pyramid_l0_001: { value: gender === 'male' ? '5.5' : '5.2', notes: '' },
      pyramid_l0_006: { value: gender === 'male' ? '178' : '175', notes: '' },
      pyramid_l1_002: { value: gender === 'male' ? '65' : '55', notes: '' },
      pyramid_l1_003: { value: gender === 'male' ? '48' : '42', notes: '' },
      pyramid_l2_002: { value: gender === 'male' ? '95' : '80', notes: '' },
      pyramid_l3_001: { value: gender === 'male' ? '62' : '55', notes: '' },
      pyramid_l4_001: { value: gender === 'male' ? '20' : '20', notes: '' }
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
  const totalTests = pyramidData.categories.reduce((sum, cat) => sum + cat.tests.length, 0)

  if (showPreview) {
    const jsonData = generateJSON()
    return (
      <div className="form-preview-modal">
        <div className="preview-content">
          <h2>Pyramid Test Results Preview</h2>
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
    <div className="pyramid-test-results-form">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <h2>📝 Create Pyramid Test Results</h2>
            <p className="progress-indicator">
              {filledTestsCount} of {totalTests} tests completed
            </p>
          </div>
          <button className="btn-back" onClick={onBack}>
            ← Back
          </button>
        </div>

        {validationErrors.length > 0 && (
          <div className="error-banner">
            <h3>Please fix the following errors:</h3>
            <ul>
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn" onClick={() => handleLoadExample('male')}>
            👨 Load Male Example
          </button>
          <button className="action-btn" onClick={() => handleLoadExample('female')}>
            👩 Load Female Example
          </button>
          <button className="action-btn btn-danger" onClick={handleResetForm}>
            🔄 Reset Form
          </button>
        </div>

        {/* User Information Section */}
        <div className="form-section">
          <h3>👤 User Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleUserDataChange('name', e.target.value)}
                className={errors.name ? 'input-error' : ''}
                placeholder="e.g., John Doe"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
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
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="form-group">
              <label>Age *</label>
              <input
                type="number"
                value={userData.age}
                onChange={(e) => handleUserDataChange('age', e.target.value)}
                className={errors.age ? 'input-error' : ''}
                placeholder="e.g., 35"
                min="0"
                max="150"
              />
              {errors.age && <span className="error-text">{errors.age}</span>}
            </div>

            <div className="form-group">
              <label>Bodyweight *</label>
              <div className="bodyweight-input">
                <input
                  type="number"
                  value={userData.bodyweight}
                  onChange={(e) => handleUserDataChange('bodyweight', e.target.value)}
                  className={errors.bodyweight ? 'input-error' : ''}
                  placeholder="e.g., 185"
                  min="0"
                  step="0.1"
                />
                <select
                  value={userData.bodyweightUnit}
                  onChange={(e) => handleUserDataChange('bodyweightUnit', e.target.value)}
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
              {errors.bodyweight && <span className="error-text">{errors.bodyweight}</span>}
            </div>
          </div>
        </div>

        {/* Test Results Section */}
        <div className="form-section">
          <h3>🏋️ Pyramid Test Results</h3>
          <p className="section-subtitle">
            Complete the tests for each pyramid level. Note: All tests within a level must reach 100% to "clear" that level.
          </p>

          {pyramidData.categories.map(level => (
            <div key={level.id} className="level-accordion">
              <button
                className="level-header"
                onClick={() => handleToggleLevel(level.id)}
              >
                <span className="level-toggle">
                  {expandedLevels[level.id] ? '▼' : '▶'}
                </span>
                <span className="level-name">
                  Level {level.pyramidLevel}: {level.name}
                </span>
                <span className="level-count">
                  {level.tests.filter(t => testResults[t.id]?.value).length} / {level.tests.length}
                </span>
              </button>

              {expandedLevels[level.id] && (
                <div className="level-content">
                  <p className="level-description">{level.description}</p>

                  <div className="tests-list">
                    {level.tests.map(test => {
                      const percentage = getPercentageForTest(test)
                      const color = getColorForPercentage(percentage)
                      const filled = testResults[test.id]?.value ? 'filled' : ''

                      return (
                        <div key={test.id} className={`test-item ${filled}`}>
                          <div className="test-header">
                            <label className="test-name">
                              {test.name}
                              <span className="test-unit">({test.unit})</span>
                            </label>
                            {testResults[test.id]?.value && (
                              <span
                                className="percentage-badge"
                                style={{ backgroundColor: color }}
                              >
                                {Math.round(percentage)}%
                              </span>
                            )}
                          </div>
                          <p className="test-description">{test.description}</p>

                          <div className="test-inputs">
                            <div className="input-group">
                              <label>Value</label>
                              <input
                                type="number"
                                value={testResults[test.id]?.value || ''}
                                onChange={(e) =>
                                  handleTestResultChange(test.id, 'value', e.target.value)
                                }
                                placeholder={`Enter ${test.unit}`}
                                step="0.1"
                              />
                            </div>

                            {testResults[test.id]?.value && (
                              <div className="goal-info">
                                <span className="goal-label">Goal: {getGoalForTest(test)}</span>
                              </div>
                            )}

                            <div className="input-group">
                              <label>Notes</label>
                              <input
                                type="text"
                                value={testResults[test.id]?.notes || ''}
                                onChange={(e) =>
                                  handleTestResultChange(test.id, 'notes', e.target.value)
                                }
                                placeholder="Optional notes"
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn btn-secondary" onClick={onBack}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={togglePreview}
            disabled={Object.values(testResults).filter(r => r.value).length === 0}
          >
            👁️ Preview & Generate
          </button>
        </div>
      </div>
    </div>
  )
}

export default PyramidTestResultsForm
