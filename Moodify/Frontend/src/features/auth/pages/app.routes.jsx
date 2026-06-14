import {createBrowserRouter} from 'react-router'
import Register from './Register'
import Login from './Login'
import Protected from '../component/protected'

export const router=createBrowserRouter([
    {
        path:"/",
        element:<Protected><h1>Home Page</h1></Protected>
    },
    {
        path:"/register",
        element:<Register/>
    },
    {
        path:"/login",
        element:<Login/>
    }
])