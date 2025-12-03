/**
 * ServiceHourlyChart Component
 * Displays hourly call volume as an area chart
 * Shows traffic patterns throughout the day
 */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function ServiceHourlyChart({ data, title = "Hourly Call Volume" }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>{title}</h3>
        <p className="no-data">No data available</p>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart 
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour"
            tick={{ fontSize: 12 }}
            interval={1}
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
            formatter={(value) => [value.toLocaleString(), 'Calls']}
          />
          <Area 
            type="monotone"
            dataKey="calls" 
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorCalls)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ServiceHourlyChart

