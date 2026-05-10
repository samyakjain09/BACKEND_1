import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios"

function App() {

  const [Notes, setNotes] = useState([
    {
      title:"test title",
      description:"test description"
    },
    {
      title:"test title",
      description:"test description"
    },
    {
      title:"test title",
      description:"test description"
    },
    {
      title:"test title",
      description:"test description"
    }

  ])

  axios.get("http://localhost:3000/api/notes")
  .then((res)=>{
    setNotes(res.data.notes)
  })

  return (
    <>
    <div className='notes'>{
      
      Notes.map(note=>{
          return  <div className="note">
                    <h1>{note.title}</h1>
                    <p>{note.description}</p>
                  </div>
      })
      }
      </div>
      
    </>
  )
}

export default App
