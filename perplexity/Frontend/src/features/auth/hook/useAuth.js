import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from '../services/auth.api.js'
import { setUser, setLoading, setError } from '../auth.slice.js'

export function useAuth() {
    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            dispatch(setUser(data?.user))
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registeration failed"))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Login failed"))
            return false
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            if (error.response?.status !== 401) {
                dispatch(setError(error.response?.data?.message || "Failed to fetch user data"))
            }
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleLogout() {
        try {
            await logout()
            dispatch(setUser(null))
        } catch (error) {
            console.error("Logout failed:", error)
            dispatch(setUser(null))
        }
    }


    return { handleRegister, handleLogin, handleGetMe, handleLogout }
}