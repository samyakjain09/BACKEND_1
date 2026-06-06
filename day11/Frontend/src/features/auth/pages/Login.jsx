import React,{useState} from 'react'
import "../styles/form.scss"
import { Link } from 'react-router'
import axios from 'axios'

const login = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e){
    e.preventDefault()

    
  }


  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input 
          onInput={(e)=>{setUsername(e.target.value)}} 
          type="text" 
          name='username' 
          placeholder='Enter Your Username'/>
          <input 
          onInput={(e)=>{setPassword(e.target.value)}} 
          type='password' 
          name='password' 
          placeholder='Enter your Password'/>
          <button>Submit</button>
        </form>

        <p>Don't Have an account?  <Link className='toggleAuthForm' to="/register">Register</Link> </p>
      </div>
    </main>
  )
}

export default login