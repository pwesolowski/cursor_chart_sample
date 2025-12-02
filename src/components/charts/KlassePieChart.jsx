/**
 * KlassePieChart Component
 * Displays pie chart for grouped klasse data
 * Used for Fremdrift (Progress) distribution visualization
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

// Color palette for pie slices
const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

function KlassePieChart({ data, title, dataKey = "count", nameKey = "name" }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <p className="no-data">No data available</p>
      </div>
    )
  }

  // Custom label to show percentage
  const renderLabel = (entry) => {
    const total = data.reduce((sum, item) => sum + item[dataKey], 0)
    const percent = ((entry[dataKey] / total) * 100).toFixed(1)
    return `${percent}%`
  }

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={renderLabel}
            labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px'
            }}
            formatter={(value, name, props) => {
              const total = data.reduce((sum, item) => sum + item[dataKey], 0)
              const percent = ((value / total) * 100).toFixed(1)
              return [`${value} (${percent}%)`, name]
            }}
          />
          <Legend 
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ paddingTop: '20px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default KlassePieChart

