import { useState, useRef } from 'react'
import './PictureComparison.css'

function PictureComparison() {
  const [leftImage, setLeftImage] = useState(null)
  const [rightImage, setRightImage] = useState(null)
  const [leftLabel, setLeftLabel] = useState('Before')
  const [rightLabel, setRightLabel] = useState('After')
  const leftInputRef = useRef(null)
  const rightInputRef = useRef(null)

  const handleImageSelect = (side, event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      if (side === 'left') {
        setLeftImage(e.target.result)
      } else {
        setRightImage(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleClearImage = (side) => {
    if (side === 'left') {
      setLeftImage(null)
      if (leftInputRef.current) leftInputRef.current.value = ''
    } else {
      setRightImage(null)
      if (rightInputRef.current) rightInputRef.current.value = ''
    }
  }

  const handleClearAll = () => {
    setLeftImage(null)
    setRightImage(null)
    setLeftLabel('Before')
    setRightLabel('After')
    if (leftInputRef.current) leftInputRef.current.value = ''
    if (rightInputRef.current) rightInputRef.current.value = ''
  }

  return (
    <div className="picture-comparison">
      <div className="comparison-header">
        <h2>Picture Comparison</h2>
        <p>Upload two images to compare side-by-side</p>
      </div>

      {(leftImage || rightImage) && (
        <button className="clear-all-btn" onClick={handleClearAll}>
          Clear All
        </button>
      )}

      <div className="comparison-container">
        {/* Left Image */}
        <div className="image-section">
          <div className="image-header">
            <input
              type="text"
              value={leftLabel}
              onChange={(e) => setLeftLabel(e.target.value)}
              className="label-input"
              placeholder="Image label"
            />
            {leftImage && (
              <button
                className="remove-btn"
                onClick={() => handleClearImage('left')}
              >
                ✕
              </button>
            )}
          </div>

          {leftImage ? (
            <div className="image-wrapper">
              <img src={leftImage} alt={leftLabel} className="comparison-image" />
            </div>
          ) : (
            <label className="image-upload-zone">
              <input
                ref={leftInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect('left', e)}
                className="file-input"
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📸</span>
                <p>Click to upload or drag image</p>
                <span className="upload-hint">PNG, JPG, GIF up to 10MB</span>
              </div>
            </label>
          )}
        </div>

        {/* Right Image */}
        <div className="image-section">
          <div className="image-header">
            <input
              type="text"
              value={rightLabel}
              onChange={(e) => setRightLabel(e.target.value)}
              className="label-input"
              placeholder="Image label"
            />
            {rightImage && (
              <button
                className="remove-btn"
                onClick={() => handleClearImage('right')}
              >
                ✕
              </button>
            )}
          </div>

          {rightImage ? (
            <div className="image-wrapper">
              <img src={rightImage} alt={rightLabel} className="comparison-image" />
            </div>
          ) : (
            <label className="image-upload-zone">
              <input
                ref={rightInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageSelect('right', e)}
                className="file-input"
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📸</span>
                <p>Click to upload or drag image</p>
                <span className="upload-hint">PNG, JPG, GIF up to 10MB</span>
              </div>
            </label>
          )}
        </div>
      </div>

      {!leftImage && !rightImage && (
        <div className="comparison-tips">
          <h3>Comparison Tips</h3>
          <ul>
            <li>Upload a "before" photo on the left</li>
            <li>Upload an "after" photo on the right</li>
            <li>Use consistent lighting and angles for best results</li>
            <li>Edit the labels to identify your images</li>
            <li>Images are displayed at equal size for easy comparison</li>
            <li>No images are saved or uploaded to any server</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default PictureComparison
