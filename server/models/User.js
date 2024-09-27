import mongoose from 'mongoose';
import validator from 'validator';

const { Schema } = mongoose;

const UserSchema = new Schema({
    address: {
        type: String,
        required: true,
        unique:true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
  
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    } ,isSeller: {
        type: Boolean,
        default:false
      },
      details: {
        type: Map, 
        of: Schema.Types.Mixed,
        default: {}
      }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
