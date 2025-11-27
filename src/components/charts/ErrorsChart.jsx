/**
 * ErrorsChart Component
 * Displays a stacked area chart showing daily errors grouped by error type
 * Uses Recharts library for visualization
 */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function ErrorsChart({ data }) {
  /**
   * Transform data for the chart
   * Converts nested error objects into flat structure
   */
  const chartData = data.map(day => ({
    date: day.date,
    '404 Not Found': day.errors['404 Not Found'] || 0,
    '500 Server Error': day.errors['500 Server Error'] || 0,
    '403 Forbidden': day.errors['403 Forbidden'] || 0,
    '401 Unauthorized': day.errors['401 Unauthorized'] || 0
  }))

  /**
   * Custom tooltip to display error information
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const total = payload.reduce((sum, entry) => sum + entry.value, 0)
      
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '12px',
          border: '2px solid #008000',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#008000', marginBottom: '8px' }}>
            {label}
          </p>
          {payload.reverse().map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '14px' }}>
              {entry.name}: <strong>{entry.value}</strong>
            </p>
          ))}
          <p style={{ margin: '8px 0 0 0', paddingTop: '8px', borderTop: '1px solid #e0e0e0', fontWeight: 'bold' }}>
            Total: {total}
          </p>
        </div>
      )
    }
    return null
  }

  /**
   * Error type color palette
   */
  const errorColors = {
    '404 Not Found': '#d32f2f',
    '500 Server Error': '#f57c00',
    '403 Forbidden': '#1976d2',
    '401 Unauthorized': '#7b1fa2'
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <defs>
          {/* Gradient definitions for each error type */}
          <linearGradient id="color404" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={errorColors['404 Not Found']} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={errorColors['404 Not Found']} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="color500" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={errorColors['500 Server Error']} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={errorColors['500 Server Error']} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="color403" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={errorColors['403 Forbidden']} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={errorColors['403 Forbidden']} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="color401" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={errorColors['401 Unauthorized']} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={errorColors['401 Unauthorized']} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#757575' }}
          tickLine={{ stroke: '#757575' }}
        />
        <YAxis
          tick={{ fill: '#757575' }}
          tickLine={{ stroke: '#757575' }}
          label={{ value: 'Number of Errors', angle: -90, position: 'insideLeft', fill: '#757575' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="square"
        />
        
        {/* Stacked areas for each error type */}
        <Area
          type="monotone"
          dataKey="404 Not Found"
          stackId="1"
          stroke={errorColors['404 Not Found']}
          fill="url(#color404)"
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="500 Server Error"
          stackId="1"
          stroke={errorColors['500 Server Error']}
          fill="url(#color500)"
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="403 Forbidden"
          stackId="1"
          stroke={errorColors['403 Forbidden']}
          fill="url(#color403)"
          animationDuration={1000}
        />
        <Area
          type="monotone"
          dataKey="401 Unauthorized"
          stackId="1"
          stroke={errorColors['401 Unauthorized']}
          fill="url(#color401)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default ErrorsChart

