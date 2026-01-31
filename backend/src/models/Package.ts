import mongoose, { Document, Schema } from 'mongoose';

export interface IPackage extends Document {
  influencerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  price: number;
  deliveryTime: number;
  packageType: 'personalized_video' | 'shoutout' | 'consultation';
  isActive: boolean;
  purchaseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const packageSchema = new Schema<IPackage>({
  influencerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Influencer ID is required'],
    validate: {
      validator: async function(influencerId: mongoose.Types.ObjectId) {
        const User = mongoose.model('User');
        const user = await User.findById(influencerId);
        return user && user.accountType === 'influencer';
      },
      message: 'Referenced user must be a verified influencer'
    }
  },
  title: {
    type: String,
    required: [true, 'Package title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Package price is required'],
    min: [1, 'Price must be at least $1'],
    max: [10000, 'Price cannot exceed $10,000'],
    validate: {
      validator: function(v: number) {
        return Number.isInteger(v * 100); // Ensure price has at most 2 decimal places
      },
      message: 'Price must have at most 2 decimal places'
    }
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Delivery time is required'],
    min: [1, 'Delivery time must be at least 1 day'],
    max: [30, 'Delivery time cannot exceed 30 days']
  },
  packageType: {
    type: String,
    required: [true, 'Package type is required'],
    enum: {
      values: ['personalized_video', 'shoutout', 'consultation'],
      message: 'Package type must be personalized_video, shoutout, or consultation'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  purchaseCount: {
    type: Number,
    default: 0,
    min: [0, 'Purchase count cannot be negative']
  }
}, {
  timestamps: true
});

// Validation to ensure influencer doesn't exceed 3 active packages
packageSchema.pre('save', async function(next) {
  if (this.isNew && this.isActive) {
    const activePackageCount = await mongoose.model('Package').countDocuments({
      influencerId: this.influencerId,
      isActive: true
    });
    
    if (activePackageCount >= 3) {
      const error = new Error('Influencer cannot have more than 3 active packages');
      return next(error);
    }
  }
  next();
});

// Indexes for performance
packageSchema.index({ influencerId: 1 });
packageSchema.index({ isActive: 1 });
packageSchema.index({ packageType: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ createdAt: -1 });

// Compound indexes
packageSchema.index({ influencerId: 1, isActive: 1 });
packageSchema.index({ isActive: 1, packageType: 1 });
packageSchema.index({ isActive: 1, price: 1 });

export const Package = mongoose.model<IPackage>('Package', packageSchema);