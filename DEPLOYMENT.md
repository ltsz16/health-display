# Deployment Guide

This guide explains how to set up, run, and deploy the Health Display application.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Git (for version control and GitHub Pages deployment)

## Local Development

### 1. Install Dependencies

```bash
cd health-display
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Testing Locally

1. Navigate to `http://localhost:5173`
2. Click "Try Example Data" to load sample results
3. Explore the dashboard and category pages
4. Test the picture comparison feature
5. Try uploading your own JSON results

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment to GitHub Pages

### Option 1: Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to the `main` branch.

**Setup:**
1. Push your code to GitHub
2. Go to repository Settings > Pages
3. Set "Source" to "GitHub Actions"
4. The workflow will automatically build and deploy

**After first push:**
- The site will be available at: `https://ltsz16.github.io/health-display/`

### Option 2: Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# Deploy the dist folder to your hosting service
# For GitHub Pages, you can use gh-pages package:
npm install --save-dev gh-pages

# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"

npm run deploy
```

## Project Structure

```
health-display/
├── data/
│   ├── tests.json                 # Test definitions & goal formulas
│   ├── example-results.json       # Male example data
│   └── example-results-female.json # Female example data
├── src/
│   ├── components/
│   │   ├── DataLoader.jsx         # Upload/paste JSON
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── CategoryPage.jsx       # Category details
│   │   ├── CategoryCard.jsx       # Dashboard category cards
│   │   ├── ComplianceScore.jsx    # Score display
│   │   ├── HorizontalBarChart.jsx # Test result bars
│   │   └── PictureComparison.jsx  # Image comparison
│   ├── utils/
│   │   └── calculations.js        # Score & goal calculations
│   ├── App.jsx                    # Main app component
│   ├── App.css
│   ├── index.css
│   └── main.jsx                   # App entry point
├── index.html                      # HTML template
├── package.json                    # Dependencies & scripts
├── vite.config.ts                 # Vite configuration
├── README.md                       # Project documentation
└── DEPLOYMENT.md                   # This file
```

## Environment Configuration

The app is configured to run at `https://yourusername.github.io/health-display/` on GitHub Pages.

For local development, adjust as needed in:
- `vite.config.ts` - Change `base` value for different paths

## Important Notes

### Data Privacy
- ✅ All calculations run locally in your browser
- ✅ No data is sent to any server
- ✅ No tracking or analytics
- ✅ Users can clear all data by loading new results

### Supported Browsers
- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### File Format
Users should upload JSON files matching the format in [README.md](README.md#results-json-format).

Example JSON structure:
```json
{
  "metadata": {
    "version": "1.0",
    "testDate": "2026-08-01"
  },
  "user": {
    "name": "John Doe",
    "gender": "male",
    "age": 35,
    "bodyweight": 185,
    "bodyweightUnit": "lbs"
  },
  "results": [
    {
      "testId": "strength_001",
      "categoryId": "strength",
      "testName": "Trap Bar Deadlift",
      "value": 295,
      "unit": "lbs"
    }
  ]
}
```

## Troubleshooting

### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 5174
```

### Build Fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
npm run build
```

### GitHub Pages Not Updating
1. Check that the workflow completed successfully in Actions tab
2. Wait a few minutes after deployment
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Check that `base` in `vite.config.ts` is set correctly

## Performance Optimization

The application is optimized for:
- Fast local calculations (no server requests)
- Minimal bundle size (~150KB gzipped)
- Responsive design for all device sizes
- Efficient React rendering

## Feature Implementation Notes

### Dynamic Test Loading
- `tests.json` is loaded on app initialization
- Components dynamically render based on data structure
- Supports unlimited test additions without code changes

### Goal Formula Evaluation
- Formulas support bodyweight and age variables
- Safe evaluation using function constructor
- Handles gender-specific calculations

### Color Coding Logic
- Automatically applies colors based on percentage to goal
- Supports time-based tests where lower is better
- Five-tier color system (Red → Blue)

### Compliance Scoring
- Calculates category and overall scores
- Based on average percentage across all tests
- Capped at 100% for display purposes

## Support & Documentation

- See [README.md](README.md) for feature overview
- Review `tests.json` for all available tests
- Check component files for implementation details
- Test data files provide usage examples

---

**Version**: 1.0  
**Last Updated**: 2026-08-03
