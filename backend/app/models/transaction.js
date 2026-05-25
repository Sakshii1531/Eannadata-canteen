import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "userModel",
        },
        userModel: {
            type: String,
            required: true,
            enum: ["Seller", "Delivery", "Admin", "User"],
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
        },
        type: {
            type: String,
            // "Wallet Payment" / "Wallet Refund" added in Phase 1 to fix
            // audit-plan critical finding C-2: orderPlacementService and
            // refund flows were writing these literals, but the schema
            // enum rejected them, aborting wallet-redemption checkouts.
            // The Transaction model is the legacy ledger; Phase 4 migrates
            // these writes onto LedgerEntry. Until then this enum must
            // accept what callers already emit.
            enum: [
                "Order Payment",
                "Delivery Earning",
                "Withdrawal",
                "Refund",
                "Incentive",
                "Bonus",
                "Cash Collection",
                "Cash Settlement",
                "Wallet Payment",
                "Wallet Refund",
            ],
            required: true,
        },
        amount: {
            type: Number, // Positive for earnings, negative for withdrawals/refunds
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Processing", "Settled", "Failed"],
            default: "Pending",
        },
        reference: {
            type: String, // TXN ID or Order ID
            unique: true,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now,
        },
        meta: {
            type: Object,
        },
    },
    { timestamps: true }
);

transactionSchema.index({ user: 1, userModel: 1, createdAt: -1 });
transactionSchema.index({ user: 1, userModel: 1, status: 1, createdAt: -1 });
transactionSchema.index({ order: 1 });
transactionSchema.index({ status: 1, type: 1 });

export default mongoose.model("Transaction", transactionSchema);
