const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,  // one whow is subscribing.
            ref: "User"
        }, 

        channel: {
            type: Schema.Types.ObjectId, // one to who subscriber is subscribing.
            ref: "User"
        }
    }, 

    {
        timestamps: true
    }
);


const subscriptionModel = mongoose.model("Subscription", subscriptionSchema);

module.exports = subscriptionModel;