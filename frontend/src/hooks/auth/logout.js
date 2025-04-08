import axios from 'axios'

export const logoutUser = async (token) => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/auth/logout/', {
      headers: {
        'Authorization': `Token ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}