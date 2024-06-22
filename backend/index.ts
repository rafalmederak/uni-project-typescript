import express from 'express';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import cors from 'cors';

const app = express();
const port = 3000;

const tokenSecret = process.env.TOKEN_SECRET as string;
let refreshToken: string;

// Mock users
const users = [
  {
    id: '1',
    username: 'carlo.ancelotti',
    password: 'password1',
    role: 'admin',
  },
  {
    id: '2',
    username: 'jose.mourinho',
    password: 'password2',
    role: 'developer',
  },
  { id: '3', username: 'pep.guardiola', password: 'password3', role: 'devops' },
];

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World - simple api with JWT!');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!user) {
    return res.status(401).send('Invalid credentials');
  }
  const expTime = 60;
  const token = generateToken(user, expTime);
  refreshToken = generateToken(user, 60 * 60);
  res.status(200).send({ token, refreshToken });
});

app.post('/token', (req, res) => {
  const expTime = req.body.exp || 60;
  const token = generateToken(null, +expTime);
  refreshToken = generateToken(null, 60 * 60);
  res.status(200).send({ token, refreshToken });
});

app.post('/refreshToken', (req, res) => {
  const refreshTokenFromPost = req.body.refreshToken;
  if (refreshToken !== refreshTokenFromPost) {
    return res.status(400).send('Bad refresh token!');
  }
  const expTime = req.headers.exp || 60;
  const token = generateToken(null, +expTime);
  refreshToken = generateToken(null, 60 * 60);
  setTimeout(() => {
    res.status(200).send({ token, refreshToken });
  }, 3000);
});

app.get('/protected/:id/:delay?', verifyToken, (req, res) => {
  const id = req.params.id;
  const delay = req.params.delay ? +req.params.delay : 1000;
  setTimeout(() => {
    res.status(200).send(`{"message": "protected endpoint ${id}"}`);
  }, delay);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

function generateToken(user: any, expirationInSeconds: number) {
  const exp = Math.floor(Date.now() / 1000) + expirationInSeconds;
  const payload = user ? { exp, ...user } : { exp, foo: 'bar' };
  const token = jwt.sign(payload, tokenSecret, { algorithm: 'HS256' });
  return token;
}

function verifyToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) return res.sendStatus(403);

  jwt.verify(token, tokenSecret, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send(err.message);
    }
    req.user = user;
    next();
  });
}
