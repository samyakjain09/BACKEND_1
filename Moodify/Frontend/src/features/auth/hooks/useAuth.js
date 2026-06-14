import { Login,Register,Logout,GetMe } from "../services/auth.api";
import { useContext } from "react";
import { AuthContext } from "../auth.context";

export const useAuth=()=>{
    const context=useContext(AuthContext)
    const {user,setUser,loading,setLoading}=context

    async function handleRegister({username,email,password}) {
        setLoading(true)
        const data=await Register({username,email,password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogin({username,email,password}) {
        setLoading(true)
        const data=await Login({username,email,password})
        setUser(data.user)
        setLoading(false)
    }

    async function handleGetMe() {
        setLoading(true)
        const data=await GetMe()
        setUser(data.user)
        setLoading(false)
    }

    async function handleLogout() {
        setLoading(true)
        const data=await Logout()
        setUser(null)
        setLoading(false)
    }

    return({
        user,loading,handleRegister,handleLogin,handleGetMe,handleLogout
    })
}