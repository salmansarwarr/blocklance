import Message from '../models/Message.js';

export const saveMessage = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;

        const message = new Message({
            senderId,
            receiverId,
            content
        });

        await message.save();

        res.status(201).json({ message: 'Message saved successfully', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save message', error: error.message });
    }
};
export const getAllMessages = async (req, res) => {
    try {
        const { userId, senderId } = req.params;

        const messages = await Message.find({ receiverId: userId, senderId });

        res.status(200).json({ data: messages });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get messages', error: error.message });
    }
};