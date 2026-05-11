import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from "axios"

function App() {

  const [Notes, setNotes] = useState([])


  function fetchNotes(){
      axios.get("http://localhost:3000/api/notes")
      .then((res)=>{
      setNotes(res.data.notes)
    })
  }
  useEffect(()=>{
    fetchNotes()
  },[])

  function handleSubmit(e){
    e.preventDefault()
    const {title,description}=e.target.elements
    console.log(title.value,description.value)

    axios.post("http://localhost:3000/api/notes",{
      title:title.value,
      description:description.value
    })
    .then(res=>{
      console.log(res.data)

      fetchNotes()
    })


  }

  function handleDeleteNote(noteId){
    axios.delete("http://localhost:3000/api/notes/"+noteId)
    .then(res=>{
      console.log(res.data)

      fetchNotes()
    })
  }

  return (
    <>
    <form className='note-create-form' onSubmit={handleSubmit}>
      <input name="title" type='text' placeholder='Enter Title'></input>
      <input name='description' type='text' placeholder='Enter Description'></input>
      <button>Create Note</button>
    </form>

    <div className='notes'>{
      
      Notes.map(note=>{
          return  <div className="note">
                    <h1>{note.title}</h1>
                    <p>{note.description}</p>
                    <button onClick={()=>{
                      handleDeleteNote(note._id)
                    }}>Delete</button>
                  </div>
      })
      }
      </div>
      
    </>
  )
}

export default App
