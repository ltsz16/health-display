# Quick Start Guide

Get the Health Display application up and running in 5 minutes!

## 1. Install Dependencies

Make sure you have Node.js 16+ installed, then run:

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 3. Load Test Data

The app includes two example datasets:

### Option A: Load Example Data
1. Click "Try Example Data"
2. Choose "👨 Male (35 yrs, 185 lbs)" or "👩 Female (32 yrs, 145 lbs)"
3. Explore the dashboard!

### Option B: Upload Your Own
1. Click "Upload File" and select a JSON file, OR
2. Click "Paste JSON" and paste results JSON directly

## 4. Explore Features

### Dashboard
- View overall health score (0-100%)
- See performance by category
- Quick stats summary

### Category Pages
- Click any category card to see details
- View horizontal bar graphs for each test
- Hover over test names for descriptions
- Click test names to watch video tutorials

### Picture Comparison
- Upload two images side-by-side
- Great for before/after comparisons
- Customize labels

## JSON Format

Your results JSON should follow this structure:

```json
{
  "metadata": {
    "version": "1.0",
    "testDate": "2026-08-01"
  },
  "user": {
    "name": "Your Name",
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
      "unit": "lbs",
      "notes": "Optional notes"
    }
  ]
}
```

**Required fields:**
- `user.gender` - "male" or "female"
- `user.bodyweight` - numeric value
- `results` - array of test results
- Each result needs: `testId`, `categoryId`, `testName`, `value`, `unit`

For valid test IDs and categories, see `data/tests.json`

## Color Meanings

| Color | Meaning | % to Goal |
|-------|---------|-----------|
| 🔴 Red | Below Goal | < 50% |
| 🟡 Yellow | Below Target | 50-90% |
| 🟢 Lime | Near Goal | 90-100% |
| ✅ Green | Goal Met | = 100% |
| 🔵 Blue | Exceeded | > 100% |

## Key Features

✅ **Dynamic Test Loading** - Tests load from `tests.json`  
✅ **Gender-Specific Goals** - Different formulas for male/female  
✅ **Client-Side Only** - No server, no data uploaded  
✅ **Responsive Design** - Works on desktop and mobile  
✅ **Video Tutorials** - Click test names to watch how-tos  
✅ **Picture Comparison** - Side-by-side image viewer  

## Troubleshooting

### Port 5173 already in use?
```bash
npm run dev -- --port 5174
```

### Need to see the example data?
Files are in `/data/`:
- `example-results.json` - Male participant
- `example-results-female.json` - Female participant

### Want to add more tests?
Edit `data/tests.json` - the app will automatically display them!

## Building for Deployment

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

Deploy to GitHub Pages automatically via GitHub Actions!

## Next Steps

1. ✅ Install and run locally with `npm install && npm run dev`
2. ✅ Try example data to explore features
3. ✅ Prepare your own results JSON
4. ✅ Upload and view your health metrics
5. ✅ Deploy to GitHub Pages for sharing!

---

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
