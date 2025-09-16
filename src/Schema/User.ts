import { Model, Schema, model } from 'mongoose';
import bcryptjs from 'bcryptjs';
import { IUser } from '../interface/schema.js';
import { Document } from 'mongoose';

// 2. Create an interface for the document instance (which includes Mongoose methods).
//    This combines the data interface with Mongoose's Document type.
export interface IUserDocument extends IUser, Document {}

// 3. Create a type for the static Model (optional but good practice).
//    This allows you to add static methods to the User model if needed.
export interface IUserModel extends Model<IUserDocument> {}


const userSchema = new Schema<IUserDocument, IUserModel>({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['oAuth', 'email-password'],
        default: 'email-password'
    },
    password: {
        type: String,
        required: function() {
            return this.type?.toString() === 'email-password'
        },
    }
}, { timestamps: true })

userSchema.pre('save', async function (next){
    if (this.isModified('password') && this.type === 'email-password') {
        this.password = await bcryptjs.hash(this.password!, 10);
    }
    next();
});

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
