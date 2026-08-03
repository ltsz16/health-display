import { useState } from 'react'
import './DataLoader.css'

function DataLoader({ onDataLoaded }) {
  const [inputMethod, setInputMethod] = useState('file') // file or text
  const [jsonText, setJsonText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateResults = (data) => {
    if (!data.user || !data.results) {
      throw new Error('Invalid format: missing user or results field');
    }
    if (!data.user.gender || !data.user.bodyweight) {
      throw new Error('Invalid format: user must have gender and bodyweight');
    }
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('Invalid format: results must be a non-empty array');
    }
    return true;
  };

  const processResults = (data) => {
    validateResults(data);
    
    // Add user data to each result for easier access
    const enrichedResults = data.results.map(result => ({
      ...result,
      gender: data.user.gender,
      age: data.user.age,
      bodyweight: data.user.bodyweight,
      userName: data.user.name
    }));

    return {
      user: data.user,
      results: enrichedResults
    };
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const processedData = processResults(data);
      onDataLoaded(processedData);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteJson = () => {
    if (!jsonText.trim()) {
      setError('Please paste JSON data first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = JSON.parse(jsonText);
      const processedData = processResults(data);
      onDataLoaded(processedData);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadExample = async (exampleFile) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/data/${exampleFile}`);
      const data = await response.json();
      const processedData = processResults(data);
      onDataLoaded(processedData);
    } catch (err) {
      setError(`Error loading example: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-loader">
      <div className="loader-container">
        <h2>Load Fitness Assessment Results</h2>
        <p className="description">
          Upload your fitness test results in JSON format to view your health metrics
        </p>

        <div className="method-tabs">
          <button
            className={`tab-btn ${inputMethod === 'file' ? 'active' : ''}`}
            onClick={() => {
              setInputMethod('file');
              setError('');
            }}
          >
            📁 Upload File
          </button>
          <button
            className={`tab-btn ${inputMethod === 'text' ? 'active' : ''}`}
            onClick={() => {
              setInputMethod('text');
              setError('');
            }}
          >
            📋 Paste JSON
          </button>
        </div>

        <div className="loader-content">
          {inputMethod === 'file' && (
            <div className="file-upload-section">
              <label className="file-input-wrapper">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="file-input"
                />
                <span className="file-input-label">
                  {loading ? 'Processing...' : 'Choose JSON File'}
                </span>
              </label>
              <p className="file-help">
                Select a JSON file containing your fitness test results
              </p>
            </div>
          )}

          {inputMethod === 'text' && (
            <div className="text-input-section">
              <textarea
                className="json-textarea"
                placeholder="Paste your JSON results here..."
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                disabled={loading}
              />
              <button
                className="load-btn"
                onClick={handlePasteJson}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Load Results'}
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
          </div>
        )}

        <div className="examples-section">
          <h3>Try Example Data</h3>
          <p>Load sample results to explore the application:</p>
          <div className="example-buttons">
            <button
              className="example-btn male"
              onClick={() => handleLoadExample('example-results.json')}
              disabled={loading}
            >
              👨 Male (35 yrs, 185 lbs)
            </button>
            <button
              className="example-btn female"
              onClick={() => handleLoadExample('example-results-female.json')}
              disabled={loading}
            >
              👩 Female (32 yrs, 145 lbs)
            </button>
          </div>
        </div>

        <div className="format-help">
          <h3>JSON Format</h3>
          <pre>{`{
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
}`}</pre>
        </div>
      </div>
    </div>
  )
}

export default DataLoader
