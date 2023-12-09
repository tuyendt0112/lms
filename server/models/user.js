const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
//const crypto = require('crypto-js')
const crypto = require('crypto')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: [1, 2, 3],
        default: 3,
    },
    isBlocked: {
        type: String,
        enum: [1, 2],
        default: 2,
    },
    refreshToken: {
        type: String,
    },
    passwordChangedAt:
    {
        type: String,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: String,
    },
    registerToken: {
        type: String,
    },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'Pitch' }],
}, {
    timestamps: true
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, salt)
})
userSchema.methods = {
    isCorrectPassword: async function (password) {
        return await bcrypt.compare(password, this.password)
    },
    createPasswordChangedToken: function () {
        const resetToken = crypto.randomBytes(32).toString('hex')
        this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
        this.passwordResetExpires = Date.now() + 15 * 60 * 1000
        return resetToken
    }
}


//Export the model
module.exports = mongoose.model('User', userSchema);