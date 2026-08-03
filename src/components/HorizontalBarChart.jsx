import { useState } from 'react'
import './HorizontalBarChart.css'

function HorizontalBarChart({ test }) {
  const [showDescription, setShowDescription] = useState(false)

  const percentage = Math.min(test.percentage, 150); // Cap display at 150% for visual reasons
  const displayPercentage = Math.round(test.percentage);

  const handleVideoClick = (e) => {
    e.preventDefault();
    if (test.testDefinition?.videoUrl) {
      window.open(test.testDefinition.videoUrl, '_blank');
    }
  };

  return (
    <div className="horizontal-bar-chart">
      <div className="chart-row">
        <div
          className="test-name"
          onMouseEnter={() => setShowDescription(true)}
          onMouseLeave={() => setShowDescription(false)}
          onClick={handleVideoClick}
          style={{ cursor: test.testDefinition?.videoUrl ? 'pointer' : 'default' }}
          title={test.testDefinition?.videoUrl ? 'Click to watch video tutorial' : ''}
        >
          <span className="name-text">{test.testName}</span>
          {test.testDefinition?.videoUrl && (
            <span className="video-indicator">📹</span>
          )}
        </div>

        <div className="chart-area">
          <div className="bar-container">
            <div
              className="bar"
              style={{
                width: `${Math.min((percentage / 150) * 100, 100)}%`,
                backgroundColor: test.color
              }}
            >
              <span className="bar-value">
                {displayPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="test-details">
          <span className="actual-value">
            {test.value} {test.unit}
          </span>
          <span className="goal-value">
            / {Math.round(test.goal * 100) / 100} {test.unit}
          </span>
        </div>
      </div>

      {showDescription && test.testDefinition?.description && (
        <div className="description-tooltip">
          <p>{test.testDefinition.description}</p>
        </div>
      )}

      {test.notes && (
        <div className="test-notes">
          <span className="notes-label">Note:</span>
          <span className="notes-text">{test.notes}</span>
        </div>
      )}
    </div>
  )
}

export default HorizontalBarChart
