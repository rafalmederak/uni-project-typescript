import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<{ token: string; refreshToken: string }> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();
    const refreshToken = userCredential.user.refreshToken;
    return { token, refreshToken };
  }

  static async refreshToken(): Promise<string> {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken(true);
      return token;
    } else {
      throw new Error('No current user');
    }
  }
}

export default AuthService;
