import bcrypt from 'bcryptjs';
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  profile: {
    displayName?: string;
    bio?: string;
    profileImage?: string;
    socialMediaAccounts: {
      facebook?: { url: string; followers: number };
      instagram?: { url: string; followers: number };
      youtube?: { url: string; subscribers: number };
      tiktok?: { url: string; followers: number };
    };
  };
  accountType: 'user' | 'influencer' | 'admin';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const socialMediaAccountSchema = new Schema({
  url: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Social media URL must be a valid HTTP/HTTPS URL'
    }
  },
  followers: {
    type: Number,
    min: [0, 'Followers count cannot be negative'],
    default: 0
  },
  subscribers: {
    type: Number,
    min: [0, 'Subscribers count cannot be negative'],
    default: 0
  }
}, { _id: false });

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  profile: {
    displayName: {
      type: String,
      maxlength: [50, 'Display name cannot exceed 50 characters']
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    profileImage: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Profile image must be a valid URL'
      }
    },
    socialMediaAccounts: {
      facebook: socialMediaAccountSchema,
      instagram: socialMediaAccountSchema,
      youtube: socialMediaAccountSchema,
      tiktok: socialMediaAccountSchema
    }
  },
  accountType: {
    type: String,
    enum: {
      values: ['user', 'influencer', 'admin'],
      message: 'Account type must be user, influencer, or admin'
    },
    default: 'user'
  },
  verificationStatus: {
    type: String,
    enum: {
      values: ['pending', 'verified', 'rejected'],
      message: 'Verification status must be pending, verified, or rejected'
    },
    default: 'pending'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ accountType: 1 });
userSchema.index({ verificationStatus: 1 });

export const User = mongoose.model<IUser>('User', userSchema);