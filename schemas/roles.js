let mongoose = require('mongoose');

let roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Tên role không được để trống'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            default: ''
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('role', roleSchema);
