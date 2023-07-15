import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name']
    },
    email:{
        type: String,
        required: [true, 'Please provide an email'],
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
    },
    type:{
        type: String,
        required: [true, 'Please provide a type'],
    },
    cv: {
        type: String,
        default: null,
    },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
