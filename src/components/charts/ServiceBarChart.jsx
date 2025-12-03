/**
 * ServiceBarChart Component
 * Reusable bar chart for service analytics
 * Used for IT systems, services, operations, etc.
 */
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ServiceBarChart({ data, title, dataKey = "calls", nameKey = "name", color = "#10b981", maxItems = 10 }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <p className="no-data">No data available</p>
      </div>
    )
  }

  // Take top N items for display
  const displayData = data.slice(0, maxItems)

  // Truncate long names for display
  const formattedData = displayData.map(item => ({
    ...item,
    displayName: item[nameKey].length > 30 
      ? item[nameKey].substring(0, 27) + '...' 
      : item[nameKey]
  }))

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={formattedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="displayName"
            angle={-45}
            textAnchor="end"
            height={150}
            interval={0}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            label={{ value: 'Calls', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '10px'
            }}
            formatter={(value, name, props) => [
              value.toLocaleString(),
              props.payload[nameKey]
            ]}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar 
            dataKey={dataKey} 
            fill={color}
            name="Calls"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ServiceBarChart

