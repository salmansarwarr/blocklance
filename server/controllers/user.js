import bcrypt from "bcrypt";
// import User from '../models/User';
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const registerController = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err.message,
            });
        }

        const userDetails = { ...req.body.details }; // Extract additional details from request body
        delete req.body.details; // Remove additional details from the main body

        const user = new User({
            ...req.body,
            details: userDetails // Assign additional details to the 'details' field
        });

        user.password = hash; // Set hashed password

        user.save()
            .then((result) => {
                res.status(201).json({
                    message: "User created Successfully",
                    user: result,
                });
            })
            .catch((err) => {
                res.status(500).json({
                    error: err.message,
                });
            });
    });
};

// Other controller functions remain the same, just ensure you handle the 'details' field appropriately in each function.


const loginController = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findOne({ email })
        .then((user) => {
            if (user) {
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    if (result) {
                        const token = jwt.sign(
                            { userId: user._id, email: user.email },
                            process.env.JWT_KEY || "backend king",
                        );
                        return res.status(200).json({
                            user,
                            token: token, // Send the token in response
                        });
                    } else {
                        return res.status(401).json({
                            message: "Login failed. Password doesn't match",
                        });
                    }
                });
            } else {
                return res.status(404).json({ message: "User not found" });
            }
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};

const getAllUser = (req, res, next) => {
    User.find()
        .then((users) => {
            // Map through users to extract details field
            const usersWithDetails = users.map(user => ({
                ...user._doc,
                details: user.details// Convert details to a plain JavaScript object
            }));
            res.status(200).json({
                users: usersWithDetails,
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error.message,
            });
        });
};

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.body._id;
        const userData = req.body; // Assuming you send the updated user data in the request body

        delete userData._id

        // Update the user data in the database
        const updatedUser = await User.findByIdAndUpdate(userId, userData, { new: true });

        // If details are updated, convert them to a plain JavaScript object
        if (updatedUser.details) {
            updatedUser.details = updatedUser.details.toObject();
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getUserByEmail = (req, res, next) => {
    const email =  req.params.email;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }
    console.log("email",email);

    User.findOne({ email })
        .then((user) => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json({ user });
        })
        .catch((error) => {
            res.status(500).json({ error: error.message });
        });
};


export const getUserById = (req, res, next) => {
    const userId = req.params.id;

    User.findById(userId)
        .then((user) => {
            if (!user) {
                // If no user found with the provided ID
                return res.status(404).json({
                    message: "User not found",
                });
            }
            res.status(200).json({
                user,
            });
        })
        .catch((error) => {
            // If an error occurs during database query
            res.status(500).json({
                error: error.message,
            });
        });
};



export { registerController, loginController, getAllUser };
