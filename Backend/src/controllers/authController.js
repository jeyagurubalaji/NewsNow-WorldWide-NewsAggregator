const authService = require('../services/authService');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

async function register(req, res, next) {
  try {
    const { fullName, email, password, preferredCountry } = req.body;

    if (!fullName || !fullName.trim()) throw new ApiError(400, 'Full name is required');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Email must be valid');
    if (!password || password.length < 6) throw new ApiError(400, 'Password must be at least 6 characters');

    const result = await authService.register({ fullName, email, password, preferredCountry });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, 'Email and password are required');

    const result = await authService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function googleAuth(req, res, next) {
  try {
    const { idToken } = req.body;
    if (!idToken) throw new ApiError(400, 'Google ID token is required');

    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );
    if (!verifyRes.ok) {
      throw new ApiError(401, 'Invalid Google token');
    }

    const payload = await verifyRes.json();
    if (env.googleClientId && payload.aud !== env.googleClientId) {
      throw new ApiError(401, 'Google token client ID mismatch');
    }

    const email = payload.email;
    const fullName = payload.name || email.split('@')[0];
    if (!email) throw new ApiError(400, 'Google account email not available');

    const result = await authService.loginOrRegisterWithGoogle(email, fullName);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, googleAuth };