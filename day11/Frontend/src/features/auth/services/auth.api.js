import axios from 'axios'

export async function register(username,email,password){
    try{
        const response=await axios.post("http://localhost:3000/api/auth/register",{
            username,email,password
        },{withCredentials:true})
    }
    catch(err){
        throw err
    }
}