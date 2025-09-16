import { IUser } from '@interface/schema.js';
import bcryptjs from 'bcryptjs';
import { Model, model, Schema } from 'mongoose';
import { Document } from 'mongoose';

// 2. Create an interface for the document instance (which includes Mongoose methods).
//    This combines the data interface with Mongoose's Document type.
export interface IUserDocument extends Document, IUser {}

// 3. Create a type for the static Model (optional but good practice).
//    This allows you to add static methods to the User model if needed.
export type IUserModel = Model<IUserDocument>


const userSchema = new Schema<IUserDocument, IUserModel>({
    email: {
        index: true,
        required: true,
        type: String
    },
    name: {
        type: String,
    },
    password: {
        required: function() {
            return this.type === 'email-password'
        },
        type: String,
    },
    type: {
        default: 'email-password',
        enum: ['oAuth', 'email-password'],
        type: String
    }
}, { timestamps: true })

userSchema.pre('save', async function (next){
    if (this.isModified('password') && this.type === 'email-password') {
        this.password = await bcryptjs.hash((this.password ?? '') as string, 10);
    }
    next();
});

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
