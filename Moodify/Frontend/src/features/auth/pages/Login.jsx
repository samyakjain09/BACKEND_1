import React from 'react'
import "../style/login.scss"
const Login = () => {
  return (
    <main className="login-page">
      <div className="form-container">
        <h1>Login</h1>
        <form>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='email' id='email' name='email' required></input>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' id='password' name='password' required></input>
          </div>
          <button type='submit'>Login</button>

        </form>
      </div>
    </main>
  )
}

export default Login