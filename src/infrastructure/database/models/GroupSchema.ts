import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
    name: string;
    members: string[]; // Array of user IDs
}

const GroupSchema: Schema = new Schema({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
}, { timestamps: true });

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
