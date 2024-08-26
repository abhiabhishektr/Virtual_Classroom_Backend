    // src/infrastructure/database/models/Module.ts

    import mongoose, { Schema, Document } from 'mongoose';

    interface IContent {
        type: 'video' | 'document';
        title: string;
        url: string;
        duration?: number; // Duration in seconds, optional for documents
    }

    interface IModule extends Document {
        courseId: mongoose.Types.ObjectId;
        modules: {
            title: string;
            contents: IContent[];
        }[];
        createdAt: Date;
        updatedAt: Date;
    }

    // Define the Module schema
    const ModuleSchema: Schema = new Schema({
        courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, unique: true },
        modules: [
            {
                title: { type: String},
                contents: [
                    {
                        type: { type: String, enum: ['video', 'document'] },
                        title: { type: String },
                        url: { type: String }, // URL for video or document
                        duration: { type: Number } // Duration in seconds for videos
                    }
                ]
            }
        ] 
        ,
    }, { timestamps: true, versionKey: false }); // Automatically handles createdAt and updatedAt

    // Create the Module model
    const Module = mongoose.model<IModule>('Module', ModuleSchema);

    export { IContent, IModule };
    export default Module;
