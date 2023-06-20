import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide a name']
    },
    email:{
        type: String,
        required: [true, 'Please provide a email'],
    },
    password:{
        type: String,
        required: [true, 'Please provide a password'],
    },
    type:{
        type: String,
        required: [true, 'Please provide a type'],
    }
});

const User = mongoose.models.User  || mongoose.model('User', UserSchema);

export default User;