import './CategoryPage.css'
import {
  calculateComplianceScore,
  getCategoryById,
  getResultsForCategory,
  enrichResultsWithCalculations
} from '../utils/calculations'
import ComplianceScore from './ComplianceScore'
import HorizontalBarChart from './HorizontalBarChart'

function CategoryPage({ categoryId, results, tests, onBack }) {
  const user = results.user;
  const resultsArray = results.results;

  // Get category data
  const category = getCategoryById(tests, categoryId);
  if (!category) return <div>Category not found</div>;

  // Get results for this category
  const categoryResults = getResultsForCategory(resultsArray, categoryId);

  // Enrich results with calculations
  const enrichedResults = enrichResultsWithCalculations(
    categoryResults,
    tests,
    user.gender,
    user.age,
    user.bodyweight
  );

  // Calculate category compliance score
  const categoryScore = calculateComplianceScore(categoryResults, tests, categoryId);

  // Group tests by sub-category
  const groupedTests = category.subCategories.map(subCat => {
    const subCatTests = enrichedResults.filter(r =>
      subCat.testIds.includes(r.testId)
    );
    return {
      name: subCat.name,
      tests: subCatTests
    };
  });

  return (
    <div className="category-page">
      <div className="category-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h2>{category.name}</h2>
        <p className="category-description">{category.description}</p>
      </div>

      <div className="score-card">
        <ComplianceScore
          score={categoryScore}
          label={`${category.name} Category Score`}
        />
      </div>

      <div className="tests-container">
        {groupedTests.map((group, idx) => (
          group.tests.length > 0 && (
            <div key={idx} className="subcategory-group">
              <h3 className="subcategory-title">{group.name}</h3>
              <div className="tests-list">
                {group.tests.map(test => (
                  <HorizontalBarChart
                    key={test.testId}
                    test={test}
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </div>

      <div className="category-notes">
        <h3>Performance Summary</h3>
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Total Tests:</span>
            <span className="summary-value">{enrichedResults.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tests at Goal:</span>
            <span className="summary-value">
              {enrichedResults.filter(t => t.percentage >= 100).length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Average Performance:</span>
            <span className="summary-value">{categoryScore}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
