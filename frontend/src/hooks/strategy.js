import axios from "axios";

export const listStrategies = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/strategy/list/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  export const updateStrategy = async (strategyId, token, data) => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/strategy/${strategyId}/update/`, data, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteStrategy = async (strategyId, token) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/strategy/${strategyId}/delete/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}