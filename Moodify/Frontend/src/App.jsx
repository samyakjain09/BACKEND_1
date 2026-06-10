import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FaceDetector } from '@mediapipe/tasks-vision'
import FaceExpression from './features/Expressions/components/FaceExpression'

function App() {
  const [count, setCount] = useState(0)

  return (
    <FaceExpression/>
  )
}

export default App
