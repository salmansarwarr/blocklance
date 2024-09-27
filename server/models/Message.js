import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
