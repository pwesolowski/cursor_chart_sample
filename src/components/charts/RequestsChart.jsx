/**
 * RequestsChart Component
 * Displays a bar chart showing daily request counts
 * Uses Recharts library for visualization
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

function RequestsChart({ data }) {
  /**
   * Custom tooltip to display request information
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '2px solid #008000',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#008000' }}>
            {label}
          </p>
          <p style={{ margin: '5px 0 0 0', color: '#333' }}>
            Requests: <strong>{payload[0].value.toLocaleString()}</strong>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#757575' }}
          tickLine={{ stroke: '#757575' }}
        />
        <YAxis
          tick={{ fill: '#757575' }}
          tickLine={{ stroke: '#757575' }}
          label={{ value: 'Number of Requests', angle: -90, position: 'insideLeft', fill: '#757575' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="square"
        />
        <Bar
          dataKey="count"
          name="Daily Requests"
          fill="#008000"
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RequestsChart

