# Health Display - Physical Fitness Assessment Website

## Overview

This is a web application for displaying comprehensive individual physical health and fitness assessment results across 10 key categories. Users can upload their test results in JSON format and view performance metrics with visual representations, goal comparisons, and overall health compliance scores.

## Quick Start

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:5173/health-display/
```

### Production Build
```bash
npm run build        # Creates optimized build in dist/
npm run preview      # Preview production build locally
```

### Deployment to GitHub Pages
The application is automatically deployed to GitHub Pages via GitHub Actions when you push to the `main` branch.

**Live Site**: https://ltsz16.github.io/health-display/

GitHub Actions workflow automatically:
- ✅ Builds the application
- ✅ Uploads artifacts
- ✅ Deploys to GitHub Pages
- ✅ Triggers on every push to `main`

## Project Structure

```
health-display/
├── .github/workflows/
│   └── deploy.yml                # GitHub Actions CI/CD workflow
├── public/
│   └── data/
│       ├── tests.json                    # Test definitions (51 tests, 10 categories)
│       ├── example-results.json          # Sample results (male, 185 lbs, age 35)
│       └── example-results-female.json   # Sample results (female, 145 lbs, age 32)
├── src/
│   ├── components/
│   │   ├── DataLoader.jsx               # Data input interface
│   │   ├── Dashboard.jsx                # Main view with category overview
│   │   ├── CategoryPage.jsx             # Category detail page
│   │   ├── HorizontalBarChart.jsx       # Individual test result visualization
│   │   ├── ComplianceScore.jsx          # Circular score display
│   │   ├── CategoryCard.jsx             # Category preview card
│   │   └── PictureComparison.jsx        # Before/after image comparison
│   ├── utils/
│   │   └── calculations.js              # Goal evaluation and scoring logic
│   ├── App.jsx                          # Main application component
│   ├── App.css                          # Global styles
│   ├── index.css                        # Base CSS variables and styling
│   └── main.jsx                         # React entry point
├── vite.config.ts                       # Vite configuration
├── package.json                         # Dependencies and scripts
├── README.md                            # This file
└── LICENSE
```

## Data Structure

### tests.json

The main configuration file that defines all available fitness tests, their descriptions, video links, units of measurement, and goal formulas.

**Structure:**
```json
{
  "categories": [
    {
      "id": "strength",                    // Unique category identifier
      "name": "Strength",                  // Display name
      "description": "...",                // Category description
      "subCategories": [                   // Organizational groupings
        {
          "name": "Lower Body Pushing",    // Sub-category name
          "testIds": ["strength_001"]      // List of associated test IDs
        }
      ],
      "tests": [
        {
          "id": "strength_001",                // Unique test identifier
          "name": "Trap Bar Deadlift",         // Test name
          "description": "...",                // Detailed description (shows on hover)
          "videoUrl": "https://...",           // YouTube embed URL for tutorial
          "unit": "lbs",                       // Unit of measurement
          "measurementType": "weight",         // Type: weight, distance, time, reps, force, etc.
          "goalFormula": {
            "male": "bodyweight * 1.75",       // Formula for male goal
            "female": "bodyweight * 1.25"      // Formula for female goal
          }
        }
      ]
    }
  ]
}
```

### Results JSON Format

User results are uploaded in this format. The application calculates percentage to goal and determines color coding.

**Structure:**
```json
{
  "metadata": {
    "version": "1.0",
    "createdDate": "YYYY-MM-DD",
    "testDate": "YYYY-MM-DD"
  },
  "user": {
    "name": "John Doe",
    "gender": "male",                    // Required: "male" or "female"
    "age": 35,
    "bodyweight": 185,
    "bodyweightUnit": "lbs"              // Used in goal formula calculations
  },
  "results": [
    {
      "testId": "strength_001",          // References test from tests.json
      "categoryId": "strength",          // Category ID
      "testName": "Trap Bar Deadlift",   // Display name
      "value": 295,                      // Actual measured value
      "unit": "lbs",                     // Unit of measurement
      "notes": "Optional comments"       // User notes about the test
    }
    // ... more results
  ]
}
```

## Categories & Tests

The application includes 10 fitness categories with 51 total tests:

### 1. **Strength** (8 tests)
- Trap Bar Deadlift
- Bench Press
- Weighted Pull-Up
- Chest-Supported Row
- Standing Overhead Press
- Hand Dynamometer (Grip)
- Farmer's Carry
- Squat

### 2. **Endurance** (4 tests)
- VO2 Max
- 2000 Meter Row
- Heart Rate Recovery
- Resting Heart Rate

### 3. **Stamina** (7 tests)
- Max Push-Ups
- Max Pull-Ups
- Bodyweight Squats (2 min)
- Farmer Carry (Max Distance)
- Sled Push
- 500m Row Sprint
- Kettlebell Swings

### 4. **Power** (3 tests)
- Vertical Jump
- Broad Jump
- Medicine Ball Throw

### 5. **Agility** (2 tests)
- T-Test
- 5-10-5 Shuttle

### 6. **Balance** (2 tests)
- Single-Leg Stand
- Y-Balance Test

### 7. **Mobility** (5 tests)
- Deep Squat
- Knee-to-Wall
- 90/90 Hip Rotation
- Wall Shoulder Flexion
- Thoracic Rotation

### 8. **Flexibility** (9 tests)
- Sit-and-Reach
- Thomas Test
- Straight-Leg Raise
- Doorway Pec Stretch
- Overhead Lat Stretch
- Cervical ROM
- Ely Test
- Knee-to-Wall
- Apley Scratch Test

### 9. **Body Composition** (2 tests)
- Body Fat Percentage
- Lean Body Mass

### 10. **Core** (3 tests)
- Plank Hold
- Side Plank Hold
- Dead Bug

## Performance Scoring & Color Coding

The application displays results as horizontal bar graphs with the following color scheme:

| Result | Color | Percentage to Goal |
|--------|-------|-------------------|
| Red | #FF6B6B | < 50% |
| Yellow | #FFD93D | ≥ 50% and ≤ 90% |
| Lime Green | #6BCF7F | > 90% and < 100% |
| Green | #00AA00 | = 100% |
| Blue | #4A90E2 | > 100% |

## Goal Formulas

Goals are calculated based on:
- **Gender**: Separate formulas for male/female
- **Bodyweight**: Primary factor in most formulas
- **Age**: Used in aerobic capacity (VO2 Max) calculations

### Examples:

**Strength (Trap Bar Deadlift):**
- Male: bodyweight × 1.75
- Female: bodyweight × 1.25

**Endurance (2000m Row):**
- Male: 420 seconds
- Female: 480 seconds

**Power (Vertical Jump):**
- Male: 24 inches
- Female: 18 inches

## Example Usage

### Loading Results
1. User navigates to the app
2. Clicks "Load Results" to upload JSON file or paste raw JSON text
3. App parses results and calculates percentage to goal
4. Results displayed across all categories

### Viewing Results
- **Dashboard**: Overall health compliance score and quick stats
- **Category Pages**: Detailed horizontal bar graphs for each fitness category
- **Individual Tests**: Hover over test names to see descriptions
- Click on test names to watch tutorial videos

### Picture Comparison
- Upload two images (before/after, side-by-side comparison, etc.)
- Images displayed at equal size for easy visual comparison

## Testing Sample Files

Two example result files are provided:

1. **example-results.json**: Male participant (35 years, 185 lbs)
   - Demonstrates goal calculations for males
   - Shows varied performance levels (red, yellow, green, blue results)

2. **example-results-female.json**: Female participant (32 years, 145 lbs)
   - Demonstrates gender-specific goal calculations
   - Shows different baseline expectations for females

## Development Notes

### Technology Stack
- **Frontend**: React 18.2.0 with hooks for state management
- **Build Tool**: Vite 5.x with fast HMR development server
- **Hosting**: GitHub Pages (static site hosting)
- **CI/CD**: GitHub Actions automatic deployment
- **Data Format**: JSON for all test definitions and results
- **Styling**: CSS3 with responsive design
- **Calculation Engine**: Client-side JavaScript (no backend required)

### Core Components

**DataLoader.jsx**
- File upload support for JSON results files
- Raw JSON text paste capability
- Example data loader (male/female samples)
- Input validation and data enrichment

**Dashboard.jsx**
- Overall compliance score display (0-100%)
- 10 category cards with performance visualization
- Quick stats and summary
- Navigation to category detail pages

**CategoryPage.jsx**
- Detailed view for individual fitness category
- Tests organized by sub-category
- Horizontal bar charts for each test
- Back navigation to dashboard

**HorizontalBarChart.jsx**
- Visual representation of actual vs. goal performance
- Color-coded progress bar (5-tier system)
- Clickable test names open tutorial videos
- Hover tooltips with test descriptions
- Display of user notes

**ComplianceScore.jsx**
- Large circular score display
- Color-coded border matching performance level
- Status labels (Below Goal, Goal Met, Exceeded Goal, etc.)
- Responsive sizing

**CategoryCard.jsx**
- Category preview cards shown on dashboard
- Performance bar with percentage
- Click to view category details
- Shows number of tests in category

**PictureComparison.jsx**
- Side-by-side image upload and display
- Customizable labels (default: Before/After)
- Equal-width image containers
- Clear individual or all images

### Key Features
- **Dynamic JSON Architecture**: All tests defined in tests.json; adding/modifying tests requires no code changes
- **Gender-Specific Goals**: Separate calculation formulas for male/female participants
- **Multi-Unit Support**: Handles weight (lbs/kg), time (seconds), distance, reps, degrees, etc.
- **5-Tier Color Coding**: Visual performance feedback (Red < 50%, Yellow 50-90%, Lime Green 90-100%, Green 100%, Blue > 100%)
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Client-Side Calculations**: All math runs in browser; no backend required
- **Safe Formula Evaluation**: Goal formulas evaluated securely using Function constructor

## Important Considerations

### Unit Conversions
- Most strength tests use **lbs** (pounds)
- Grip strength uses **kg** (kilograms)
- Some tests use **seconds** (time), **reps** (repetitions), **degrees** (angles), etc.
- The system supports multiple unit types per test

### Special Measurement Types
- **Qualitative scores**: 0-3 scale (Deep Squat, Dead Bug, etc.)
- **Time-based (lower is better)**: 2000m Row, T-Test, 5-10-5 Shuttle
- **Distance/Weight-based (higher is better)**: Most strength and power tests

### Gender-Specific Calculations
All goal formulas are gender-specific to reflect physiological differences:
- Males typically have higher strength and power goals
- Females typically have different aerobic and endurance targets

## Future Enhancements

Potential features for future versions:
- Historical tracking (multiple test sessions)
- Progress visualization (trend charts)
- Comparisons to population percentiles
- PDF report generation
- Sharing results (anonymized comparisons)
- Mobile app version
- Wearable device integration

## Project Status

✅ **COMPLETE AND DEPLOYED**

The health display application is fully built, tested, and deployed to GitHub Pages.

### Completed Features:
- ✅ React 18.2 application with 7 fully functional components
- ✅ Dynamic JSON-driven test structure (10 categories, 51 tests)
- ✅ Gender-specific goal calculations
- ✅ 5-tier color-coded performance visualization
- ✅ Dashboard with overall compliance scoring
- ✅ Category detail pages with individual test results
- ✅ Picture comparison feature for before/after images
- ✅ Responsive design (desktop, tablet, mobile)
- ✅ Example data for male and female participants
- ✅ GitHub Actions CI/CD pipeline
- ✅ Deployed to GitHub Pages

### Live Site
**https://ltsz16.github.io/health-display/**

Load the example data to see the application in action:
- Male example: John Doe, 35 years old, 185 lbs → Overall Score: 97%
- Female example: Sarah Johnson, 32 years old, 145 lbs → Full category breakdown

---

**Created**: 2026-08-03  
**Version**: 1.0
