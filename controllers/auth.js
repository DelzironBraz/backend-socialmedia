import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

export const signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                firstName,
                lastName,
                email,
                password: passwordHash,
                picturePath,
                friends,
                location,
                occupation,
                viewedProfile: Math.floor(Math.random() * 10000),
                impressions: Math.floor(Math.random() * 10000)
            }
        )

        const saveUser = await newUser.save();

        res.status(201).json(saveUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) res.status(404).json({ error: err.message });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) res.status(401).json({ error: err.message });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        delete user.password;

        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};