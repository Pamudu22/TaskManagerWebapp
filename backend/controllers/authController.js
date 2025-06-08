import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendOtp.js';
import { generateToken } from './user_controller.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Direct login using Google token
export const googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Missing Google token' });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: '', // Not used for Google auth
        isActive: true,
        isVerified: true,
        authType: 'google',
        avatar: picture,
        role: 'user',
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        authType: user.authType,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error('Google login error:', err.message);
    res.status(401).json({ message: 'Google login failed' });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        $set: {
          otp,
          otpExpiresAt: expiresAt,
          email: email.toLowerCase()
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Generated OTP for ${email}: ${otp}`);

    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user || !user.otp || !user.otpExpiresAt) {
    return res.status(400).json({ message: 'OTP not found. Request a new one.' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  // Clear OTP and activate account
  user.otp = null;
  user.otpExpiresAt = null;
  user.isActive = true;
  await user.save();

  const token = generateToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 3600000,
  });

  res.status(200).json({
    message: 'Signup complete and OTP verified',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      authType: user.authType,
    },
  });
};

