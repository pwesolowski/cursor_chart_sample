/**
 * DateSelector Component
 * Dropdown selector for choosing which date's data to display
 * Lists all available dates from processed CSV files
 */
import './DateSelector.css'

function DateSelector({ dates, selectedDate, onDateChange }) {
  if (!dates || dates.length === 0) {
    return null
  }

  return (
    <div className="date-selector-container">
      <label htmlFor="date-select" className="date-selector-label">
        Select Date:
      </label>
      <select 
        id="date-select"
        className="date-selector"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
      >
        {dates.map((date) => (
          <option key={date} value={date}>
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </option>
        ))}
      </select>
    </div>
  )
}

export default DateSelector

