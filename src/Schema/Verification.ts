import { Document, Model, model, Schema, Types } from 'mongoose';


export interface IKYCSchema extends Document, KYCTypes {}

export type KYCModal = Model<IKYCSchema>;

export interface KYCTypes {
    code: number;
    expires_at: Date;
    type:  VerificationType;
    user: Types.ObjectId;
}

export type VerificationType = 'change-password' | 'email-verify' | 'reset-password';

const VerfificationSchema = new Schema<IKYCSchema, KYCModal>({
    code: {
        required: true,
        type: Number
    },
    expires_at: {
        required: true,
        type: Date
    },
    type: {
        default: 'reset-password',
        enum: ['change-password', 'email-verify', 'reset-password'],
        required: true,
        type: String
    },
    user: {
        ref: 'User',
        type: Schema.Types.ObjectId,
    }
}, {  timestamps: true });

const Verfication = model<IKYCSchema, KYCModal>('verification', VerfificationSchema);

export default Verfication;