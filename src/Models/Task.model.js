import mongoose from "mongoose";

const tasksSchema = new mongoose.Schema({ 

    title: {
        type: String,
        required: true
    },
    samplingDateTime: {
        type: Date,
        required: true
    },
    location: {
        type: {
            latitude: Number,
            longitude: Number
        },
        required: true
    },
    weatherConditions: {
        type: String,
        required: true
    },
    habitatDescription: {
        type: String,
        required: true
    },
    samplingPhotos: {
        type: [String],
        required: true
    },
    speciesDetails: [{
        scientificName: {
            type: String,
            required: true
        },
        commonName: {
            type: String,
            required: true
        },
        family: {
            type: String,
            required: true
        },
        sampleQuantity: {
            type: Number,
            required: true,
            min: 1
        },
        plantState: {
            type: String,
            required: true
        },
        speciesPhotos: {
            type: [String],
            required: true
        }
    }],
    additionalObservations: String,
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Task", tasksSchema);