import axios from 'axios';

class AuthService {
  static async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post('http://localhost:3000/refreshToken', {
      refreshToken,
    });
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data.token;
  }
}

export default AuthService;
