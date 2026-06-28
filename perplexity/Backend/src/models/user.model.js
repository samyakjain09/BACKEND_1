import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        unique: [true, "username already taken"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: [true, "this email is already taken"],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: 6,
    },
    verified: {
        type: Boolean,
        default: false,
    },
},

    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password'))
        return;
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model('User', userSchema);

export default userModel;