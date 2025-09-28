import React from 'react'
import ElectricityMap from './ElectricityMap'
import './index.css'
import ChatbotWidget from './components/ChatbotWidget'

function App() {
  return (
    <div className="App min-h-screen" style={{ background: 'var(--background-gradient)' }}>
      <ElectricityMap />
      <ChatbotWidget />
    </div>
  )
}

export default App