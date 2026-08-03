import './ComplianceScore.css'

function ComplianceScore({ score, label = 'Compliance Score' }) {
  const getScoreColor = (score) => {
    if (score < 50) return '#FF6B6B';
    if (score < 70) return '#FFD93D';
    if (score < 90) return '#6BCF7F';
    if (score < 100) return '#00AA00';
    return '#4A90E2';
  };

  const getScoreLabel = (score) => {
    if (score < 50) return 'Below Goal';
    if (score < 70) return 'Below Target';
    if (score < 90) return 'Near Goal';
    if (score < 100) return 'Goal Met';
    return 'Exceeded Goal';
  };

  const color = getScoreColor(score);
  const statusLabel = getScoreLabel(score);

  return (
    <div className="compliance-score">
      <div className="score-container">
        <div className="score-circle" style={{ borderColor: color }}>
          <div className="score-value">{Math.round(score)}</div>
          <div className="score-percent">%</div>
        </div>
        <div className="score-info">
          <div className="score-title">{label}</div>
          <div className="score-status" style={{ color }}>
            {statusLabel}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplianceScore
