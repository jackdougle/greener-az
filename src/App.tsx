import React from 'react'
import ElectricityMap from './ElectricityMap'
import './index.css'

function App() {
  return (
    <div className="App min-h-screen" style={{ background: 'var(--background-gradient)' }}>
      <ElectricityMap />
    </div>
  )
}

export default App