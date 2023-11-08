import express from 'express';
import {
    getUser,
    getUserFriends,
    removeUserFriend
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//READ endpoints
router.get('/:id', verifyToken, getUser);
router.get('/:id/friends', verifyToken, getUserFriends);

//UPDATE endpoint
router.patch('/:id/:friendId', verifyToken, removeUserFriend);

export default router;