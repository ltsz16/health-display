import './CategoryCard.css'

function CategoryCard({ category, onClick }) {
  const getScoreColor = (score) => {
    if (score < 50) return '#FF6B6B';
    if (score < 70) return '#FFD93D';
    if (score < 90) return '#6BCF7F';
    if (score < 100) return '#00AA00';
    return '#4A90E2';
  };

  const color = getScoreColor(category.score);
  const percentage = Math.round(category.score);

  return (
    <div className="category-card" onClick={onClick}>
      <div className="card-header">
        <h3>{category.name}</h3>
        <span className="test-count">{category.resultCount} tests</span>
      </div>

      <div className="card-description">
        {category.description}
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color
            }}
          ></div>
        </div>
        <div className="progress-label">
          <span className="percentage" style={{ color }}>
            {percentage}%
          </span>
          <span className="of-goal">of goal</span>
        </div>
      </div>

      <button className="view-btn">
        View Details →
      </button>
    </div>
  )
}

export default CategoryCard
