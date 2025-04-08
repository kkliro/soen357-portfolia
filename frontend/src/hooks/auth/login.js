import axios from 'axios'

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/auth/login/', {
      email,
      password,
    })
    return response.data
  } catch (error) {
    throw error
  }
}