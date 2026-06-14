import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router'
const Protected = ({children}) => {

    const {user,loading}=useAuth()
    const navigate=useNavigate()

    if(loading) {
        return <div>Loading...</div>
    }
    
    if(!user && !loading) {
        return <Navigate to="/login"/>
    }
    
  return children
}

export default Protected