const mongoose = require('mongoose');

const schema = new mongoose.Schema(
    {
        name: String,
        description: String,
        permissions: Array,
        createdBy : String,
        updatedBy : String,
        deleted : {
            type: Boolean,
            default: false
        },
        deletedBy: String,
        deletedAt: Date
    },
    {
        timestamps: true, //tu dong siknh ra creteedat updatedat
    }
)

const Role = mongoose.model("Role", schema, "role");

module.exports = Role;