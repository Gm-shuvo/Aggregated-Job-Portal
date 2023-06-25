import mongoose from 'mongoose';
import User from './User';
import Job from './Job'

const bookMarkSchema = new mongoose.Schema({

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    job : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'job',
    },


},{timestamps: true});

const BookMarkJob =  mongoose.models.BookMarkJob || mongoose.model('BookMarkJob', bookMarkSchema);

export default BookMarkJob;