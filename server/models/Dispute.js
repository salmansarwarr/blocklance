import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({

    description: { type: String },
    votes: {
        buyerVotes: { type: Number, default: 0 },
        sellerVotes: { type: Number, default: 0 },
    },
    resolved: { type: Boolean, default: false },
    orderId: { type: String },
    buyerEvidence: { type: String },
    sellerEvidence: { type: String },
    raisedBy: { type: String },
    buyerTestimony: { type: String },
    sellerTestimony: { type: String },
    comments: [{ type: String }],
}, { timestamps: true });

const Dispute = mongoose.model('Dispute', disputeSchema);
export default Dispute;
