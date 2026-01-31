import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;
  amount: number;
  platformFee: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentId?: string;
  deliveryStatus: 'ordered' | 'in_progress' | 'delivered' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  buyerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required']
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required'],
    validate: {
      validator: async function(sellerId: mongoose.Types.ObjectId) {
        const User = mongoose.model('User');
        const user = await User.findById(sellerId);
        return user && user.accountType === 'influencer';
      },
      message: 'Seller must be a verified influencer'
    }
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: [true, 'Package ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [1, 'Amount must be at least $1'],
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v * 100); // Ensure amount has at most 2 decimal places
      },
      message: 'Amount must have at most 2 decimal places'
    }
  },
  platformFee: {
    type: Number,
    required: [true, 'Platform fee is required'],
    min: [0, 'Platform fee cannot be negative'],
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v * 100); // Ensure fee has at most 2 decimal places
      },
      message: 'Platform fee must have at most 2 decimal places'
    }
  },
  paymentStatus: {
    type: String,
    enum: {
      values: ['pending', 'completed', 'failed', 'refunded'],
      message: 'Payment status must be pending, completed, failed, or refunded'
    },
    default: 'pending'
  },
  stripePaymentId: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^(pi_|ch_|in_)/.test(v); // Stripe payment intent, charge, or invoice ID format
      },
      message: 'Invalid Stripe payment ID format'
    }
  },
  deliveryStatus: {
    type: String,
    enum: {
      values: ['ordered', 'in_progress', 'delivered', 'completed'],
      message: 'Delivery status must be ordered, in_progress, delivered, or completed'
    },
    default: 'ordered'
  }
}, {
  timestamps: true
});

// Validation to ensure buyer and seller are different
transactionSchema.pre('save', function(next) {
  if (this.buyerId.equals(this.sellerId)) {
    const error = new Error('Buyer and seller cannot be the same user');
    return next(error);
  }
  next();
});

// Validation to ensure platform fee doesn't exceed amount
transactionSchema.pre('save', function(next) {
  if (this.platformFee > this.amount) {
    const error = new Error('Platform fee cannot exceed transaction amount');
    return next(error);
  }
  next();
});

// Indexes for performance
transactionSchema.index({ buyerId: 1 });
transactionSchema.index({ sellerId: 1 });
transactionSchema.index({ packageId: 1 });
transactionSchema.index({ paymentStatus: 1 });
transactionSchema.index({ deliveryStatus: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ stripePaymentId: 1 });

// Compound indexes
transactionSchema.index({ buyerId: 1, paymentStatus: 1 });
transactionSchema.index({ sellerId: 1, paymentStatus: 1 });
transactionSchema.index({ paymentStatus: 1, deliveryStatus: 1 });

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);