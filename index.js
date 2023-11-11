import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from "url";
import { signUp } from './controllers/auth.js';
import { createPost } from './controllers/posts.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import postsRoutes from './routes/posts.js';
import { verifyToken } from './middleware/auth.js';

//Middleware
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));


//File Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

//Routes
const upload = multer({ storage });

//SignUp Route
app.use('/auth/signUp', upload.single('picture'), signUp);

//SignIn Route
app.use('/auth', authRoutes);

//Users Routes
app.use('/user', usersRoutes);

//Posts Routes
app.use('/posts', verifyToken, upload.single("picture"), createPost);
app.use('/posts', postsRoutes);

//Connect to MongoDB
mongoose.connect(process.env.MONGODB_ACCESS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(process.env.PORT, () => {
        console.info(`Database connected and server running on port http://localhost:${process.env.PORT}`);
    });
}).catch((error) => {
    console.error('Error connecting to the database', error);
});

