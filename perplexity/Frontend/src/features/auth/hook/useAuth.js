import { useDispatch } from "react-redux";
import { register, login, getMe } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

function getApiErrorMessage(error, fallbackMessage) {
    return (
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        fallbackMessage
    );
}

export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({ email, username, password })
            return { success: true, data }
        } catch (error) {
            dispatch(setError(getApiErrorMessage(error, "Registration failed")))
            return { success: false }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            return { success: true, data }
        } catch (err) {
            dispatch(setError(getApiErrorMessage(err, "Login failed")))
            return { success: false }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            if (err.response?.status !== 401) {
                dispatch(setError(getApiErrorMessage(err, "Failed to fetch user data")))
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
    }

}
