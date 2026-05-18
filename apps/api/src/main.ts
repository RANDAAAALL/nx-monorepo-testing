import express from 'express';
import cookieParser from 'cookie-parser';
import { AuthService } from '@org/api-auth';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

const app = express();
const authService = new AuthService();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS config
app.use((req, res, next) => {
  const allowedOriginsString = process.env.CORS_ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsString
    .split(',')
    .map((url) => url.trim());

  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  } else {
    next();
    return;
  }
});

app.get('/', (_, res) => {
  res.send({ message: 'Hello API' });
});

// me route to get current user info
app.get('/api/me', async (req, res) => {
  const token = req.cookies.auth_token;

  if (!token) {
    res.status(401).send('Unauthorized');
    return;
  }

  // decode the token
  try {
    const username = Buffer.from(token, 'base64').toString('utf-8');
    const user = await authService.getUserByUsername(username);

    if (!user) {
      res.status(401).send('Invalid token');
      return;
    }

    res.json({ data: { username: user.username, role: 'admin' } });
    return;
  } catch (err) {
    res.status(401).send('Invalid token format');
    return;
  }
});

// registration route
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required',
        data: null,
      });
      return;
    }

    const result = await authService.register(username, password);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: result.message,
        data: null,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: result.message,
      data: result.user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
      data: null,
    });
    return;
  }
});

// login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username and password are required',
        data: null,
      });
      return;
    }

    const result = await authService.login(username, password);

    if (!result.success || !result.user) {
      res.status(401).json({
        success: false,
        message: result.message,
        data: null,
      });
      return;
    }

    // create a simple token base64 of username
    const token = Buffer.from(result.user.username).toString('base64');

    // set httponly cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day expr
    });

    res.json({
      success: true,
      message: result.message,
      data: result.user,
    });
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      data: null,
    });
    return;
  }
});

// logout route
app.post('/api/logout', (_, res) => {
  res.clearCookie('auth_token');
  res.json({ success: true, message: 'Logged out successfully' });
  return;
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
