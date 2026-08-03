# Health Display - Physical Fitness Assessment Website

## Overview

This is a web application for displaying comprehensive individual physical health and fitness assessment results across 10 key categories. Users can upload their test results in JSON format and view performance metrics with visual representations, goal comparisons, and overall health compliance scores.

## Build and deploy
```
npm run build        # Creates optimized build
git add .
git commit -m "Add web application"
git push origin main
```

## Project Structure

```
health-display/
├── data/
│   ├── tests.json                    # Complete test definitions and goal formulas
│   ├── example-results.json          # Sample results (male, age 35)
│   └── example-results-female.json   # Sample results (female, age 32)
├── README.md                          # This file
└── (Web app files to be created)
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
- **Framework**: React (with static export for GitHub Pages)
- **Hosting**: GitHub Pages (static site)
- **Data Storage**: Session memory only (no persistent storage)
- **Visualization**: Chart library for horizontal bar graphs

### Key Features
- File upload support (JSON files)
- Raw JSON text paste support
- Responsive design (desktop-first)
- Gender-specific goal calculations
- No external databases or backends required
- All calculations run client-side

### Color-Coding Logic
```javascript
// Pseudo-code for percentage calculation and color determination
percentageToGoal = (actualValue / goalValue) * 100

if (percentageToGoal < 50) color = RED
else if (percentageToGoal <= 90) color = YELLOW
else if (percentageToGoal < 100) color = LIME_GREEN
else if (percentageToGoal === 100) color = GREEN
else color = BLUE
```

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

## Next Steps

The next phase will involve:
1. ✅ Creating test definitions and example data (COMPLETE)
2. ⏳ Building React web application with components for:
   - Upload/loader interface
   - Dashboard view
   - Category detail pages
   - Picture comparison feature
3. ⏳ Implementing visualization components
4. ⏳ Testing and deployment to GitHub Pages

---

**Created**: 2026-08-03  
**Version**: 1.0
