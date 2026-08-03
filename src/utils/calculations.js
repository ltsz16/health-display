/**
 * Calculate percentage to goal
 * For most tests: (actual / goal) * 100
 * For time-based tests where lower is better: (goal / actual) * 100
 */
export const calculatePercentageToGoal = (actual, goal, measurementType) => {
  if (!goal || goal === 0) return 0;

  // For time-based tests (lower is better)
  const timeBased = ['time'];
  if (timeBased.includes(measurementType)) {
    return (goal / actual) * 100;
  }

  // For most other tests (higher is better)
  return (actual / goal) * 100;
};

/**
 * Get color code based on percentage to goal
 */
export const getColorForPercentage = (percentage) => {
  if (percentage < 50) return '#FF6B6B'; // Red
  if (percentage <= 90) return '#FFD93D'; // Yellow
  if (percentage < 100) return '#6BCF7F'; // Lime Green
  if (percentage === 100) return '#00AA00'; // Green
  return '#4A90E2'; // Blue
};

/**
 * Get color label for percentage
 */
export const getColorLabel = (percentage) => {
  if (percentage < 50) return 'Below Goal';
  if (percentage <= 90) return 'Below Target';
  if (percentage < 100) return 'Near Goal';
  if (percentage === 100) return 'Goal Met';
  return 'Exceeded Goal';
};

/**
 * Evaluate a goal formula with user data
 */
export const evaluateGoalFormula = (formula, userAge, userBodyweight) => {
  if (!formula) return null;

  // If it's just a number, return it
  if (typeof formula === 'number') return formula;
  if (typeof formula !== 'string') return null;

  // Replace placeholders in the formula
  let result = formula
    .replace(/bodyweight/gi, userBodyweight)
    .replace(/age/gi, userAge);

  try {
    // Evaluate the formula safely
    // This is a simple eval - in production, use a safer expression parser
    return Function('"use strict"; return (' + result + ')')();
  } catch (e) {
    console.error('Error evaluating formula:', formula, e);
    return null;
  }
};

/**
 * Calculate overall compliance score for a category or all categories
 * Based on average percentage to goal across all tests
 */
export const calculateComplianceScore = (results, tests, categoryId = null) => {
  if (!results || !tests || results.length === 0) return 0;

  // Filter results by category if specified
  let filteredResults = results;
  if (categoryId) {
    filteredResults = results.filter(r => r.categoryId === categoryId);
  }

  if (filteredResults.length === 0) return 0;

  // Calculate percentage to goal for each result
  const percentages = filteredResults.map(result => {
    // Find the test definition
    const testDef = findTestById(tests, result.testId);
    if (!testDef) return 0;

    // Get goal value
    let goal = testDef.goalFormula[result.gender?.toLowerCase() || 'male'];
    goal = evaluateGoalFormula(goal, result.age, result.bodyweight);

    if (!goal) return 0;

    return calculatePercentageToGoal(result.value, goal, testDef.measurementType);
  });

  // Calculate average percentage
  const avgPercentage = percentages.reduce((a, b) => a + b, 0) / percentages.length;

  // Convert to 0-100 scale (cap at 100 for display)
  return Math.min(Math.round(avgPercentage), 100);
};

/**
 * Find a test by its ID in the tests data structure
 */
export const findTestById = (tests, testId) => {
  for (const category of tests.categories) {
    const test = category.tests.find(t => t.id === testId);
    if (test) return test;
  }
  return null;
};

/**
 * Get category by ID
 */
export const getCategoryById = (tests, categoryId) => {
  return tests.categories.find(c => c.id === categoryId);
};

/**
 * Get all results for a category
 */
export const getResultsForCategory = (results, categoryId) => {
  return results.filter(r => r.categoryId === categoryId);
};

/**
 * Enrich results with calculated percentages and colors
 */
export const enrichResultsWithCalculations = (results, tests, userGender, userAge, userBodyweight) => {
  return results.map(result => {
    const testDef = findTestById(tests, result.testId);
    if (!testDef) return result;

    // Get goal value
    let goal = testDef.goalFormula[userGender?.toLowerCase() || 'male'];
    goal = evaluateGoalFormula(goal, userAge, userBodyweight);

    // Calculate percentage
    const percentage = calculatePercentageToGoal(result.value, goal, testDef.measurementType);

    return {
      ...result,
      goal,
      percentage,
      color: getColorForPercentage(percentage),
      colorLabel: getColorLabel(percentage),
      testDefinition: testDef
    };
  });
};
