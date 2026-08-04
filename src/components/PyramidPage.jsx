import { useState, useEffect } from 'react'
import './PyramidPage.css'
import { calculatePercentageToGoal, evaluateGoalFormula, getColorForPercentage } from '../utils/calculations'

function PyramidPage({ results, onBack }) {
  const [pyramidTests, setPyramidTests] = useState(null)
  const [levelScores, setLevelScores] = useState([])

  useEffect(() => {
    // Load pyramid-tests.json
    fetch('/data/pyramid-tests.json')
      .then(response => response.json())
      .then(data => {
        setPyramidTests(data)
        calculateLevelScores(data)
      })
      .catch(error => console.error('Error loading pyramid-tests.json:', error))
  }, [])

  const calculateLevelScores = (data) => {
    if (!data || !data.categories || !results) return

    const userAge = results.user.age
    const userBodyweight = results.user.bodyweight
    const userGender = results.user.gender
    const resultsArray = results.results

    // Calculate score for each pyramid level
    const scores = data.categories.map(category => {
      // Get all test IDs for this category
      const testIds = category.tests.map(t => t.id)

      // Find matching results
      const categoryResults = resultsArray.filter(r => testIds.includes(r.testId))

      // Calculate percentage for each test
      const percentages = category.tests.map(test => {
        // Find if this test has a result
        const result = resultsArray.find(r => r.testId === test.id)

        if (!result) {
          return 0 // No result = 0%
        }

        // Get goal value
        const goal = evaluateGoalFormula(test.goalFormula[userGender?.toLowerCase() || 'male'], userAge, userBodyweight)

        if (!goal) return 0

        return calculatePercentageToGoal(result.value, goal, test.measurementType)
      })

      // Calculate average percentage
      const avgPercentage = percentages.length > 0 
        ? percentages.reduce((a, b) => a + b, 0) / percentages.length
        : 0

      // Check if all tests are at 100% (cleared)
      const allCleared = percentages.length > 0 && percentages.every(p => p >= 100)

      return {
        id: category.id,
        name: category.name,
        description: category.description,
        pyramidLevel: category.pyramidLevel,
        goalDescription: category.goalDescription,
        averagePercentage: Math.round(avgPercentage),
        allCleared,
        testCount: category.tests.length,
        completedTests: categoryResults.length,
        percentages
      }
    })

    setLevelScores(scores)
  }

  const getLayerColor = (level) => {
    // Find the level in levelScores
    const levelData = levelScores.find(s => s.pyramidLevel === level)
    if (!levelData) return '#CCCCCC' // Gray if no data

    if (levelData.allCleared) {
      return '#00AA00' // Green - fully cleared
    } else if (levelData.averagePercentage >= 100) {
      return '#00AA00' // Green
    } else if (levelData.averagePercentage >= 90) {
      return '#6BCF7F' // Lime green
    } else if (levelData.averagePercentage >= 50) {
      return '#FFD93D' // Yellow
    } else {
      return '#FF6B6B' // Red
    }
  }

  const getLevelLabel = (level) => {
    const levelData = levelScores.find(s => s.pyramidLevel === level)
    if (!levelData) return `Level ${level}`

    return `${levelData.name}`
  }

  const getLevelPercentage = (level) => {
    const levelData = levelScores.find(s => s.pyramidLevel === level)
    if (!levelData) return '0%'

    return `${levelData.averagePercentage}%`
  }

  const handleLevelClick = (level) => {
    const levelData = levelScores.find(s => s.pyramidLevel === level)
    if (levelData) {
      // You can add modal or detailed view here
      console.log('Level clicked:', levelData)
    }
  }

  return (
    <div className="pyramid-page">
      <button className="back-btn" onClick={onBack}>← Back to Dashboard</button>

      <div className="pyramid-header">
        <h2>Movement Progression Pyramid</h2>
        <p className="pyramid-subtitle">
          Progress through each level by achieving 100% on all tests. Green indicates "cleared for full exercise."
        </p>
      </div>

      <div className="pyramid-container">
        <div className="pyramid-visualization">
          {/* Level 4 (Top) - Full Body */}
          <div 
            className="pyramid-layer level-4"
            style={{ backgroundColor: getLayerColor(4) }}
            onClick={() => handleLevelClick(4)}
          >
            <div className="layer-label">
              <div className="layer-name">{getLevelLabel(4)}</div>
              <div className="layer-progress">{getLevelPercentage(4)}</div>
            </div>
          </div>

          {/* Level 3 - Trunk Stability */}
          <div 
            className="pyramid-layer level-3"
            style={{ backgroundColor: getLayerColor(3) }}
            onClick={() => handleLevelClick(3)}
          >
            <div className="layer-label">
              <div className="layer-name">{getLevelLabel(3)}</div>
              <div className="layer-progress">{getLevelPercentage(3)}</div>
            </div>
          </div>

          {/* Level 2 - Full Core */}
          <div 
            className="pyramid-layer level-2"
            style={{ backgroundColor: getLayerColor(2) }}
            onClick={() => handleLevelClick(2)}
          >
            <div className="layer-label">
              <div className="layer-name">{getLevelLabel(2)}</div>
              <div className="layer-progress">{getLevelPercentage(2)}</div>
            </div>
          </div>

          {/* Level 1 - Core Stability */}
          <div 
            className="pyramid-layer level-1"
            style={{ backgroundColor: getLayerColor(1) }}
            onClick={() => handleLevelClick(1)}
          >
            <div className="layer-label">
              <div className="layer-name">{getLevelLabel(1)}</div>
              <div className="layer-progress">{getLevelPercentage(1)}</div>
            </div>
          </div>

          {/* Level 0 (Bottom/Foundation) - Mobility & Tissue */}
          <div 
            className="pyramid-layer level-0"
            style={{ backgroundColor: getLayerColor(0) }}
            onClick={() => handleLevelClick(0)}
          >
            <div className="layer-label">
              <div className="layer-name">{getLevelLabel(0)}</div>
              <div className="layer-progress">{getLevelPercentage(0)}</div>
            </div>
          </div>
        </div>

        <div className="pyramid-info">
          <h3>Pyramid Levels</h3>
          <div className="levels-description">
            {levelScores.map(level => (
              <div key={level.id} className="level-card">
                <div className="level-card-header">
                  <div 
                    className="level-color-indicator"
                    style={{ backgroundColor: getLayerColor(level.pyramidLevel) }}
                  ></div>
                  <div className="level-card-title">
                    <h4>{level.name}</h4>
                    <p className="level-progress-text">
                      {level.completedTests} of {level.testCount} tests recorded
                    </p>
                  </div>
                  <div className="level-card-score">{level.averagePercentage}%</div>
                </div>
                <p className="level-card-description">{level.description}</p>
                <p className="level-card-goal">
                  <strong>Goal:</strong> {level.goalDescription}
                </p>
                <div className="level-status">
                  {level.allCleared ? (
                    <span className="status-cleared">✓ Cleared for full exercise</span>
                  ) : level.averagePercentage >= 100 ? (
                    <span className="status-cleared">✓ Goal achieved</span>
                  ) : (
                    <span className="status-progress">In Progress</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pyramid-legend">
        <h3>Color Guide</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#00AA00' }}></div>
            <div className="legend-info">
              <span className="legend-label">Cleared for Full Exercise</span>
              <span className="legend-range">100% - All tests passed</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#6BCF7F' }}></div>
            <div className="legend-info">
              <span className="legend-label">Near Goal</span>
              <span className="legend-range">90-99% of target</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFD93D' }}></div>
            <div className="legend-info">
              <span className="legend-label">Below Target</span>
              <span className="legend-range">50-89% of target</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
            <div className="legend-info">
              <span className="legend-label">Below Goal</span>
              <span className="legend-range">Less than 50% of target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PyramidPage
