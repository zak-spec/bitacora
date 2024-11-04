import mongoose from "mongoose";

const tasksSchema=new mongoose.Schema({ 

    title: {
        type: String,
        required: true
    },
    samplingDateTime: {
        type: Date,
        default: Date.now,
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
        scientificName: String,
        commonName: String,
        family: String,
        sampleQuantity: Number,
        plantState: String,
        speciesPhotos: [String]
    }],
    additionalObservations: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Task", tasksSchema);