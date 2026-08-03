# Testing Checklist - Health Display Application

## ✅ Server Status
- **Dev Server**: Running at http://localhost:5173/health-display/
- **Build Status**: ✅ Complete (222 KB total, 50.71 KB JS gzip)
- **Data Files**: ✅ Included in dist/ folder
- **Ready for Testing**: YES

---

## 🧪 Testing Procedures

### Section 1: Data Loading & Upload
- [ ] **Load Example Data (Male)**
  - Click "Try Example Data"
  - Click "👨 Male (35 yrs, 185 lbs)"
  - Should load John Doe's data
  - Should see "Welcome, John Doe!" on dashboard
  - Age: 35, Bodyweight: 185 lbs

- [ ] **Load Example Data (Female)**
  - Click "Load New Results"
  - Click "Try Example Data"
  - Click "👩 Female (32 yrs, 145 lbs)"
  - Should load Sarah Johnson's data
  - Should see different goal values for female

- [ ] **Upload JSON File**
  - Click "Load New Results"
  - Click "Upload File"
  - Select `data/example-results.json`
  - Verify data loads correctly

- [ ] **Paste JSON Text**
  - Click "Load New Results"
  - Click "Paste JSON"
  - Copy content from `example-results.json`
  - Paste into textarea
  - Click "Load Results"
  - Should load successfully

- [ ] **Error Handling**
  - Paste invalid JSON (e.g., `{invalid}`)
  - Should show error message
  - Try pasting JSON without required fields
  - Should show validation error

### Section 2: Dashboard Features
- [ ] **Overall Score Display**
  - Should show circular score (0-100%)
  - Male example should be ~87%
  - Female example should be ~81%
  - Status label should display (e.g., "Exceeded Goal")

- [ ] **User Information**
  - Shows correct name
  - Shows correct gender
  - Shows correct age
  - Shows correct bodyweight

- [ ] **Category Grid**
  - Should display 10 category cards
  - Each card shows category name
  - Each card shows test count
  - Each card shows progress bar
  - Progress bars colored correctly

- [ ] **Color Coding on Dashboard**
  - Red bars: < 50%
  - Yellow bars: 50-90%
  - Lime bars: 90-100%
  - Green bars: = 100%
  - Blue bars: > 100%

- [ ] **Legend Section**
  - Shows 5 color options
  - Descriptions match color meanings
  - Legend visible and readable

- [ ] **Summary Stats**
  - Shows "10 Fitness Categories"
  - Shows correct number of tests completed
  - Shows number of categories at goal

### Section 3: Category Pages (Test All 10)
Navigate through each category and verify:

- [ ] **Strength Category**
  - Score should display correctly
  - 8 tests should show (organized in sub-categories)
  - Colors appropriate for each test

- [ ] **Endurance Category**
  - 4 tests displayed
  - Verify VO2 Max calculation
  - 2000m Row should use time-based calculation (lower is better)

- [ ] **Stamina Category**
  - 7 tests displayed
  - Tests grouped by sub-category
  - Kettlebell swings visible

- [ ] **Power Category**
  - 3 tests (Vertical Jump, Broad Jump, Medicine Ball)
  - Verify distance calculations

- [ ] **Agility Category**
  - T-Test visible
  - 5-10-5 Shuttle visible
  - Both use time-based (lower is better)

- [ ] **Balance Category**
  - Single-Leg Stand visible
  - Y-Balance Test visible
  - Colors show progress toward goals

- [ ] **Mobility Category**
  - 5 tests grouped by body region
  - Deep Squat (qualitative score 0-3)
  - Knee-to-Wall distance
  - 90/90 Hip Rotation
  - Wall Shoulder Flexion
  - Thoracic Rotation

- [ ] **Flexibility Category**
  - 9 tests displayed
  - Tests grouped (Posterior Chain, Hip Flexors, etc.)
  - Sit-and-Reach visible
  - Apley Scratch Test visible

- [ ] **Body Composition Category**
  - Body Fat % and Lean Body Mass
  - Percentages calculated correctly

- [ ] **Core Category**
  - Plank Hold (time-based)
  - Side Plank Hold
  - Dead Bug (qualitative)

### Section 4: Horizontal Bar Charts
For each test, verify:

- [ ] **Test Name Display**
  - Name is clickable (should show video icon)
  - Font size readable
  - No text overflow

- [ ] **Progress Bar**
  - Bar width proportional to percentage
  - Color matches percentage range
  - Bar rounded with shadow

- [ ] **Values Display**
  - Shows actual value (e.g., "295 lbs")
  - Shows goal value (e.g., "/ 323 lbs")
  - Percentage shows correctly

- [ ] **Video Links**
  - Hover over test name shows description tooltip
  - Click test name opens YouTube video in new tab
  - Video URL is correct for exercise

- [ ] **Notes Display**
  - If notes exist, they display below test
  - Notes styling is distinct from main chart

### Section 5: Compliance Score Component
- [ ] **Score Circle**
  - Large, centered circle
  - Shows percentage (0-100%)
  - Border color matches performance level

- [ ] **Status Label**
  - Shows "Below Goal" if < 50%
  - Shows "Below Target" if 50-90%
  - Shows "Near Goal" if 90-100%
  - Shows "Goal Met" if = 100%
  - Shows "Exceeded Goal" if > 100%

- [ ] **Category Score Display**
  - Shows on category pages
  - Title says "[Category] Category Score"

### Section 6: Color Coding Verification

Test specific examples from male data (John Doe, 185 lbs):

- [ ] **Red (< 50%) - None expected**
  - If found, verify percentage is < 50%

- [ ] **Yellow (50-90%)**
  - Endurance: 2000m Row 385s / 420s goal = 91.6% → Should be Lime
  - Or find any 50-90% test

- [ ] **Lime (90-100%)**
  - Strength: Trap Bar 295 / 323.75 = 91% → LIME ✓
  - Look for similar percentages

- [ ] **Green (= 100%)**
  - Should show rarely
  - Status label shows "Goal Met"

- [ ] **Blue (> 100%)**
  - Strength: Bench 185 / 185 = 100% → GREEN (exactly 100%)
  - Other tests exceeding 100%

### Section 7: Calculations Verification

Using male example (185 lbs bodyweight):

- [ ] **Strength Goals (Bodyweight-based)**
  - Trap Bar Deadlift: 185 × 1.75 = 323.75 lbs ✓
  - Bench Press: 185 × 1.0 = 185 lbs ✓
  - Squat: 185 × 1.5 = 277.5 lbs ✓

- [ ] **Time-Based (Lower is Better)**
  - 2000m Row: goal 420s, actual 385s = (420/385) × 100 = 109% ✓
  - T-Test: goal 10s, actual 9.8s = (10/9.8) × 100 = 102% ✓

- [ ] **Gender-Specific Goals**
  - Load female data
  - Female Bench Press: 145 × 0.65 = 94.25 lbs
  - Compare with male: 185 × 1.0 = 185 lbs
  - Female goal should be lower ✓

- [ ] **Category Score Averaging**
  - Average of all tests in category
  - Should be between min and max test percentages

### Section 8: Picture Comparison Feature
- [ ] **Open Picture Comparison Page**
  - Click "Picture Comparison" in nav
  - Page loads correctly

- [ ] **Upload Left Image**
  - Click left upload zone
  - Select image file
  - Image displays
  - Default label: "Before"

- [ ] **Upload Right Image**
  - Click right upload zone
  - Select image file
  - Image displays
  - Default label: "After"

- [ ] **Customize Labels**
  - Edit left label to custom text
  - Edit right label to custom text
  - Labels update instantly

- [ ] **Clear Individual Image**
  - Click X on left image
  - Left image clears
  - Right image remains

- [ ] **Clear All Button**
  - Upload both images
  - Click "Clear All"
  - Both images clear
  - Labels reset to default

- [ ] **Side-by-Side Display**
  - Images displayed at equal width
  - Images maintain aspect ratio
  - Images visible on all screen sizes

### Section 9: Navigation & UI
- [ ] **Header**
  - Logo displays correctly
  - Subtitle visible
  - Header styling consistent

- [ ] **Navigation Bar**
  - "Dashboard" button available when data loaded
  - "Picture Comparison" button available
  - "Load New Results" button works
  - Active button highlighted

- [ ] **Back Button on Category Page**
  - Click "Back to Dashboard" button
  - Returns to dashboard
  - Data persists

- [ ] **Responsive Design (Mobile)**
  - Resize browser to 768px or less
  - Layout stacks vertically
  - Cards full width
  - Text remains readable
  - Buttons still clickable

- [ ] **Responsive Design (Tablet)**
  - Resize to 1024px
  - 2-column layout
  - All content visible without scrolling horizontally

- [ ] **Responsive Design (Desktop)**
  - Resize to 1400px+
  - 3-column layout (categories grid)
  - All content visible and well-spaced

### Section 10: Performance & Loading
- [ ] **Initial Load Speed**
  - Page loads in < 2 seconds
  - Dev tools shows < 200KB total
  - JS bundle: 50KB gzipped
  - CSS bundle: 4KB gzipped

- [ ] **Example Data Load Speed**
  - Clicking example data loads in < 500ms
  - No noticeable lag when switching categories
  - Scrolling is smooth

- [ ] **No Console Errors**
  - Open browser dev tools (F12)
  - Check Console tab
  - No error messages
  - No warnings (except npm warnings)

- [ ] **No Network Errors**
  - Check Network tab
  - All resources load successfully
  - data/*.json files load from /health-display/data/

---

## 🎯 Critical Tests (Highest Priority)

1. ✅ Load male example data
2. ✅ Verify dashboard displays
3. ✅ Click "Strength" category
4. ✅ Verify color coding on bar charts
5. ✅ Click a test name to watch video
6. ✅ Verify percentage calculations
7. ✅ Load female example data
8. ✅ Verify different goal values
9. ✅ Test picture comparison upload
10. ✅ Test responsive design (resize browser)

---

## 📝 Known Test Data Values

### Male Example (John Doe, 35 yrs, 185 lbs)
- Overall Score: Should be ~87%
- Strength tests all green/lime (above 90%)
- Endurance VO2 Max: 52 ml/kg/min = high percentage
- Some stamina tests at or above goal

### Female Example (Sarah Johnson, 32 yrs, 145 lbs)
- Overall Score: Should be ~81%
- Female-specific goals lower than male
- Body weight 145 lbs used in calculations
- Different compliance percentages expected

---

## 🚨 Troubleshooting

If you encounter issues:

1. **Blank Page** → Check browser console (F12), look for errors
2. **Data Won't Load** → Verify data/*.json files are in public/data/ folder
3. **Videos Won't Play** → Check YouTube URLs in tests.json
4. **Wrong Percentages** → Verify formula calculations in calculations.js
5. **Wrong Colors** → Check color ranges in getColorForPercentage()

---

## ✅ Sign-Off Checklist

When all tests pass:

- [ ] Data loading works (file, text, examples)
- [ ] Dashboard displays with correct scores
- [ ] All 10 categories visible and clickable
- [ ] Color coding 100% accurate
- [ ] Calculations verified
- [ ] Video links work
- [ ] Picture comparison functional
- [ ] Responsive on all sizes
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Ready for GitHub Pages deployment

**Status**: Ready to proceed with GitHub Pages deployment when tests complete!

---

**Test Date**: 2026-08-03  
**Application Version**: 1.0  
**Browser**: Chrome/Firefox/Safari recommended
