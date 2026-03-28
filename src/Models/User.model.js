import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol:{
        type: String,
        required: true,
        trim: true,
        enum: ["administrador", "investigador", "colaborador"]
    }
},{
    timestamps: true
})

export default mongoose.model("User", userSchema);