import { useState } from 'react'
import './Dashboard.css'
import {
  calculateComplianceScore,
  getCategoryById,
  getResultsForCategory,
  enrichResultsWithCalculations
} from '../utils/calculations'
import ComplianceScore from './ComplianceScore'
import CategoryCard from './CategoryCard'

function Dashboard({ results, tests, onCategoryClick }) {
  const user = results.user;
  const resultsArray = results.results;

  // Calculate overall compliance score
  const overallScore = calculateComplianceScore(
    resultsArray,
    tests
  );

  // Get all categories and their scores
  const categoryScores = tests.categories.map(category => {
    const categoryResults = getResultsForCategory(resultsArray, category.id);
    const score = calculateComplianceScore(categoryResults, tests, category.id);
    return {
      ...category,
      score,
      resultCount: categoryResults.length
    };
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="user-info">
          <h2>Welcome, {user.name}!</h2>
          <p className="user-details">
            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)} • 
            Age {user.age} • 
            {user.bodyweight} {user.bodyweightUnit}
          </p>
        </div>
      </div>

      <div className="overall-score-section">
        <ComplianceScore score={overallScore} label="Overall Health Score" />
        <div className="score-description">
          <p>Your overall fitness assessment is based on your performance across all 10 categories and 51+ fitness tests.</p>
        </div>
      </div>

      <div className="categories-grid">
        <h3>Performance by Category</h3>
        <div className="categories-container">
          {categoryScores.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => onCategoryClick(category.id)}
            />
          ))}
        </div>
      </div>

      <div className="color-legend">
        <h3>Performance Color Guide</h3>
        <div className="legend-grid">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FF6B6B' }}></div>
            <div className="legend-info">
              <span className="legend-label">Below Goal</span>
              <span className="legend-range">&lt; 50% of goal</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFD93D' }}></div>
            <div className="legend-info">
              <span className="legend-label">Below Target</span>
              <span className="legend-range">50-90% of goal</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#6BCF7F' }}></div>
            <div className="legend-info">
              <span className="legend-label">Near Goal</span>
              <span className="legend-range">90-100% of goal</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#00AA00' }}></div>
            <div className="legend-info">
              <span className="legend-label">Goal Met</span>
              <span className="legend-range">100% of goal</span>
            </div>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4A90E2' }}></div>
            <div className="legend-info">
              <span className="legend-label">Exceeded Goal</span>
              <span className="legend-range">&gt; 100% of goal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <h3>Summary Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{tests.categories.length}</div>
            <div className="stat-label">Fitness Categories</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {resultsArray.length}
            </div>
            <div className="stat-label">Tests Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">
              {categoryScores.filter(c => c.score >= 100).length}
            </div>
            <div className="stat-label">Categories at Goal</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
