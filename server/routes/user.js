import express from 'express';
// import { registerController, loginController, getAllUser } from '../../controllers/user.js';
import { registerController,loginController, getAllUser, getUserById,updateUser ,getUserByEmail} from '../controllers/user.js';
import { verifyToken } from '../middleware/jwt.js';
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '/images');
    },
    filename: (req, file, cb) => {
        cb(null, req.body.email + '_' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const router = express.Router();
router.get("/getUserByEmail/:email",getUserByEmail)

router.post("/updateUser",verifyToken,updateUser)
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Endpoint to register a new user.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User object
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       '201':
 *         description: User registered successfully
 *       '500':
 *         description: Internal server error
 */
router.post('/register', registerController);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: User login
 *     description: Endpoint for user login.
 *     parameters:
 *       - name: body
 *         in: body
 *         description: User credentials
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             password:
 *               type: string
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 */
router.post('/login', loginController);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Endpoint to retrieve all users.
 *     responses:
 *       '200':
 *         description: A list of users
 *       '500':
 *         description: Internal server error
 */
router.get('/users', getAllUser);

router.get('/users/:id', getUserById);

export default router;
