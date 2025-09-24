import { IUser } from '@interface/schema.js';
import bcryptjs from 'bcryptjs';
import { CallbackError, Document, Model, model, Schema } from 'mongoose';

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
    is_email_verified: {
        default: false,
        required: true,
        type: Boolean
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
    role: {
        default: 'user',
        enum: ['user', 'log_user', 'super_admin'],
        type: String
    },
    type: {
        default: 'email-password',
        enum: ['oAuth', 'email-password'],
        type: String
    }
}, { timestamps: true })

userSchema.pre('save', async function (next){
    if (this.type === 'oAuth') {
        this.is_email_verified = true;
    }
    if (this.isModified('password') && this.type === 'email-password' && this.role === 'user') {
        this.password = await bcryptjs.hash((this.password ?? ''), 10);
    }
    if (this.role === 'log_user' || this.role === 'super_admin') {
        this.type = 'email-password';
    }
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    if (!update || !('$set' in update) || !update.$set || !update.$set.password) {
        next(); 
    } else {
        try {
            const plainPassword = update.$set.password as string;
            const hashedPassword = await bcryptjs.hash(plainPassword, 10);
            
            update.$set.password = hashedPassword;
            next();
        } catch (error) {
            next(error as CallbackError); return;
        }
        
    }
})

const User = model<IUserDocument, IUserModel>('User', userSchema);

export default User;
