import axios from "axios";

export const listPortfolios = async (token) => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/portfolio/list/', {
        headers: {
          'Authorization': `Token ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

export const updatePortfolio = async (portfolioId, token, data) => {
    try {
        const response = await axios.put(`http://127.0.0.1:8000/portfolio/${portfolioId}/update`, data, {
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

export const deletePortfolio = async (portfolioId, token) => {
    try {
        const response = await axios.delete(`http://127.0.0.1:8000/portfolio/${portfolioId}/delete`, {
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

export const portfolioPerformance = async (token) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:8000/portfolio/performance`,
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createPortfolio = async (data, token) => {
    try {
        const response = await axios.post('http://127.0.0.1:8000/portfolio/create/', data, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const recommendPortfolio = async (portfolioId, token) => {
    try {
        console.log
        const response = await axios.get(`http://127.0.0.1:8000/portfolio/${portfolioId}/recommend`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response);
        return response.data;
    } catch (error) {
        throw error;
    }
};