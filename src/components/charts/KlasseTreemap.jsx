/**
 * KlasseTreemap Component
 * Displays treemap for hierarchical KleEmne classification data
 * Shows the classification structure (e.g., 01 -> 01.00 -> 01.00.05)
 * Each parent node contains all its child classifications
 * Features: Click on nodes to drill down, breadcrumb navigation to go back
 */
import { useState } from 'react'
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

// Color palette for treemap cells - organized by depth levels
const COLOR_SCHEMES = {
  level1: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'],
  level2: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#22d3ee', '#a3e635'],
  level3: ['#93c5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#c4b5fd', '#f9a8d4', '#67e8f9', '#bef264'],
}

function KlasseTreemap({ data, title }) {
  // State to track current view (drill-down navigation)
  const [currentNode, setCurrentNode] = useState(data)
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'All', node: data }])

  if (!data || !data.children || data.children.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <p className="no-data">No data available</p>
      </div>
    )
  }

  // Handle node click to drill down
  const handleNodeClick = (node) => {
    // Only drill down if the node has children
    if (node.children && node.children.length > 0) {
      setCurrentNode(node)
      setBreadcrumbs([...breadcrumbs, { name: node.name, node }])
    }
  }

  // Handle breadcrumb click to navigate back
  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1)
    setBreadcrumbs(newBreadcrumbs)
    setCurrentNode(newBreadcrumbs[newBreadcrumbs.length - 1].node)
  }

  // Reset to root
  const handleReset = () => {
    setCurrentNode(data)
    setBreadcrumbs([{ name: 'All', node: data }])
  }

  // Custom content renderer for treemap cells
  const CustomContent = (props) => {
    const { x, y, width, height, name, value, depth, index, children, root } = props

    // Only show label if cell is large enough
    const showLabel = width > 50 && height > 25
    const showValue = width > 80 && height > 40

    // Determine color based on depth level
    let backgroundColor
    if (depth === 1) {
      backgroundColor = COLOR_SCHEMES.level1[index % COLOR_SCHEMES.level1.length]
    } else if (depth === 2) {
      backgroundColor = COLOR_SCHEMES.level2[index % COLOR_SCHEMES.level2.length]
    } else {
      backgroundColor = COLOR_SCHEMES.level3[index % COLOR_SCHEMES.level3.length]
    }

    // Calculate font size based on cell size
    const fontSize = Math.min(width / 8, height / 2.5, 13)
    const valueFontSize = fontSize * 0.75

    // Check if this is a parent node (has children)
    const isParent = children && children.length > 0

    return (
      <g
        onClick={() => isParent && handleNodeClick(root)}
        style={{ cursor: isParent ? 'pointer' : 'default' }}
      >
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            fill: backgroundColor,
            stroke: '#fff',
            strokeWidth: depth === 1 ? 3 : 2,
            strokeOpacity: 1,
          }}
        />
        {/* Hover effect overlay */}
        {isParent && (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            style={{
              fill: '#000',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
            className="treemap-hover-overlay"
          />
        )}
        {showLabel && (
          <>
            <text
              x={x + width / 2}
              y={showValue ? y + height / 2 - valueFontSize / 2 : y + height / 2 + fontSize / 3}
              textAnchor="middle"
              fill="#fff"
              fontSize={fontSize}
              fontWeight={isParent ? "700" : "600"}
              style={{ pointerEvents: 'none' }}
            >
              {name}
            </text>
            {showValue && (
              <text
                x={x + width / 2}
                y={y + height / 2 + fontSize}
                textAnchor="middle"
                fill="#fff"
                fontSize={valueFontSize}
                opacity={0.95}
                style={{ pointerEvents: 'none' }}
              >
                {value ? value.toLocaleString() : ''}
              </text>
            )}
            {isParent && width > 100 && height > 50 && (
              <>
                <text
                  x={x + width / 2}
                  y={y + height / 2 + fontSize + valueFontSize + 2}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={valueFontSize * 0.8}
                  opacity={0.8}
                  style={{ pointerEvents: 'none' }}
                >
                  ({children.length} sub-items)
                </text>
                <text
                  x={x + width / 2}
                  y={y + height / 2 + fontSize + valueFontSize + 12}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={valueFontSize * 0.7}
                  opacity={0.9}
                  style={{ pointerEvents: 'none' }}
                >
                  ▼ Click to explore
                </text>
              </>
            )}
          </>
        )}
      </g>
    )
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const hasChildren = item.children && item.children.length > 0
      
      return (
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
            {item.name}
          </p>
          {item.value > 0 && (
            <p style={{ margin: '5px 0 0 0', color: '#059669', fontWeight: '600' }}>
              Count: {item.value.toLocaleString()}
            </p>
          )}
          {hasChildren && (
            <p style={{ margin: '5px 0 0 0', color: '#6b7280', fontSize: '12px' }}>
              Contains {item.children.length} sub-classification{item.children.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Get current data to display
  const displayData = currentNode.children || []
  const isAtRoot = breadcrumbs.length === 1

  return (
    <div className="chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {!isAtRoot && (
          <button 
            onClick={handleReset}
            className="btn btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>↺</span> Reset View
          </button>
        )}
      </div>

      {/* Breadcrumb Navigation */}
      <div className="treemap-breadcrumbs">
        {breadcrumbs.map((crumb, index) => (
          <span key={index}>
            <button
              onClick={() => handleBreadcrumbClick(index)}
              className="breadcrumb-item"
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && <span className="breadcrumb-separator"> / </span>}
          </span>
        ))}
      </div>

      {/* Current view info */}
      {!isAtRoot && (
        <div className="treemap-info">
          <p>
            <strong>{currentNode.name}</strong> - {currentNode.value?.toLocaleString()} total items
            {displayData.length > 0 && ` across ${displayData.length} sub-categories`}
          </p>
        </div>
      )}

      <ResponsiveContainer width="100%" height={600}>
        <Treemap
          data={displayData}
          dataKey="value"
          stroke="#fff"
          fill="#3b82f6"
          content={<CustomContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>

      <div className="chart-legend">
        <p className="chart-description">
          <strong>💡 Interactive:</strong> Click on any parent category to zoom in and explore its sub-categories.
          <br />
          Hierarchical classification structure where each parent category contains all its sub-categories.
          <br />
          <strong>Example:</strong> "01.00" contains "01.00.00", "01.00.05", etc.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '10px', fontSize: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: COLOR_SCHEMES.level1[0], border: '2px solid white' }}></div>
            <span>Level 1 (e.g., "01")</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: COLOR_SCHEMES.level2[0], border: '2px solid white' }}></div>
            <span>Level 2 (e.g., "01.00")</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '15px', height: '15px', backgroundColor: COLOR_SCHEMES.level3[0], border: '2px solid white' }}></div>
            <span>Level 3 (e.g., "01.00.05")</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KlasseTreemap

