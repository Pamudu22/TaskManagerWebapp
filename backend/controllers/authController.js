import User from '../models/User.js';
import { sendOtpEmail } from '../utils/sendOtp.js';


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

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (!user.otp || !user.otpExpiresAt) {
    console.log('No OTP or expiry on user:', user);
    return res.status(400).json({ message: 'OTP not found. Request a new one.' });
  }

  if (user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: 'OTP expired' });
  }

  // OTP is valid — clear it
  user.otp = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({ message: 'OTP verified successfully' });
};
