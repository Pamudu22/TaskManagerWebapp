
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// Environment variables

import { JWT_SECRET, SALT_ROUNDS } from '../config/config.js';


// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1h' });
};
  
// Get user by ID
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all users
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({ isActive: true }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error: error.message });
  }
};
 



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    

    // 1. Check if user exists and include password explicitly
    const user = await User.findOne({ email }).select('+password');
    

    if (!user || !user.password) {
      
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user.isActive) {
        return res.status(403).json({ message: 'Account is deactivated' });
        }


    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate token
    const token = generateToken(user._id);

    // 4. Send response
        res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true only in production with HTTPS
        sameSite: 'Lax',
        maxAge: 3600000, // 1 hour
        });

        res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        }
        });


  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};




//Signup


export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const emailNormalized = email.toLowerCase();

    const existingUser = await User.findOne({ email: emailNormalized });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      name,
      email: emailNormalized,
      password: hashedPassword,
      authType: 'manual',
      role: 'user',

    });

    await user.save();

    const token = generateToken(user._id);

                res.cookie('token', token, {
                httpOnly: true,
                secure: false, // Set to true only in production with HTTPS
                sameSite: 'Lax',
                maxAge: 3600000,
            })
            .status(201)
            .json({
                message: 'Signup successful',
                user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                authType: user.authType,
                },
            });

  } catch (error) {
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
};

// Deactivate user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
