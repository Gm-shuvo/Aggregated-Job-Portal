import { call } from 'file-loader';
import mongoose from 'mongoose';

const ApplyJobSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    about: {
        type: String,
        required: true,
    },
    cv: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'shortlisted', 'callForInterview', 'selected', 'rejected',]
    }
}, { timestamps: true });

const AppliedJob = mongoose.models.AppliedJobStatus || mongoose.model('AppliedJobStatus', ApplyJobSchema);

export default AppliedJob;